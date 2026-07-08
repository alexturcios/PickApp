import { describe, expect, test, vi } from "vitest"
import {
  BULK_TEMPLATE_HEADERS,
  getBulkTemplateCsv,
  parseBulkCsv,
  runBulkUpload,
  validateBulkRow,
} from "../bulk-csv"

const CATEGORIES = {
  "moda y calzado": "pcat_moda",
  "accesorios tecnológicos": "pcat_tec",
}

const validCsv = [
  "Nombre,Precio_Lempiras,Descripcion,Inventario_Disponible,Categoria,Url_Imagen",
  '"Ropa de lino, hecha en Valle de Ángeles",850,Camisa artesanal,10,Moda y Calzado,https://cdn.pickapp.hn/lino.jpg',
  "Termo personalizado de acero,450,Termo de 750 ml,25,Accesorios Tecnológicos,https://cdn.pickapp.hn/termo.jpg",
  "Cartera de cuero,1200,Cuero legítimo,5,Moda y Calzado,https://cdn.pickapp.hn/cartera.jpg",
].join("\r\n")

describe("Caso 3 — Carga Masiva: plantilla y parser", () => {
  test("la plantilla descargable trae las columnas en español", () => {
    const template = getBulkTemplateCsv()
    const header = template.split("\r\n")[0]
    expect(header).toBe(
      "Nombre,Precio_Lempiras,Descripcion,Inventario_Disponible,Categoria,Url_Imagen"
    )
    // La propia plantilla de ejemplo debe parsear sin errores
    const parsed = parseBulkCsv(template)
    expect(parsed.errors).toEqual([])
    expect(parsed.rows).toHaveLength(2)
  })

  test("un CSV válido de varias filas parsea limpio, incluyendo comas entre comillas", () => {
    const { rows, errors } = parseBulkCsv(validCsv)

    expect(errors).toEqual([])
    expect(rows).toHaveLength(3)
    expect(rows[0].data.Nombre).toBe(
      "Ropa de lino, hecha en Valle de Ángeles"
    )
    expect(rows[1].data.Precio_Lempiras).toBe("450")
    expect(rows[2].line).toBe(4)
  })

  test("acepta punto y coma como separador (Excel en español)", () => {
    const csv = [
      BULK_TEMPLATE_HEADERS.join(";"),
      "Termo de acero;450;Termo;10;Moda y Calzado;https://cdn.pickapp.hn/t.jpg",
    ].join("\n")

    const { rows, errors } = parseBulkCsv(csv)
    expect(errors).toEqual([])
    expect(rows).toHaveLength(1)
    expect(rows[0].data.Url_Imagen).toBe("https://cdn.pickapp.hn/t.jpg")
  })

  test("archivo vacío o sin encabezados: error claro, sin excepción", () => {
    expect(parseBulkCsv("").errors[0].message).toMatch(/vacío/)
    const wrongHeaders = parseBulkCsv("Producto,Precio\nTermo,450")
    expect(wrongHeaders.errors[0].message).toMatch(/Faltan las columnas/)
    expect(wrongHeaders.rows).toEqual([])
  })
})

describe("Caso 3 — Carga Masiva: creación de filas válidas", () => {
  test("recorre todas las filas y genera un producto por cada una", async () => {
    const createProduct = vi.fn().mockResolvedValue({ product: {} })

    const result = await runBulkUpload(validCsv, {
      createProduct,
      categoryIdByName: CATEGORIES,
      salesChannelId: "sc_1",
    })

    expect(result.errors).toEqual([])
    expect(result.created).toHaveLength(3)
    expect(createProduct).toHaveBeenCalledTimes(3)

    const first = createProduct.mock.calls[0][0]
    expect(first.title).toBe("Ropa de lino, hecha en Valle de Ángeles")
    expect(first.categories).toEqual([{ id: "pcat_moda" }])
    expect(first.images).toEqual([
      { url: "https://cdn.pickapp.hn/lino.jpg" },
    ])
    expect(first.variants[0].prices).toEqual([
      { currency_code: "hnl", amount: 850 },
    ])
    expect(first.sales_channels).toEqual([{ id: "sc_1" }])
  })

  test("reporta el avance fila por fila", async () => {
    const onRowDone = vi.fn()
    await runBulkUpload(validCsv, {
      createProduct: vi.fn().mockResolvedValue({}),
      categoryIdByName: CATEGORIES,
      onRowDone,
    })

    expect(onRowDone).toHaveBeenCalledTimes(3)
    expect(onRowDone).toHaveBeenLastCalledWith(3, 3)
  })
})

