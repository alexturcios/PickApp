import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@medusajs/icons"
import {
  Alert,
  Button,
  Heading,
  Input,
  Select,
  Text,
  toast,
} from "@medusajs/ui"
import { PropsWithChildren, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { Form } from "../../common/form"
import { FileUpload } from "../../common/file-upload"
import { useLogout } from "../../../hooks/api"
import { useProducts } from "../../../hooks/api/products"
import { useMe, useUpdateMe } from "../../../hooks/api/users"
import { uploadFilesQuery } from "../../../lib/client"
import {
  ACCOUNT_TYPES,
  HONDURAN_BANKS,
  PAYOUT_METADATA_KEY,
  PayoutAccountSchema,
  payoutAccountFromMetadata,
} from "../../../lib/pickapp/banks"
import { SimpleProductForm } from "../simple-product-form"

/**
 * Paso a Paso Obligatorio: intercepta el panel completo hasta que el vendedor
 * tenga (1) identidad de su negocio, (2) cuenta de retiros y (3) su primer
 * producto publicado. No se puede saltar — solo cerrar sesión.
 */
export const OnboardingGate = ({ children }: PropsWithChildren) => {
  const { seller, isPending: isSellerPending } = useMe()
  const { count, isPending: isProductsPending } = useProducts({ limit: 1 })

  if (isSellerPending || isProductsPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="text-ui-fg-interactive animate-spin" />
      </div>
    )
  }

  const identityDone = Boolean(seller?.name && seller?.phone && seller?.photo)
  const payoutDone = Boolean(payoutAccountFromMetadata(seller?.metadata))
  const productDone = (count ?? 0) > 0

  if (identityDone && payoutDone && productDone) {
    return <>{children}</>
  }

  const step = !identityDone ? 1 : !payoutDone ? 2 : 3

  return <OnboardingOverlay step={step} seller={seller} />
}

const STEPS = [
  { number: 1, title: "Identidad de tu Negocio" },
  { number: 2, title: "Cuenta de Retiros" },
  { number: 3, title: "Tu Primer Producto" },
]

const OnboardingOverlay = ({ step, seller }: { step: number; seller: any }) => {
  const navigate = useNavigate()
  const { mutateAsync: logout } = useLogout()

  const handleLogout = async () => {
    await logout(undefined, {
      onSuccess: () => navigate("/login", { replace: true }),
    })
  }

  return (
    <div className="bg-ui-bg-subtle fixed inset-0 z-50 overflow-y-auto">
      <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col gap-y-6 px-4 py-10">
        <div className="flex items-center justify-between">
          <Heading level="h1">Activemos tu tienda</Heading>
          <Button variant="transparent" size="small" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>

        <Alert variant="info" className="items-center">
          ¡Hola! Vamos a activar tu tienda para que los clientes te conozcan.
          Son solo tres pasos y toman menos de cinco minutos.
        </Alert>

        <ol className="flex items-center gap-x-2">
          {STEPS.map((s) => (
            <li key={s.number} className="flex flex-1 items-center gap-x-2">
              <span
                aria-current={s.number === step ? "step" : undefined}
                className={
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-medium " +
                  (s.number < step
                    ? "bg-ui-tag-green-bg text-ui-tag-green-text"
                    : s.number === step
                      ? "bg-ui-bg-interactive text-ui-fg-on-color"
                      : "bg-ui-bg-component text-ui-fg-muted")
                }
              >
                {s.number < step ? "✓" : s.number}
              </span>
              <Text
                size="small"
                weight={s.number === step ? "plus" : "regular"}
                className={
                  s.number === step ? "text-ui-fg-base" : "text-ui-fg-muted"
                }
              >
                Paso {s.number}: {s.title}
              </Text>
            </li>
          ))}
        </ol>

        <div className="bg-ui-bg-base shadow-elevation-card-rest rounded-xl border p-6">
          {step === 1 && <IdentityStep seller={seller} />}
          {step === 2 && <PayoutStep seller={seller} />}
          {step === 3 && <FirstProductStep />}
        </div>
      </div>
    </div>
  )
}

const IdentitySchema = z.object({
  nombre_tienda: z
    .string()
    .trim()
    .min(2, "Escribe el nombre de tu tienda como quieres que lo vean tus clientes."),
  telefono: z
    .string()
    .trim()
    .regex(
      /^\+?[0-9\s-]{8,15}$/,
      "Escribe un teléfono válido, ej. 9988-7766."
    ),
  logo: z
    .array(z.object({ url: z.string(), file: z.any().nullable() }))
    .min(1, "Sube tu logo o una foto de perfil para que te reconozcan."),
})

