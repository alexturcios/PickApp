import { Input, Textarea } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { Form } from "../../../../../../../components/common/form"
import { ProductCreateSchemaType } from "../../../../types"

type ProductCreateGeneralSectionProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

export const ProductCreateGeneralSection = ({
  form,
}: ProductCreateGeneralSectionProps) => {
  const { t } = useTranslation()

  return (
    <div id="general" className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-2">
        {/* El "handle" (slug) se genera solo en el backend — nunca se le muestra al vendedor. */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Field
            control={form.control}
            name="title"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("products.fields.title.label")}</Form.Label>
                  <Form.Control>
                    <Input
                      {...field}
                      placeholder="Ej. Ropa de lino hecha en Valle de Ángeles"
                    />
                  </Form.Control>
                </Form.Item>
              )
            }}
          />
          <Form.Field
            control={form.control}
            name="subtitle"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label optional>
                    {t("products.fields.subtitle.label")}
                  </Form.Label>
                  <Form.Control>
                    <Input
                      {...field}
                      placeholder="Ej. Hecho a mano con lino 100% natural"
                    />
                  </Form.Control>
                </Form.Item>
              )
            }}
          />
        </div>
      </div>
      <Form.Field
        control={form.control}
        name="description"
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Label optional>
                {t("products.fields.description.label")}
              </Form.Label>
              <Form.Control>
                <Textarea
                  {...field}
                  placeholder="Ej. Termo personalizado de acero, 750 ml, con grabado a tu gusto. Entrega en lockers cerca de Mall Multiplaza o Bulevar Morazán."
                />
              </Form.Control>
            </Form.Item>
          )
        }}
      />
    </div>
  )
}
