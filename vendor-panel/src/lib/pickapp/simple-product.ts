import { z } from "zod"

/**
 * Flujo Simple — creación de producto en 4 campos para vendedores que vienen
 * de Instagram/WhatsApp. Toda la lógica es pura para poder probarla sin DOM.
 */

/** Mensaje de guardia: ningún producto se publica sin foto. */
export const IMAGE_REQUIRED_MESSAGE =
  "¡Alto! Tu producto necesita al menos una imagen para que tus clientes puedan comprarlo. Sube una foto clara para continuar."

export const TITLE_PLACEHOLDERS = [
  "Ej. Ropa de lino hecha en Valle de Ángeles",
  "Ej. Termo personalizado de acero",
]

/** Moneda de Pickapp: Lempira hondureño. */
export const CURRENCY_CODE = "hnl"

export const SimpleMediaSchema = z.object({
  url: z.string().min(1),
  file: z.any().nullable(),
})

export type SimpleMedia = z.infer<typeof SimpleMediaSchema>

export const SimpleProductSchema = z.object({
  nombre: z.string().trim().min(1, "Escribe el nombre de tu producto."),
  precio: z
    .string()
    .trim()
    .min(1, "Escribe el precio de venta en Lempiras.")
    .refine((v) => Number.isFinite(parseLempiras(v)), {
      message: "El precio debe ser un número, ej. 450 o 1,250.50.",
    })
    .refine((v) => parseLempiras(v) > 0, {
      message: "El precio debe ser mayor que cero.",
    }),
  categoria_id: z.string().min(1, "Elige la categoría de tu producto."),
  fotos: z.array(SimpleMediaSchema).min(1, IMAGE_REQUIRED_MESSAGE),
})

export type SimpleProductValues = z.infer<typeof SimpleProductSchema>

/** Convierte una entrada del usuario ("1,250.50", "L. 450") a número. */
export const parseLempiras = (input: string): number => {
  const cleaned = input.replace(/[Ll]\.?\s*/g, "").replace(/,/g, "")
  return parseFloat(cleaned)
}

/** Formatea un número como precio en Lempiras: 1250.5 → "L. 1,250.50". */
export const formatLempiras = (amount: number): string => {
  if (!Number.isFinite(amount)) {
    return ""
  }
  return `L. ${amount.toLocaleString("es-HN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export type UploadedImage = { url: string; id?: string }

/**
 * Construye el payload de POST /vendor/products para el Flujo Simple:
 * una sola variante con precio en Lempiras y sin jerga técnica.
 */
export const buildSimpleProductPayload = (
  values: SimpleProductValues,
  uploadedImages: UploadedImage[],
  salesChannelId?: string
) => {
  return {
    title: values.nombre.trim(),
    status: "proposed" as const,
    discountable: true,
    images: uploadedImages,
    thumbnail: uploadedImages[0]?.url,
    categories: [{ id: values.categoria_id }],
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
            amount: parseLempiras(values.precio),
          },
        ],
      },
    ],
  }
}

export type SimpleSubmitDeps = {
  uploadFiles: (files: SimpleMedia[]) => Promise<{ files: UploadedImage[] }>
  createProduct: (payload: Record<string, unknown>) => Promise<unknown>
  salesChannelId?: string
}

export type SimpleSubmitResult =
  | { ok: true; product: unknown }
  | { ok: false; errors: Record<string, string> }

/**
 * Orquesta el envío del Flujo Simple. Si la validación falla (incluida la
 * falta de imagen) NO se hace ninguna llamada de red: el payload nunca sale
 * del cliente.
 */
export const submitSimpleProduct = async (
  values: SimpleProductValues,
  deps: SimpleSubmitDeps
): Promise<SimpleSubmitResult> => {
  const parsed = SimpleProductSchema.safeParse(values)

  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form")
      if (!errors[field]) {
        errors[field] = issue.message
      }
    }
    return { ok: false, errors }
  }

  const uploaded = await deps.uploadFiles(parsed.data.fotos)
  const payload = buildSimpleProductPayload(
    parsed.data,
    uploaded.files,
    deps.salesChannelId
  )
  const product = await deps.createProduct(payload)

  return { ok: true, product }
}
