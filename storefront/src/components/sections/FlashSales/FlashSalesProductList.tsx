"use client"

import { useHits } from "react-instantsearch"
import Image from "next/image"
import { getHitImage, getHitTitle, getHitPrice, getHitUnitsSold } from "@/lib/algolia-helpers"
import { useState } from "react"

const FlashSaleCard = ({ hit }: { hit: any }) => {
  const title = getHitTitle(hit)
  const image = getHitImage(hit)
  const price = getHitPrice(hit)
  const unitsSold = getHitUnitsSold(hit)
  const category = hit.product_type || "Apparel"
  const originalPrice = (price * 1.4).toFixed(2)
  const rating = (3.5 + Math.random() * 1.5).toFixed(1)
  const reviewCount = Math.floor(50 + Math.random() * 200)
  const [imgError, setImgError] = useState(false)

  return (
    <div className="bg-[#FFFFFF] rounded-[16px] shadow-[0_4px_12px_0_rgba(18,21,53,0.05)] border border-[#E6E6E6] overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative w-full aspect-square bg-[#F8F9FA] flex items-center justify-center">
        <Image
          src={imgError ? "/images/placeholder.svg" : image}
          alt={title}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className={imgError ? "object-contain p-4" : "object-cover"}
          onError={() => setImgError(true)}
        />
        {/* Add pill button */}
        <button className="absolute top-3 right-3 z-10 px-4 py-1.5 bg-[#FF6B35] text-white text-[12px] font-semibold rounded-[50px] shadow-[0_6px_16px_0_rgba(255,107,53,0.25)] hover:bg-[#e85a28] transition-colors">
          + Add
        </button>
      </div>

      {/* Details */}
      <div className="p-3 flex flex-col gap-1">
        {/* Prices */}
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-[#6C757D] line-through">${originalPrice}</span>
          <span className="text-[18px] text-[#299E60] font-bold">${price}</span>
        </div>

        {/* Unit */}
        <span className="text-[11px] text-[#6C757D]">{category}</span>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < Math.floor(Number(rating)) ? "#FFB800" : "#E6E6E6"} stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span className="text-[11px] text-[#6C757D]">({reviewCount})</span>
        </div>

        {/* Title */}
        <h3 className="text-[14px] text-[#121535] font-semibold tracking-[-0.0170em] line-clamp-2 leading-tight">{title}</h3>

        {/* Vendor */}
        <div className="flex items-center gap-1 mt-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#299E60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span className="text-[11px] text-[#299E60] font-medium">Verified Seller</span>
        </div>

        {/* Sold */}
        <span className="text-[10px] text-[#6C757D] mt-1">{unitsSold.toLocaleString()} sold</span>
      </div>
    </div>
  )
}

export const FlashSalesProductList = () => {
  const { hits } = useHits()
  const flashHits = hits.slice(0, 6)

  if (flashHits.length === 0) return null

  return (
    <section className="w-full px-4 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {flashHits.map((hit) => (
          <FlashSaleCard key={hit.objectID} hit={hit} />
        ))}
      </div>
    </section>
  )
}
