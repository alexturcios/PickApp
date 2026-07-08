import { describe, expect, test, vi } from "vitest"
import {
  IMAGE_REQUIRED_MESSAGE,
  buildSimpleProductPayload,
  formatLempiras,
  parseLempiras,
  submitSimpleProduct,
} from "../simple-product"

const validValues = {
  nombre: "Termo personalizado de acero",
  precio: "L. 1,250.50",
  categoria_id: "pcat_tecnologia",
  fotos: [{ url: "blob:local-preview", file: {} }],
}

describe("Caso 1 — Flujo Simple: creación con imagen", () => {
  test("con imagen: sube archivos, despacha la creación y mapea el payload al modelo", async () => {
    const uploadFiles = vi
      .fn()
      .mockResolvedValue({ files: [{ url: "https://cdn.pickapp.hn/termo.jpg" }] })
    const createProduct = vi
      .fn()
      .mockResolvedValue({ product: { id: "prod_123" } })

    const result = await submitSimpleProduct(validValues, {
      uploadFiles,
      createProduct,
      salesChannelId: "sc_tegucigalpa",
    })

    expect(result.ok).toBe(true)
    expect(uploadFiles).toHaveBeenCalledTimes(1)
    expect(createProduct).toHaveBeenCalledTimes(1)

    const payload = createProduct.mock.calls[0][0]
    // Mapeo exacto al modelo de POST /vendor/products
    expect(payload.title).toBe("Termo personalizado de acero")
    expect(payload.status).toBe("proposed")
    expect(payload.categories).toEqual([{ id: "pcat_tecnologia" }])
    expect(payload.sales_channels).toEqual([{ id: "sc_tegucigalpa" }])
    expect(payload.images).toEqual([
      { url: "https://cdn.pickapp.hn/termo.jpg" },
    ])
    expect(payload.thumbnail).toBe("https://cdn.pickapp.hn/termo.jpg")
    expect(payload.options).toEqual([
      { title: "Presentación", values: ["Única"] },
    ])
    expect(payload.variants).toHaveLength(1)
    expect(payload.variants[0]).toMatchObject({
      title: "Única",
      manage_inventory: true,
      allow_backorder: false,
      variant_rank: 0,
      prices: [{ currency_code: "hnl", amount: 1250.5 }],
    })
  })

  test("sin imagen: el envío se bloquea y el payload de red NUNCA se despacha", async () => {
    const uploadFiles = vi.fn()
    const createProduct = vi.fn()

    const result = await submitSimpleProduct(
      { ...validValues, fotos: [] },
      { uploadFiles, createProduct }
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.fotos).toBe(IMAGE_REQUIRED_MESSAGE)
    }
    expect(uploadFiles).not.toHaveBeenCalled()
    expect(createProduct).not.toHaveBeenCalled()
  })

  test("precio inválido: también se bloquea sin llamadas de red", async () => {
    const uploadFiles = vi.fn()
    const createProduct = vi.fn()

    const result = await submitSimpleProduct(
      { ...validValues, precio: "gratis" },
      { uploadFiles, createProduct }
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.precio).toMatch(/precio/i)
    }
    expect(uploadFiles).not.toHaveBeenCalled()
    expect(createProduct).not.toHaveBeenCalled()
  })

  test("nombre vacío: mensaje en español y sin red", async () => {
    const deps = { uploadFiles: vi.fn(), createProduct: vi.fn() }
    const result = await submitSimpleProduct(
      { ...validValues, nombre: "  " },
      deps
    )

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.nombre).toBe("Escribe el nombre de tu producto.")
    }
    expect(deps.createProduct).not.toHaveBeenCalled()
  })
})

describe("Moneda Lempira", () => {
  test("parseLempiras acepta formatos comunes del vendedor", () => {
    expect(parseLempiras("450")).toBe(450)
    expect(parseLempiras("1,250.50")).toBe(1250.5)
    expect(parseLempiras("L. 450")).toBe(450)
    expect(parseLempiras("l 99.99")).toBe(99.99)
  })

  test("formatLempiras produce el formato local", () => {
    expect(formatLempiras(1250.5)).toBe("L. 1,250.50")
    expect(formatLempiras(450)).toBe("L. 450.00")
    expect(formatLempiras(NaN)).toBe("")
  })

  test("el payload convierte el precio formateado a número", () => {
    const payload = buildSimpleProductPayload(
      { ...validValues, precio: "L. 3,499.99" },
      [{ url: "https://cdn.pickapp.hn/x.jpg" }]
    )
    expect(payload.variants[0].prices[0].amount).toBe(3499.99)
    expect(payload.variants[0].prices[0].currency_code).toBe("hnl")
  })
})
