import { Heading, RadioGroup, Text } from "@medusajs/ui"
import { UseFormReturn, useWatch } from "react-hook-form"

import {
  LOCKER_SIZES,
  LockerSizeId,
  lockerDimsForProduct,
} from "../../../../../../../lib/pickapp/locker-sizes"
import { ProductCreateSchemaType } from "../../../../types"

type ProductCreateLockerSizeSectionProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

/**
 * Dimensiones de Paquete: en vez de pedir centímetros, el vendedor elige el
 * casillero donde cabe su producto y nosotros llenamos las medidas.
 */
export const ProductCreateLockerSizeSection = ({
  form,
}: ProductCreateLockerSizeSectionProps) => {
  const width = useWatch({ control: form.control, name: "width" })
  const height = useWatch({ control: form.control, name: "height" })

  const selected =
    LOCKER_SIZES.find(
      (size) =>
        String(size.dims.width) === width && String(size.dims.height) === height
    )?.id ?? null

  const handleSelect = (value: string) => {
    const dims = lockerDimsForProduct(value as LockerSizeId)
    form.setValue("width", dims.width, { shouldDirty: true })
    form.setValue("length", dims.length, { shouldDirty: true })
    form.setValue("height", dims.height, { shouldDirty: true })
  }

  return (
    <div id="locker-size" className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-1">
        <Heading level="h2">Dimensiones de paquete</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Elige el tamaño de casillero donde cabe tu producto ya empacado. Así
          sabemos en qué locker de la ciudad puede entregarse.
        </Text>
      </div>
      <RadioGroup
        value={selected ?? undefined}
        onValueChange={handleSelect}
        className="grid grid-cols-1 gap-3 md:grid-cols-3"
      >
        {LOCKER_SIZES.map((size) => (
          <label
            key={size.id}
            className={
              "flex cursor-pointer flex-col gap-y-2 rounded-lg border p-4 transition-colors " +
              (selected === size.id
                ? "border-ui-border-interactive bg-ui-bg-highlight"
                : "hover:border-ui-border-strong")
            }
          >
            <div className="flex items-center gap-x-2">
              <RadioGroup.Item value={size.id} />
              <Text weight="plus">{size.label}</Text>
            </div>
            <Text size="small" className="text-ui-fg-subtle">
              {size.dimsLabel}
            </Text>
            <Text size="small" className="text-ui-fg-muted">
              {size.guidance}
            </Text>
          </label>
        ))}
      </RadioGroup>
    </div>
  )
}
