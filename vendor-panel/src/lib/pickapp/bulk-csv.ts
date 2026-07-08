import { CURRENCY_CODE, IMAGE_REQUIRED_MESSAGE } from "./simple-product"

/**
 * Carga Masiva — plantilla CSV simplificada en español, parser tolerante y
 * validación con mensajes claros por fila (nunca stack traces).
 */

export const BULK_TEMPLATE_HEADERS = [
  "Nombre",
  "Precio_Lempiras",
  "Descripcion",
  "Inventario_Disponible",
  "Categoria",
  "Url_Imagen",
] as const

export type BulkHeader = (typeof BULK_TEMPLATE_HEADERS)[number]

export type BulkRow = Record<BulkHeader, string>

const TEMPLATE_EXAMPLE_ROWS = [
  [
    "Ropa de lino hecha en Valle de Ángeles",
    "850",
    "Camisa de lino 100% artesanal, talla única",
    "10",
    "Moda y Calzado",
    "https://ejemplo.com/fotos/camisa-lino.jpg",
  ],
  [
    "Termo personalizado de acero",
    "450",
    "Termo de acero inoxidable de 750 ml con grabado",
    "25",
    "Accesorios Tecnológicos",
    "https://ejemplo.com/fotos/termo-acero.jpg",
  ],
]

/** Contenido de la plantilla descargable. */
export const getBulkTemplateCsv = (): string => {
  const lines = [
    BULK_TEMPLATE_HEADERS.join(","),
    ...TEMPLATE_EXAMPLE_ROWS.map((row) =>
      row.map((cell) => (cell.includes(",") ? `"${cell}"` : cell)).join(",")
    ),
  ]
  return lines.join("\r\n")
}

export const getBulkTemplateDataUri = (): string =>
  `data:text/csv;charset=utf-8,${encodeURIComponent(getBulkTemplateCsv())}`

export type RowError = { line: number; message: string }

export type ParseResult = {
  rows: { line: number; data: BulkRow }[]
  errors: RowError[]
}

/** Divide una línea CSV respetando comillas. */
const splitCsvLine = (line: string, delimiter: string): string[] => {
  const cells: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === delimiter) {
      cells.push(current)
      current = ""
    } else {
      current += char
    }
  }

  cells.push(current)
  return cells.map((c) => c.trim())
}

/**
 * Parsea el CSV completo. Nunca lanza: todos los problemas se devuelven como
 * errores por fila en español. Acepta coma o punto y coma como separador
 * (Excel en español exporta con punto y coma).
 */
export const parseBulkCsv = (text: string): ParseResult => {
  const result: ParseResult = { rows: [], errors: [] }

  const lines = text
    .replace(/^﻿/, "") // BOM de Excel
    .split(/\r\n|\n|\r/)

  const headerIndex = lines.findIndex((l) => l.trim() !== "")
  if (headerIndex === -1) {
    result.errors.push({
      line: 1,
      message: "El archivo está vacío. Descarga la plantilla y llénala.",
    })
    return result
  }

  const headerLine = lines[headerIndex]
  const delimiter =
    headerLine.split(";").length > headerLine.split(",").length ? ";" : ","

  const headers = splitCsvLine(headerLine, delimiter)
  const missingHeaders = BULK_TEMPLATE_HEADERS.filter(
    (h) => !headers.includes(h)
  )
  if (missingHeaders.length > 0) {
    result.errors.push({
      line: headerIndex + 1,
      message: `Faltan las columnas: ${missingHeaders.join(", ")}. Usa la plantilla descargable para asegurarte del formato.`,
    })
    return result
  }

  for (let i = headerIndex + 1; i < lines.length; i++) {
    const raw = lines[i]
    if (raw.trim() === "") {
      continue
    }

    const lineNumber = i + 1
    const cells = splitCsvLine(raw, delimiter)

    if (cells.length !== headers.length) {
      result.errors.push({
        line: lineNumber,
        message: `Fila ${lineNumber}: tiene ${cells.length} columnas y esperábamos ${headers.length}. Revisa que no falte ni sobre ninguna coma.`,
      })
      continue
    }

    const data = {} as BulkRow
    headers.forEach((h, idx) => {
      if ((BULK_TEMPLATE_HEADERS as readonly string[]).includes(h)) {
        data[h as BulkHeader] = cells[idx]
      }
    })

    result.rows.push({ line: lineNumber, data })
  }

  return result
}

