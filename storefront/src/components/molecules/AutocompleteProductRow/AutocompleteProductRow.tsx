"use client"

import Image from "next/image"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { getHitImage, getHitTitle, getHitPrice } from "@/lib/algolia-helpers"
import { useState } from "react"

export const AutocompleteProductRow = ({
  hit,
  onSelect
}: {
  hit: any
  onSelect?: () => void
}) => {
  const title = getHitTitle(hit)
  const image = getHitImage(hit)
  const price = getHitPrice(hit)
  const handle = hit.handle || hit.objectID
  const category = hit.product_type || "Apparel"
  const [imgError, setImgError] = useState(false)

  return (
    <LocalizedClientLink
      href={`/products/${handle}`}
      onClick={onSelect}
      className="flex items-center gap-4 p-2 hover:bg-[#F2F9F5] rounded-md transition-colors"
    >
      <div className="relative w-12 h-12 flex-shrink-0 bg-[#FFFFFF] border border-[#E6E6E6] rounded-sm overflow-hidden">
        <Image
          src={imgError ? "/images/placeholder.svg" : image}
          alt={title}
          fill
          className={imgError ? "object-contain" : "object-cover"}
          onError={() => setImgError(true)}
        />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] text-[#6C757D] font-bold uppercase tracking-widest">{category}</span>
        <span className="text-[12px] text-[#121535] font-semibold truncate max-w-[250px]">{title}</span>
        <span className="text-[12px] text-[#299E60] font-bold mt-1">${price}</span>
      </div>
    </LocalizedClientLink>
  )
}
