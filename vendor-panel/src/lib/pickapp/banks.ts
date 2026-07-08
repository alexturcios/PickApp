import { z } from "zod"

/** Bancos hondureños soportados para depósitos de retiros. */
export const HONDURAN_BANKS = [
  { id: "bac", label: "BAC Credomatic" },
  { id: "atlantida", label: "Banco Atlántida" },
  { id: "ficohsa", label: "Banco Ficohsa" },
  { id: "banpais", label: "Banpaís" },
] as const

export const ACCOUNT_TYPES = [
  { id: "ahorros", label: "Ahorros" },
  { id: "corriente", label: "Corriente" },
] as const

export const PayoutAccountSchema = z.object({
  banco: z.string().min(1, "Selecciona tu banco."),
  tipo_cuenta: z.enum(["ahorros", "corriente"], {
    errorMap: () => ({ message: "Selecciona el tipo de cuenta." }),
  }),
  numero_cuenta: z
    .string()
    .min(6, "Revisa el número de cuenta: parece muy corto.")
    .max(30, "Revisa el número de cuenta: parece muy largo.")
    .regex(/^[0-9-\s]+$/, "El número de cuenta solo debe tener números."),
  nombre_titular: z
    .string()
    .min(3, "Escribe el nombre completo del titular de la cuenta."),
})

export type PayoutAccount = z.infer<typeof PayoutAccountSchema>

/**
 * Los datos bancarios se guardan en `seller.metadata.pickapp_payout` vía
 * POST /vendor/sellers/me — no hay endpoint dedicado de banca local.
 */
export const PAYOUT_METADATA_KEY = "pickapp_payout"

export const payoutAccountFromMetadata = (
  metadata: Record<string, unknown> | null | undefined
): PayoutAccount | null => {
  const raw = metadata?.[PAYOUT_METADATA_KEY]
  const parsed = PayoutAccountSchema.safeParse(raw)
  return parsed.success ? parsed.data : null
}
