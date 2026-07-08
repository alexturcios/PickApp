import { Heading, Text } from "@medusajs/ui"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { BulkUploadForm } from "../../../components/pickapp/bulk-upload-form"
import {
  CreateMode,
  CreateModeSwitcher,
} from "../../../components/pickapp/create-mode-switcher"
import { SimpleProductForm } from "../../../components/pickapp/simple-product-form"
import { RouteFocusModal, useRouteModal } from "../../../components/modals"
import { useSalesChannels } from "../../../hooks/api"
import { useStore } from "../../../hooks/api/store"
import { ProductCreateForm } from "./components/product-create-form/product-create-form"

/**
 * Creación de producto en tres caminos según la experiencia del vendedor:
 * Flujo Simple (predeterminado), Flujo Avanzado y Carga Masiva.
 */
export const ProductCreate = () => {
  const { t } = useTranslation()
  const [mode, setMode] = useState<CreateMode>("simple")

  const { store, isPending: isStorePending } = useStore()

  const { sales_channels, isPending: isSalesChannelPending } =
    useSalesChannels()

  const ready =
    !!store && !isStorePending && !!sales_channels && !isSalesChannelPending

  const switcher = <CreateModeSwitcher mode={mode} onChange={setMode} />

  return (
    <RouteFocusModal>
      <RouteFocusModal.Title asChild>
        <span className="sr-only">{t("products.create.title")}</span>
      </RouteFocusModal.Title>
      <RouteFocusModal.Description asChild>
        <span className="sr-only">{t("products.create.description")}</span>
      </RouteFocusModal.Description>
      {ready &&
        (mode === "advanced" ? (
          <ProductCreateForm
            defaultChannel={sales_channels[0]}
            store={store}
            modeSwitcher={switcher}
          />
        ) : (
          <div className="flex h-full flex-col overflow-hidden">
            <RouteFocusModal.Header>{switcher}</RouteFocusModal.Header>
            <RouteFocusModal.Body className="overflow-y-auto">
              <div className="flex flex-col items-center p-8 md:p-16">
                <div className="flex w-full max-w-[640px] flex-col gap-y-6">
                  {mode === "simple" ? (
                    <SimpleCreateView salesChannelId={sales_channels[0]?.id} />
                  ) : (
                    <BulkCreateView salesChannelId={sales_channels[0]?.id} />
                  )}
                </div>
              </div>
            </RouteFocusModal.Body>
          </div>
        ))}
    </RouteFocusModal>
  )
}

const SimpleCreateView = ({ salesChannelId }: { salesChannelId?: string }) => {
  const { handleSuccess } = useRouteModal()

  return (
    <>
      <div className="flex flex-col gap-y-1">
        <Heading>Publica tu producto en un minuto</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          Solo necesitas el nombre, el precio, la categoría y una buena foto.
          Nosotros nos encargamos del resto.
        </Text>
      </div>
      <SimpleProductForm
        salesChannelId={salesChannelId}
        onSuccess={(product: any) => {
          const id = product?.product?.id
          handleSuccess(id ? `../${id}` : "..")
        }}
      />
    </>
  )
}

const BulkCreateView = ({ salesChannelId }: { salesChannelId?: string }) => {
  return (
    <>
      <div className="flex flex-col gap-y-1">
        <Heading>Sube varios productos de una vez</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          ¿Ya tienes tu inventario en Excel? Descarga la plantilla, llénala y
          súbela aquí.
        </Text>
      </div>
      <BulkUploadForm salesChannelId={salesChannelId} />
    </>
  )
}
