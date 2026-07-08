import { ArrowDownTray, CheckCircleSolid, ExclamationCircle } from "@medusajs/icons"
import { Alert, Button, Text, toast } from "@medusajs/ui"
import { useState } from "react"
import { FileUpload } from "../../common/file-upload"
import { useProductCategories } from "../../../hooks/api/categories"
import { useCreateProduct } from "../../../hooks/api/products"
import {
  BULK_TEMPLATE_HEADERS,
  BulkUploadResult,
  getBulkTemplateDataUri,
  runBulkUpload,
} from "../../../lib/pickapp/bulk-csv"

type BulkUploadFormProps = {
  salesChannelId?: string
  onSuccess?: (result: BulkUploadResult) => void
}

/**
 * Carga Masiva: para quien ya tiene su inventario en Excel. Los errores se
 * muestran fila por fila en español — nunca un stack trace.
 */
export const BulkUploadForm = ({
  salesChannelId,
  onSuccess,
}: BulkUploadFormProps) => {
  const [result, setResult] = useState<BulkUploadResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)

  const { product_categories } = useProductCategories({ limit: 100 })
  const { mutateAsync } = useCreateProduct()

  const categoryIdByName = (product_categories ?? []).reduce(
    (acc: Record<string, string>, category: any) => {
      acc[category.name.toLowerCase()] = category.id
      return acc
    },
    {}
  )

  const handleFile = async (file: File) => {
    setIsProcessing(true)
    setResult(null)
    setProgress(null)

    try {
      const text = await file.text()
      const uploadResult = await runBulkUpload(text, {
        createProduct: (payload) => mutateAsync(payload as any),
        categoryIdByName,
        salesChannelId,
        onRowDone: (done, total) => setProgress({ done, total }),
      })

      setResult(uploadResult)

      if (uploadResult.created.length > 0) {
        toast.success(
          `Se crearon ${uploadResult.created.length} producto(s) correctamente.`
        )
        onSuccess?.(uploadResult)
      }
    } catch {
      // runBulkUpload no lanza, pero por si file.text() falla:
      setResult({
        created: [],
        errors: [
          {
            line: 1,
            message:
              "No pudimos leer el archivo. Asegúrate de que sea un CSV guardado desde Excel o Google Sheets.",
          },
        ],
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-y-6">
      <div className="bg-ui-bg-subtle flex flex-col gap-y-3 rounded-lg border p-4">
        <Text weight="plus">1. Descarga la plantilla</Text>
        <Text size="small" className="text-ui-fg-subtle">
          Es un archivo sencillo con estas columnas:{" "}
          {BULK_TEMPLATE_HEADERS.join(", ")}. Llénala con tus productos y
          guárdala como CSV.
        </Text>
        <div>
          <a href={getBulkTemplateDataUri()} download="plantilla-pickapp.csv">
            <Button variant="secondary" size="small" type="button">
              <ArrowDownTray />
              Descargar plantilla (Excel/CSV)
            </Button>
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-y-3">
        <Text weight="plus">2. Sube tu archivo lleno</Text>
        <FileUpload
          label={
            isProcessing
              ? progress
                ? `Guardando productos… ${progress.done} de ${progress.total}`
                : "Revisando tu archivo…"
              : "Arrastra tu archivo CSV aquí o haz clic para elegirlo"
          }
          hint="Recuerda: cada producto necesita su enlace de imagen en la columna Url_Imagen."
          multiple={false}
          formats={["text/csv", ".csv"]}
          hasError={!!result && result.errors.length > 0 && !result.created.length}
          onUploaded={(files) => {
            const file = files[0]?.file
            if (!file) {
              return
            }
            if (!file.name.toLowerCase().endsWith(".csv")) {
              setResult({
                created: [],
                errors: [
                  {
                    line: 1,
                    message:
                      "El archivo debe ser un CSV. En Excel usa «Guardar como → CSV».",
                  },
                ],
              })
              return
            }
            void handleFile(file)
          }}
        />
      </div>

      {result && result.created.length > 0 && (
        <Alert variant="success" className="items-start">
          <div className="flex flex-col gap-y-1">
            <span className="flex items-center gap-x-1 font-medium">
              <CheckCircleSolid /> {result.created.length} producto(s) creado(s)
            </span>
            <Text size="small">
              {result.created.map((c) => c.title).join(", ")}
            </Text>
          </div>
        </Alert>
      )}

      {result && result.errors.length > 0 && (
        <Alert variant="error" className="items-start">
          <div className="flex flex-col gap-y-2">
            <span className="flex items-center gap-x-1 font-medium">
              <ExclamationCircle /> Revisa estas filas de tu archivo:
            </span>
            <ul className="flex list-disc flex-col gap-y-1 pl-4">
              {result.errors.map((error, index) => (
                <li key={`${error.line}-${index}`}>
                  <Text size="small">{error.message}</Text>
                </li>
              ))}
            </ul>
            <Text size="small" className="text-ui-fg-subtle">
              Corrige esas filas en tu archivo y súbelo de nuevo. Las filas
              correctas ya fueron guardadas — no las repitas.
            </Text>
          </div>
        </Alert>
      )}
    </div>
  )
}
