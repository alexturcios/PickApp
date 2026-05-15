import { AlgoliaProductDetailsPage } from "@/components/sections/ProductDetailsPage/AlgoliaProductDetailsPage"
import { getAlgoliaProduct } from "@/lib/algolia-helpers"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string; locale: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const prod = await getAlgoliaProduct(handle)

  if (!prod) return { title: "Product Not Found" }

  return {
    title: `${prod.title} | Storefront`,
    description: prod.description || `Buy ${prod.title}`,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string; locale: string }>
}) {
  const { handle, locale } = await params
  const prod = await getAlgoliaProduct(handle)

  if (!prod) {
    return notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <AlgoliaProductDetailsPage product={prod} locale={locale} />
    </main>
  )
}
