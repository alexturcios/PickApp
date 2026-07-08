import { HttpTypes } from "@medusajs/types"
import { z } from "zod"
import {
  MediaSchema,
  ProductCreateSchema,
} from "../../routes/products/product-create/constants"

/**
 * Flujo Avanzado — serialización del asistente completo de creación de
 * producto hacia POST /vendor/products. Extraído del formulario para que la
 * misma lógica sea verificable con pruebas puras.
 */

type AdvancedValues = z.infer<typeof ProductCreateSchema>
type Media = z.infer<typeof MediaSchema>

export type UploadedMedia = HttpTypes.AdminFile & { isThumbnail: boolean }

/** Guardia de imagen: aplica a todos los flujos de creación. */
export const hasProductImage = (media: Media[] | undefined | null): boolean =>
  Boolean(media && media.length > 0)

export const buildAdvancedProductPayload = (
  values: AdvancedValues,
  uploadedMedia: UploadedMedia[],
  status: "draft" | "proposed"
) => {
  const payload = { ...values, media: undefined }

  return {
    ...payload,
    status,
    images: uploadedMedia,
    weight: parseInt(payload.weight || "") || undefined,
    length: parseInt(payload.length || "") || undefined,
    height: parseInt(payload.height || "") || undefined,
    width: parseInt(payload.width || "") || undefined,
    type_id: payload.type_id || undefined,
    tags:
      payload.tags?.map((tag) => ({
        id: tag,
      })) || [],
    collection_id: payload.collection_id || undefined,
    shipping_profile_id: undefined,
    enable_variants: undefined,
    additional_data: undefined,
    categories: payload.categories.map((cat) => ({
      id: cat,
    })),
    variants: payload.variants.map((variant) => ({
      ...variant,
      sku: variant.sku === "" ? undefined : variant.sku,
      manage_inventory: true,
      allow_backorder: false,
      should_create: undefined,
      is_default: undefined,
      inventory_kit: undefined,
      inventory: undefined,
      prices: Object.keys(variant.prices || {}).map((key) => ({
        currency_code: key,
        amount: parseFloat(variant.prices?.[key] as string),
      })),
    })),
  }
}
