"use client"

import { useHits, Configure, RefinementList, SortBy, Pagination, useSearchBox } from "react-instantsearch"
import { RecommendedCard } from "@/components/sections/RecommendedProducts/RecommendedProducts"
import { useEffect } from "react"
import { AlgoliaProduct } from "@/lib/algolia-helpers"

const HitsGrid = () => {
  const { hits } = useHits()

  if (hits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-semibold text-[#121535]">No products found</h2>
        <p className="text-[#6C757D] mt-2">Try adjusting your filters or search query.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {hits.map((hit, i) => (
        <RecommendedCard key={hit.objectID} hit={hit as unknown as AlgoliaProduct} index={i} />
      ))}
    </div>
  )
}

export const SearchResults = ({ initialQuery = "", categoryHandle, vendorHandle }: { initialQuery?: string, categoryHandle?: string, vendorHandle?: string }) => {
  const { refine } = useSearchBox()

  useEffect(() => {
    if (initialQuery) {
      refine(initialQuery)
    }
  }, [initialQuery, refine])

  const filters = [
    categoryHandle ? `hierarchical_categories.lvl0:'${categoryHandle}' OR product_type:'${categoryHandle}'` : null,
    vendorHandle ? `vendor:'${vendorHandle}'` : null
  ].filter(Boolean).join(" AND ") || undefined;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Configure hitsPerPage={12} filters={filters} />
      
      {/* Sidebar Filters */}
      <aside className="w-full md:w-[250px] flex-shrink-0 space-y-8">
        <div>
          <h3 className="font-bold text-[#121535] mb-4 text-[14px]">Categories</h3>
          <RefinementList
            attribute="product_type"
            classNames={{
              list: "space-y-2",
              item: "text-[14px] text-[#6C757D]",
              selectedItem: "font-semibold text-[#299E60]",
              label: "flex items-center gap-2 cursor-pointer",
              checkbox: "w-4 h-4 rounded border-[#E6E6E6] text-[#299E60] focus:ring-[#299E60]",
              count: "ml-auto text-[12px] bg-[#F2F9F5] px-2 py-0.5 rounded-full text-[#299E60]",
            }}
          />
        </div>
        
        <div>
          <h3 className="font-bold text-[#121535] mb-4 text-[14px]">Brand</h3>
          <RefinementList
            attribute="vendor"
            classNames={{
              list: "space-y-2",
              item: "text-[14px] text-[#6C757D]",
              selectedItem: "font-semibold text-[#299E60]",
              label: "flex items-center gap-2 cursor-pointer",
              checkbox: "w-4 h-4 rounded border-[#E6E6E6] text-[#299E60] focus:ring-[#299E60]",
              count: "ml-auto text-[12px] bg-[#F2F9F5] px-2 py-0.5 rounded-full text-[#299E60]",
            }}
          />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex items-center justify-between bg-[#FFFFFF] p-4 rounded-[16px] shadow-[0_4px_12px_0_rgba(18,21,53,0.05)]">
          <div className="text-[14px] text-[#6C757D]">
            Sort by:
          </div>
          <SortBy
            items={[
              { label: "Featured", value: "algolia_apparel_sample_dataset" },
              { label: "Price (Asc)", value: "algolia_apparel_sample_dataset_price_asc" },
              { label: "Price (Desc)", value: "algolia_apparel_sample_dataset_price_desc" },
            ]}
            classNames={{
              select: "border-[#E6E6E6] rounded-[8px] text-[14px] text-[#121535] py-1.5 px-3 focus:outline-none focus:border-[#299E60]",
            }}
          />
        </div>

        <HitsGrid />

        <div className="flex justify-center mt-8">
          <Pagination
            classNames={{
              list: "flex items-center gap-2",
              item: "w-8 h-8 flex items-center justify-center rounded-[8px] border border-[#E6E6E6] text-[14px] text-[#121535] hover:bg-[#F2F9F5] transition-colors",
              selectedItem: "bg-[#299E60] text-white border-[#299E60] hover:bg-[#299E60]",
              disabledItem: "opacity-50 cursor-not-allowed hover:bg-transparent",
              link: "w-full h-full flex items-center justify-center",
            }}
          />
        </div>
      </div>
    </div>
  )
}
