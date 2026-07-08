import { zodResolver } from "@hookform/resolvers/zod"
import { Photo, Trash } from "@medusajs/icons"
import { Alert, Button, Input, Select, Text, toast } from "@medusajs/ui"
import { useFieldArray, useForm } from "react-hook-form"
import { Form } from "../../common/form"
import { FileUpload } from "../../common/file-upload"
import { useProductCategories } from "../../../hooks/api/categories"
import { useCreateProduct } from "../../../hooks/api/products"
import { uploadFilesQuery } from "../../../lib/client"
import {
  IMAGE_REQUIRED_MESSAGE,
  SimpleProductSchema,
  SimpleProductValues,
  TITLE_PLACEHOLDERS,
  formatLempiras,
  parseLempiras,
  submitSimpleProduct,
} from "../../../lib/pickapp/simple-product"

const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
]

type SimpleProductFormProps = {
  salesChannelId?: string
  onSuccess: (product: unknown) => void
  submitLabel?: string
}

/**
 * Flujo Simple: 4 campos, cero jerga. Pensado para quien hoy vende por
 * Instagram o WhatsApp y quiere publicar en menos de un minuto.
 */
export const SimpleProductForm = ({
  salesChannelId,
  onSuccess,
  submitLabel = "Publicar mi producto",
}: SimpleProductFormProps) => {
  const form = useForm<SimpleProductValues>({
    resolver: zodResolver(SimpleProductSchema),
    defaultValues: {
      nombre: "",
      precio: "",
      categoria_id: "",
      fotos: [],
    },
  })

  const {
    fields: fotos,
    append,
    remove,
  } = useFieldArray({ control: form.control, name: "fotos" })

  const { product_categories } = useProductCategories({ limit: 100 })
  const { mutateAsync, isPending } = useCreateProduct()

  const hasImage = fotos.length > 0

  const handleSubmit = form.handleSubmit(async (values) => {
    // Guardia dura: sin imagen no se despacha ninguna llamada de red.
    const result = await submitSimpleProduct(values, {
      uploadFiles: (files) => uploadFilesQuery(files),
      createProduct: (payload) => mutateAsync(payload as any),
      salesChannelId,
    })

    if (!result.ok) {
      Object.entries(result.errors).forEach(([field, message]) => {
        form.setError(field as keyof SimpleProductValues, {
          type: "manual",
          message,
        })
      })
      return
    }

    toast.success("¡Listo! Tu producto ya está en revisión para publicarse.")
    onSuccess(result.product)
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
        <Form.Field
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Nombre del producto</Form.Label>
              <Form.Control>
                <Input
                  {...field}
                  autoComplete="off"
                  placeholder={TITLE_PLACEHOLDERS[0]}
                />
              </Form.Control>
              <Form.Hint>
                También puede ser: {TITLE_PLACEHOLDERS[1].toLowerCase()}
              </Form.Hint>
              <Form.ErrorMessage />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="precio"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Precio de venta (Lempiras - L.)</Form.Label>
              <Form.Control>
                <Input
                  {...field}
                  inputMode="decimal"
                  placeholder="Ej. 450"
                  onBlur={(e) => {
                    field.onBlur()
                    const amount = parseLempiras(e.target.value)
                    if (Number.isFinite(amount) && amount > 0) {
                      field.onChange(formatLempiras(amount))
                    }
                  }}
                />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="categoria_id"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Categoría</Form.Label>
              <Form.Control>
                <Select value={field.value} onValueChange={field.onChange}>
                  <Select.Trigger ref={field.ref}>
                    <Select.Value placeholder="Ej. Moda y Calzado, Accesorios Tecnológicos…" />
                  </Select.Trigger>
                  <Select.Content>
                    {(product_categories ?? []).map((category: any) => (
                      <Select.Item key={category.id} value={category.id}>
                        {category.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="fotos"
          render={() => (
            <Form.Item>
              <Form.Label>Fotos del producto</Form.Label>
              <Form.Control>
                <FileUpload
                  label="Arrastra tus fotos aquí o haz clic para elegirlas"
                  hint="Una foto clara y con buena luz vende más. Formatos: JPG, PNG, WEBP."
                  hasError={!!form.formState.errors.fotos}
                  formats={SUPPORTED_FORMATS}
                  onUploaded={(files) => {
                    form.clearErrors("fotos")
                    files.forEach((f) =>
                      append({ url: f.url, file: f.file })
                    )
                  }}
                />
              </Form.Control>
              {hasImage && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {fotos.map((foto, index) => (
                    <div
                      key={foto.id}
                      className="group relative h-20 w-20 overflow-hidden rounded-lg border"
                    >
                      <img
                        src={foto.url}
                        alt={`Foto ${index + 1} del producto`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        aria-label="Quitar foto"
                        onClick={() => remove(index)}
                        className="bg-ui-bg-overlay absolute inset-0 hidden items-center justify-center text-white group-hover:flex"
                      >
                        <Trash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <Form.ErrorMessage />
            </Form.Item>
          )}
        />

        {!hasImage && form.formState.isSubmitted && (
          <Alert variant="error" className="items-center">
            {IMAGE_REQUIRED_MESSAGE}
          </Alert>
        )}

        <div className="flex items-center justify-end gap-x-3">
          {!hasImage && (
            <Text size="small" className="text-ui-fg-muted flex items-center gap-x-1">
              <Photo /> Falta subir al menos una foto
            </Text>
          )}
          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            disabled={!hasImage}
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
