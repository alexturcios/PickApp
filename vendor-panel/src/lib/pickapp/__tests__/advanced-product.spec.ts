import { describe, expect, test } from "vitest"
import {
  buildAdvancedProductPayload,
  hasProductImage,
} from "../advanced-product"
import {
  LOCKER_SIZES,
  lockerDimsForProduct,
  lockerSizeForDims,
} from "../locker-sizes"
import {
  IMAGE_REQUIRED_MESSAGE,
} from "../simple-product"
import { ProductCreateSchema } from "../../../routes/products/product-create/constants"

/** Valores de un Flujo Avanzado completo: tallas S/M/L + casillero Mediano. */
const advancedValues = () => {
  const dims = lockerDimsForProduct("M")

  const variantFor = (talla: string, rank: number) => ({
    should_create: true,
    title: talla,
    options: { Talla: talla },
    variant_rank: rank,
    sku: `LINO-${talla}`,
    manage_inventory: true,
    allow_backorder: false,
    inventory_kit: false,
    prices: { hnl: "850" },
  })

  return {
    title: "Ropa de lino hecha en Valle de Ángeles",
    subtitle: "",
    handle: "",
    description: "Camisa de lino artesanal",
    discountable: true,
    type_id: "",
    collection_id: "",
    shipping_profile_id: "",
    categories: ["pcat_moda"],
    tags: ["tag_artesanal"],
    sales_channels: [{ id: "sc_1", name: "Pickapp" }],
    origin_country: "",
    material: "Lino",
    width: dims.width,
    length: dims.length,
    height: dims.height,
    weight: "1",
    mid_code: "",
    hs_code: "",
    options: [{ title: "Talla", values: ["Pequeña", "Mediana", "Grande"] }],
    enable_variants: true,
    variants: [
      variantFor("Pequeña", 0),
      variantFor("Mediana", 1),
      variantFor("Grande", 2),
    ],
    media: [
      {
        url: "blob:preview-1",
        isThumbnail: true,
        file: {},
      },
    ],
  }
}

describe("Caso 2 — Flujo Avanzado: variantes y dimensiones de casillero", () => {
  test("el esquema acepta la configuración multi-variante completa", () => {
    const parsed = ProductCreateSchema.safeParse(advancedValues())
    expect(parsed.success).toBe(true)
  })

  test("el esquema rechaza el producto sin imagen con el mensaje de guardia", () => {
    const values = { ...advancedValues(), media: [] }
    const parsed = ProductCreateSchema.safeParse(values)

    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      const mediaIssue = parsed.error.issues.find(
        (issue) => issue.path[0] === "media"
      )
      expect(mediaIssue?.message).toBe(IMAGE_REQUIRED_MESSAGE)
    }
  })

  test("todas las variantes anidadas serializan al endpoint con sus precios", () => {
    const uploaded = [
      { id: "file_1", url: "https://cdn.pickapp.hn/lino.jpg", isThumbnail: true },
    ] as any

    const payload = buildAdvancedProductPayload(
      advancedValues() as any,
      uploaded,
      "proposed"
    )

    expect(payload.status).toBe("proposed")
    expect(payload.images).toEqual(uploaded)
    expect(payload.media).toBeUndefined()

    // Variantes: tallas S/M/L con sus SKU y precios en Lempiras
    expect(payload.variants).toHaveLength(3)
    const titles = payload.variants.map((v: any) => v.title)
    expect(titles).toEqual(["Pequeña", "Mediana", "Grande"])

    for (const variant of payload.variants as any[]) {
      expect(variant.manage_inventory).toBe(true)
      expect(variant.allow_backorder).toBe(false)
      expect(variant.prices).toEqual([{ currency_code: "hnl", amount: 850 }])
      // Campos internos del formulario que nunca deben llegar al endpoint
      expect(variant.should_create).toBeUndefined()
      expect(variant.is_default).toBeUndefined()
      expect(variant.inventory_kit).toBeUndefined()
      expect(variant.inventory).toBeUndefined()
    }

    expect(payload.variants[0].sku).toBe("LINO-Pequeña")
    expect(payload.categories).toEqual([{ id: "pcat_moda" }])
    expect(payload.tags).toEqual([{ id: "tag_artesanal" }])
  })

  test("las dimensiones del casillero Mediano llegan como números al payload", () => {
    const payload = buildAdvancedProductPayload(
      advancedValues() as any,
      [],
      "draft"
    )

    // Casillero Mediano = 45 × 35 × 32 cm
    expect(payload.width).toBe(45)
    expect(payload.length).toBe(35)
    expect(payload.height).toBe(32)
    expect(payload.status).toBe("draft")
  })

  test("guardia de imagen del flujo avanzado", () => {
    expect(hasProductImage([])).toBe(false)
    expect(hasProductImage(undefined)).toBe(false)
    expect(
      hasProductImage([{ url: "blob:x", isThumbnail: false, file: null }])
    ).toBe(true)
  })
})

describe("Tamaños de casillero Pickapp", () => {
  test("los tres compartimientos coinciden con la red física de Tegucigalpa", () => {
    expect(LOCKER_SIZES.map((s) => s.id)).toEqual(["S", "M", "L"])
    expect(lockerDimsForProduct("S")).toEqual({
      width: "45",
      length: "35",
      height: "12",
    })
    expect(lockerDimsForProduct("L")).toEqual({
      width: "45",
      length: "35",
      height: "62",
    })
  })

  test("un paquete se asigna al compartimiento más pequeño donde cabe", () => {
    expect(lockerSizeForDims({ width: 20, length: 20, height: 10 })).toBe("S")
    expect(lockerSizeForDims({ width: 40, length: 30, height: 30 })).toBe("M")
    expect(lockerSizeForDims({ width: 45, length: 35, height: 60 })).toBe("L")
    expect(lockerSizeForDims({ width: 80, length: 80, height: 80 })).toBeNull()
  })
})