describe("Caso 3 — Carga Masiva: archivo corrupto o incompleto", () => {
  const corruptCsv = [
    "Nombre,Precio_Lempiras,Descripcion,Inventario_Disponible,Categoria,Url_Imagen",
    // Fila 2: sin imagen
    "Collar artesanal,300,Collar de jade,5,Moda y Calzado,",
    // Fila 3: precio no numérico
    "Aretes de plata,caro,Aretes,3,Moda y Calzado,https://cdn.pickapp.hn/aretes.jpg",
    // Fila 4: válida — debe crearse aunque las demás fallen
    "Pulsera de cuero,150,Pulsera,8,Moda y Calzado,https://cdn.pickapp.hn/pulsera.jpg",
    // Fila 5: columnas de menos
    "Producto roto,100",
    // Fila 6: categoría inexistente
    "Gorra bordada,250,Gorra,4,Comida Rápida,https://cdn.pickapp.hn/gorra.jpg",
  ].join("\n")

  test("captura cada fila mala con su número y español claro; nunca lanza", async () => {
    const createProduct = vi.fn().mockResolvedValue({ product: {} })

    const result = await runBulkUpload(corruptCsv, {
      createProduct,
      categoryIdByName: CATEGORIES,
    })

    // Solo la fila 4 era válida
    expect(result.created).toEqual([{ line: 4, title: "Pulsera de cuero" }])
    expect(createProduct).toHaveBeenCalledTimes(1)

    const messages = result.errors.map((e) => e.message)
    expect(messages.some((m) => m.startsWith("Fila 2:") && /imagen/i.test(m))).toBe(true)
    expect(messages.some((m) => m.startsWith("Fila 3:") && m.includes("caro"))).toBe(true)
    expect(messages.some((m) => m.startsWith("Fila 5:") && /columnas/.test(m))).toBe(true)
    expect(
      messages.some((m) => m.startsWith("Fila 6:") && m.includes("Comida Rápida"))
    ).toBe(true)

    // Nada de stack traces: todos los mensajes son oraciones en español
    for (const message of messages) {
      expect(message).not.toMatch(/error:|exception|undefined|null|stack/i)
    }
  })

  test("si el backend falla en una fila, las demás continúan y el fallo se reporta en español", async () => {
    const createProduct = vi
      .fn()
      .mockRejectedValueOnce(new Error("ECONNRESET"))
      .mockResolvedValue({ product: {} })

    const result = await runBulkUpload(validCsv, {
      createProduct,
      categoryIdByName: CATEGORIES,
    })

    expect(createProduct).toHaveBeenCalledTimes(3)
    expect(result.created).toHaveLength(2)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].message).toMatch(/^Fila 2: no pudimos guardar/)
  })

  test("validateBulkRow exige la imagen en cada fila", () => {
    const row = {
      Nombre: "Collar",
      Precio_Lempiras: "300",
      Descripcion: "",
      Inventario_Disponible: "1",
      Categoria: "Moda y Calzado",
      Url_Imagen: "",
    }
    const errors = validateBulkRow(row, 2, Object.keys(CATEGORIES))
    expect(errors).toHaveLength(1)
    expect(errors[0].message).toMatch(/Url_Imagen/)
  })
})
