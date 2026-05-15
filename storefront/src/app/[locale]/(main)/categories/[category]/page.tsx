import { SearchResults } from "@/components/sections"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { getCategoryByHandle } from "@/lib/data/categories"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; locale: string }>
}): Promise<Metadata> {
  const { category, locale } = await params
  return {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} Category | Storefront`,
    description: `Shop the best ${category} at Storefront`,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{
    category: string
    locale: string
  }>
}) {
  const { category: handle } = await params

  // Ensure category exists in backend, otherwise just render it based on handle
  const categoryData = await getCategoryByHandle([handle]).catch(() => null)
  const displayName = categoryData ? categoryData.name : handle.replace("-", " ")

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="heading-xl uppercase">{displayName}</h1>
      </div>
      <SearchResults categoryHandle={handle} />
    </main>
  )
}
