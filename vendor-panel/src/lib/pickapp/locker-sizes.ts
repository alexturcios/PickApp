/**
 * Tamaños de casillero (locker) de la red Pickapp en Tegucigalpa.
 * Las dimensiones deben coincidir con las del storefront
 * (storefront/src/lib/shop/lockers.ts) — son la fuente física de verdad.
 */
export type LockerSizeId = "S" | "M" | "L"

export type LockerSize = {
  id: LockerSizeId
  /** Nombre que ve el vendedor */
  label: string
  /** Guía en texto de lo que cabe */
  guidance: string
  dims: { width: number; length: number; height: number }
  dimsLabel: string
}

export const LOCKER_SIZES: LockerSize[] = [
  {
    id: "S",
    label: "Pequeño",
    guidance:
      "Cabe en un buzón: accesorios, joyería, cosméticos, fundas de celular.",
    dims: { width: 45, length: 35, height: 12 },
    dimsLabel: "45 × 35 × 12 cm",
  },
  {
    id: "M",
    label: "Mediano",
    guidance: "Como una caja de zapatos grande: ropa, calzado, termos, libros.",
    dims: { width: 45, length: 35, height: 32 },
    dimsLabel: "45 × 35 × 32 cm",
  },
  {
    id: "L",
    label: "Grande",
    guidance:
      "Como una maleta de mano: carteras grandes, electrodomésticos pequeños.",
    dims: { width: 45, length: 35, height: 62 },
    dimsLabel: "45 × 35 × 62 cm",
  },
]

export const getLockerSize = (id: LockerSizeId): LockerSize =>
  LOCKER_SIZES.find((s) => s.id === id)!

/**
 * Devuelve los campos de dimensiones (cm) del producto para un tamaño de
 * casillero, listos para mezclar en el formulario o payload de creación.
 */
export const lockerDimsForProduct = (
  id: LockerSizeId
): { width: string; length: string; height: string } => {
  const { dims } = getLockerSize(id)
  return {
    width: String(dims.width),
    length: String(dims.length),
    height: String(dims.height),
  }
}

/** Determina el tamaño de casillero a partir de dimensiones en cm. */
export const lockerSizeForDims = (dims: {
  width?: number
  length?: number
  height?: number
}): LockerSizeId | null => {
  for (const size of LOCKER_SIZES) {
    if (
      (dims.width ?? 0) <= size.dims.width &&
      (dims.length ?? 0) <= size.dims.length &&
      (dims.height ?? 0) <= size.dims.height
    ) {
      return size.id
    }
  }
  return null
}
