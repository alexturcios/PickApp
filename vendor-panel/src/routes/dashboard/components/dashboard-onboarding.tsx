import { Container, Heading, Text } from "@medusajs/ui"
import { OnboardingRow } from "./onboarding-row"
import { useUpdateOnboarding } from "../../../hooks/api"
import { useEffect } from "react"

type DashboardProps = {
  products: boolean
  locations_shipping: boolean
  store_information: boolean
  stripe_connect: boolean
}

export const DashboardOnboarding = ({
  products,
  locations_shipping,
  store_information,
  // stripe_connect,
}: DashboardProps) => {
  const { mutateAsync } = useUpdateOnboarding()

  useEffect(() => {
    mutateAsync()
  }, [])

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>¡Bienvenido a Pickapp!</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            Completa estos pasos para que tu tienda esté lista para vender
          </Text>
        </div>
      </div>
      <div className="px-6 py-4">
        <OnboardingRow
          label="Completa la información de tu tienda"
          state={store_information}
          link="/settings/store"
          buttonLabel="Completar"
        />
        {/* <OnboardingRow
          label='Setup Stripe Connect account'
          state={stripe_connect}
          link='/stripe-connect'
          buttonLabel='Setup'
        /> */}
        <OnboardingRow
          label="Configura tus puntos de entrega"
          state={locations_shipping}
          link="/settings/locations"
          buttonLabel="Configurar"
        />
        <OnboardingRow
          label="Agrega productos y empieza a vender"
          state={products}
          link="/products/create"
          buttonLabel="Agregar"
        />
      </div>
    </Container>
  )
}