/** Valida una fila ya parseada. Devuelve mensajes en español, o [] si está bien. */
export const validateBulkRow = (
  row: BulkRow,
  line: number,
  categoryNames?: string[]
): RowError[] => {
  const errors: RowError[] = []
  const at = (message: string) => errors.push({ line, message })

  if (!row.Nombre?.trim()) {
    at(`Fila ${line}: falta el nombre del producto (columna Nombre).`)
  }

  const price = parseFloat(row.Precio_Lempiras?.replace(/,/g, ""))
  if (!row.Precio_Lempiras?.trim()) {
    at(`Fila ${line}: falta el precio en Lempiras (columna Precio_Lempiras).`)
  } else if (!Number.isFinite(price) || price <= 0) {
    at(
      `Fila ${line}: el precio "${row.Precio_Lempiras}" no es válido. Escribe solo números, ej. 450 o 1250.50.`
    )
  }

  if (row.Inventario_Disponible?.trim()) {
    const qty = parseInt(row.Inventario_Disponible, 10)
    if (!Number.isFinite(qty) || qty < 0) {
      at(
        `Fila ${line}: el inventario "${row.Inventario_Disponible}" no es válido. Escribe un número entero, ej. 10.`
      )
    }
  }

  if (!row.Categoria?.trim()) {
    at(`Fila ${line}: falta la categoría (columna Categoria).`)
  } else if (
    categoryNames &&
    !categoryNames.some(
      (c) => c.toLowerCase() === row.Categoria.trim().toLowerCase()
    )
  ) {
    at(
      `Fila ${line}: la categoría "${row.Categoria}" no existe en Pickapp. Las disponibles son: ${categoryNames.join(", ")}.`
    )
  }

  if (!row.Url_Imagen?.trim()) {
    at(`Fila ${line}: falta la foto del producto (columna Url_Imagen). ${IMAGE_REQUIRED_MESSAGE}`)
  } else if (!/^https?:\/\/\S+$/i.test(row.Url_Imagen.trim())) {
    at(
      `Fila ${line}: el enlace de la imagen "${row.Url_Imagen}" no es válido. Debe empezar con http:// o https://.`
    )
  }

  return errors
}

/** Construye el payload de POST /vendor/products para una fila válida. */
export const buildBulkProductPayload = (
  row: BulkRow,
  categoryIdByName?: Record<string, string>,
  salesChannelId?: string
) => {
  const categoryId =
    categoryIdByName?.[row.Categoria.trim().toLowerCase()] ?? undefined
  const imageUrl = row.Url_Imagen.trim()

  return {
    title: row.Nombre.trim(),
    description: row.Descripcion?.trim() || undefined,
    status: "proposed" as const,
    discountable: true,
    images: [{ url: imageUrl }],
    thumbnail: imageUrl,
    categories: categoryId ? [{ id: categoryId }] : [],
    sales_channels: salesChannelId ? [{ id: salesChannelId }] : undefined,
    options: [{ title: "Presentación", values: ["Única"] }],
    variants: [
      {
        title: "Única",
        options: { Presentación: "Única" },
        variant_rank: 0,
        manage_inventory: true,
        allow_backorder: false,
        prices: [
          {
            currency_code: CURRENCY_CODE,
            amount: parseFloat(row.Precio_Lempiras.replace(/,/g, "")),
          },
        ],
      },
    ],
  }
}

export type BulkUploadDeps = {
  createProduct: (payload: Record<string, unknown>) => Promise<unknown>
  categoryIdByName?: Record<string, string>
  salesChannelId?: string
  onRowDone?: (done: number, total: number) => void
}

export type BulkUploadResult = {
  created: { line: number; title: string }[]
  errors: RowError[]
}

/**
 * Procesa un CSV completo: valida cada fila y crea los productos válidos uno
 * por uno. Una fila mala nunca detiene a las demás ni tumba el panel — se
 * reporta en español con su número de fila.
 */
export const runBulkUpload = async (
  text: string,
  deps: BulkUploadDeps
): Promise<BulkUploadResult> => {
  const { rows, errors } = parseBulkCsv(text)
  const result: BulkUploadResult = { created: [], errors: [...errors] }

  const categoryNames = deps.categoryIdByName
    ? Object.keys(deps.categoryIdByName)
    : undefined

  const validRows: typeof rows = []
  for (const { line, data } of rows) {
    const rowErrors = validateBulkRow(data, line, categoryNames)
    if (rowErrors.length > 0) {
      result.errors.push(...rowErrors)
    } else {
      validRows.push({ line, data })
    }
  }

  let done = 0
  for (const { line, data } of validRows) {
    try {
      await deps.createProduct(
        buildBulkProductPayload(data, deps.categoryIdByName, deps.salesChannelId)
      )
      result.created.push({ line, title: data.Nombre.trim() })
    } catch (error) {
      const detail =
        error instanceof Error && error.message ? ` (${error.message})` : ""
      result.errors.push({
        line,
        message: `Fila ${line}: no pudimos guardar "${data.Nombre.trim()}". Inténtalo de nuevo en unos minutos.${detail}`,
      })
    }
    done++
    deps.onRowDone?.(done, validRows.length)
  }

  return result
}