const IdentityStep = ({ seller }: { seller: any }) => {
  const form = useForm<z.infer<typeof IdentitySchema>>({
    resolver: zodResolver(IdentitySchema),
    defaultValues: {
      nombre_tienda: seller?.name ?? "",
      telefono: seller?.phone ?? "",
      logo: seller?.photo ? [{ url: seller.photo, file: null }] : [],
    },
  })

  const { mutateAsync, isPending } = useUpdateMe()

  const logo = form.watch("logo")

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      let photoUrl = seller?.photo ?? ""
      const newFile = values.logo.find((l) => l.file)
      if (newFile) {
        const uploaded = await uploadFilesQuery([newFile])
        photoUrl = uploaded.files[0]?.url ?? photoUrl
      }

      await mutateAsync({
        name: values.nombre_tienda.trim(),
        phone: values.telefono.trim(),
        photo: photoUrl,
      })

      toast.success("¡Tu negocio ya tiene identidad! Vamos al siguiente paso.")
    } catch {
      toast.error(
        "No pudimos guardar tus datos. Revisa tu conexión e inténtalo de nuevo."
      )
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
        <div className="flex flex-col gap-y-1">
          <Heading level="h2">Paso 1: Identidad de tu Negocio</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Así aparecerás en Pickapp cuando alguien visite tu tienda.
          </Text>
        </div>

        <Form.Field
          control={form.control}
          name="nombre_tienda"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Nombre de la tienda</Form.Label>
              <Form.Control>
                <Input
                  {...field}
                  placeholder="Ej. Cueros y Más Tegucigalpa"
                  autoComplete="organization"
                />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="telefono"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Teléfono de contacto</Form.Label>
              <Form.Control>
                <Input
                  {...field}
                  type="tel"
                  inputMode="tel"
                  placeholder="Ej. 9988-7766"
                  autoComplete="tel"
                />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="logo"
          render={() => (
            <Form.Item>
              <Form.Label>Logo o foto de perfil</Form.Label>
              <Form.Control>
                <FileUpload
                  label="Sube tu logo o una foto que represente tu negocio"
                  hint="JPG o PNG. Si no tienes logo, una buena foto de tus productos funciona."
                  multiple={false}
                  formats={["image/jpeg", "image/png", "image/webp"]}
                  uploadedImage={logo?.[0]?.url ?? ""}
                  hasError={!!form.formState.errors.logo}
                  onUploaded={(files) => {
                    form.clearErrors("logo")
                    if (files[0]) {
                      form.setValue(
                        "logo",
                        [{ url: files[0].url, file: files[0].file }],
                        { shouldDirty: true }
                      )
                    }
                  }}
                />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" variant="primary" isLoading={isPending}>
            Guardar y continuar
          </Button>
        </div>
      </form>
    </Form>
  )
}

const PayoutStep = ({ seller }: { seller: any }) => {
  const form = useForm<z.infer<typeof PayoutAccountSchema>>({
    resolver: zodResolver(PayoutAccountSchema),
    defaultValues: {
      banco: "",
      tipo_cuenta: undefined as any,
      numero_cuenta: "",
      nombre_titular: "",
    },
  })

  const { mutateAsync, isPending } = useUpdateMe()

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await mutateAsync({
        metadata: {
          ...(seller?.metadata ?? {}),
          [PAYOUT_METADATA_KEY]: values,
        },
      })
      toast.success(
        "¡Cuenta de retiros lista! Tus ventas se depositarán ahí."
      )
    } catch {
      toast.error(
        "No pudimos guardar tu cuenta. Revisa tu conexión e inténtalo de nuevo."
      )
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
        <div className="flex flex-col gap-y-1">
          <Heading level="h2">Paso 2: Cuenta de Retiros</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Aquí depositaremos el dinero de tus ventas una vez que el cliente
            recoja su paquete en el locker.
          </Text>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Field
            control={form.control}
            name="banco"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Banco</Form.Label>
                <Form.Control>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <Select.Trigger ref={field.ref}>
                      <Select.Value placeholder="Elige tu banco" />
                    </Select.Trigger>
                    <Select.Content>
                      {HONDURAN_BANKS.map((bank) => (
                        <Select.Item key={bank.id} value={bank.id}>
                          {bank.label}
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
            name="tipo_cuenta"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Tipo de cuenta</Form.Label>
                <Form.Control>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <Select.Trigger ref={field.ref}>
                      <Select.Value placeholder="Ahorros o Corriente" />
                    </Select.Trigger>
                    <Select.Content>
                      {ACCOUNT_TYPES.map((type) => (
                        <Select.Item key={type.id} value={type.id}>
                          {type.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />
        </div>

        <Form.Field
          control={form.control}
          name="numero_cuenta"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Número de cuenta</Form.Label>
              <Form.Control>
                <Input
                  {...field}
                  inputMode="numeric"
                  placeholder="Ej. 7301234567"
                />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )}
        />

        <Form.Field
          control={form.control}
          name="nombre_titular"
          render={({ field }) => (
            <Form.Item>
              <Form.Label>Nombre del titular</Form.Label>
              <Form.Control>
                <Input
                  {...field}
                  placeholder="Como aparece en tu cuenta del banco"
                  autoComplete="name"
                />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" variant="primary" isLoading={isPending}>
            Guardar y continuar
          </Button>
        </div>
      </form>
    </Form>
  )
}

const FirstProductStep = () => {
  const [done, setDone] = useState(false)

  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex flex-col gap-y-1">
        <Heading level="h2">Paso 3: Tu Primer Producto</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          ¡Último paso! Publica tu primer producto y tu tienda quedará activa.
          Puedes agregar más después, incluso desde Excel.
        </Text>
      </div>
      {done ? (
        <Alert variant="success" className="items-center">
          ¡Felicidades! Tu tienda está activa. Cargando tu panel…
        </Alert>
      ) : (
        <SimpleProductForm
          submitLabel="Publicar y activar mi tienda"
          onSuccess={() => setDone(true)}
        />
      )}
    </div>
  )
}
