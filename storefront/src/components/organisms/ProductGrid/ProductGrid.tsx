"use client"

import { useHits } from 'react-instantsearch'
import Image from "next/image"
import { Button } from "@/components/atoms"
import clsx from "clsx"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { getHitImage, getHitTitle, getHitPrice } from "@/lib/algolia-helpers"
import { useState } from "react"

const AlgoliaProductCard = ({ hit }: { hit: any }) => {
  const title = getHitTitle(hit)
  const image = getHitImage(hit)
  const price = getHitPrice(hit)
  const handle = hit.handle || hit.objectID
  const category = hit.product_type || "Apparel"
  const [imgError, setImgError] = useState(false)

  return (
    <div
      className={clsx(
        "relative group bg-[#FFFFFF] border border-[#E6E6E6] rounded-[16px] flex flex-col justify-between p-2 w-full",
        "shadow-[0_4px_12px_0_rgba(18,21,53,0.05)] hover:shadow-[0_8px_24px_0_rgba(18,21,53,0.08)] transition-shadow duration-300"
      )}
    >
      <div className="relative w-full aspect-[4/5] bg-[#F8F9FA] rounded-t-[16px] overflow-hidden">
        <LocalizedClientLink
          href={`/products/${handle}`}
          aria-label={`View ${title}`}
          title={`View ${title}`}
          className="w-full h-full block"
        >
          <div className="w-full h-full flex justify-center items-center">
            <Image
              priority
              src={imgError ? "/images/placeholder.svg" : image}
              alt={title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className={imgError ? "object-contain" : "object-cover transition-transform duration-300 group-hover:scale-105"}
              onError={() => setImgError(true)}
            />
          </div>
        </LocalizedClientLink>
        <LocalizedClientLink
          href={`/products/${handle}`}
          aria-label={`See more about ${title}`}
          title={`See more about ${title}`}
        >
          <Button className="absolute rounded-[50px] bg-[#FF6B35] text-white h-[32px] px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-3 left-1/2 -translate-x-1/2 z-10 shadow-[0_6px_16px_0_rgba(255,107,53,0.25)] text-sm font-semibold whitespace-nowrap">
            Buy Now
          </Button>
        </LocalizedClientLink>
      </div>
      <LocalizedClientLink
        href={`/products/${handle}`}
        aria-label={`Go to ${title} page`}
        title={`Go to ${title} page`}
      >
        <div className="flex flex-col justify-between pt-4 pb-2 bg-[#FFFFFF] rounded-b-[16px]">
          <p className="text-[11px] text-[#6C757D] font-normal tracking-[-0.0440em] mb-1 truncate">{category}</p>
          <h3 className="text-[14px] text-[#121535] font-semibold tracking-[-0.0170em] truncate">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[18px] text-[#299E60] font-bold tracking-[-0.0230em]">${price}</p>
          </div>
        </div>
      </LocalizedClientLink>
    </div>
  )
}

export const ProductGrid = () => {
  const { hits } = useHits()

  if (!hits || hits.length === 0) {
    return (
      <div className="w-full flex justify-center py-20">
        <p className="text-[#6C757D]">No products found.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-[#121535] tracking-[-0.0230em] mb-6 uppercase">Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {hits.map((hit) => (
          <AlgoliaProductCard key={hit.objectID} hit={hit} />
        ))}
      </div>
    </div>
  )
}
