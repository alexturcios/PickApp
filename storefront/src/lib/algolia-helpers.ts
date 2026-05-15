/**
 * Algolia dataset field mappers.
 * Schema: title, showcase_image, price, product_type, units_sold, color[], tags[], hierarchical_categories
 */

export type AlgoliaHit = {
  objectID: string
  title: string
  showcase_image: string
  price: number
  product_type: string
  units_sold: number
  color?: string[]
  tags?: string[]
  description?: string
  hierarchical_categories?: Record<string, string>
}

export function getHitImage(hit: any): string {
  return hit.showcase_image || hit.image || hit.image_url || hit.thumbnail || "/images/placeholder.svg"
}

export function getHitTitle(hit: any): string {
  return hit.title || hit.name || "Product"
}

export function getHitPrice(hit: any): number {
  return typeof hit.price === "number" ? hit.price : 0
}

export function getHitCategory(hit: any): string {
  if (hit.hierarchical_categories?.lvl1) {
    return hit.hierarchical_categories.lvl1.split(" > ").pop() || hit.product_type || ""
  }
  return hit.product_type || ""
}

export function getHitUnitsSold(hit: any): number {
  return hit.units_sold || 0
}

import { client } from "./client"

export const getAlgoliaProduct = async (objectId: string): Promise<AlgoliaHit | null> => {
  try {
    const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || "algolia_apparel_sample_dataset"
    const { results } = await client.search([
      {
        indexName,
        query: "",
        params: {
          filters: `objectID:'${objectId}'`,
          hitsPerPage: 1
        }
      }
    ])
    
    if (results[0] && results[0].hits && results[0].hits.length > 0) {
      return results[0].hits[0] as unknown as AlgoliaHit
    }
    return null
  } catch (error) {
    console.error("Error fetching Algolia product:", error)
    return null
  }
}
