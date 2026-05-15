"use client"

import { useHits } from "react-instantsearch"
import Image from "next/image"
import { getHitImage, getHitTitle, getHitPrice } from "@/lib/algolia-helpers"
import { useState } from "react"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { useStore } from "@/lib/store/useStore"

export const RecommendedCard = ({ hit, index }: { hit: any; index: number }) => {
  const title = getHitTitle(hit)
  const image = getHitImage(hit)
  const price = getHitPrice(hit)
  const originalPrice = (price * 1.3 + (index % 5) * 2).toFixed(2)
  const discount = Math.floor(((Number(originalPrice) - price) / Number(originalPrice)) * 100)
  const category = hit.product_type || "Apparel"
  const rating = (3.8 + Math.random() * 1.2).toFixed(1)
  const reviewCount = Math.floor(30 + Math.random() * 150)
  const [imgError, setImgError] = useState(false)
  
  const addToCart = useStore((state) => state.addToCart)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: hit.objectID,
      handle: hit.objectID,
      title: title,
      price: price,
      image: image,
      quantity: 1
    })
  }

  return (
    <LocalizedClientLink href={`/products/${hit.objectID}`} className="bg-[#FFFFFF] rounded-[16px] shadow-[0_4px_12px_0_rgba(18,21,53,0.05)] border border-[#E6E6E6] overflow-hidden flex flex-col hover:shadow-[0_8px_24px_0_rgba(18,21,53,0.08)] transition-shadow">
      {/* Image with discount badge */}
      <div className="relative w-full aspect-square bg-[#F8F9FA] flex items-center justify-center">
        {discount > 0 && (
          <span className="absolute top-3 left-3 z-10 bg-[#E63946] text-white text-[11px] font-bold px-2.5 py-1 rounded-[4px]">
            -{discount}%
          </span>
        )}
        <Image
          src={imgError ? "/images/placeholder.svg" : image}
          alt={title}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className={imgError ? "object-contain p-4 group-hover:scale-105 transition-transform duration-300" : "object-cover group-hover:scale-105 transition-transform duration-300"}
          onError={() => setImgError(true)}
        />
      </div>

      {/* Details */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        {/* Title */}
        <h3 className="text-[14px] text-[#121535] font-semibold tracking-[-0.0170em] line-clamp-2 leading-tight group-hover:text-[#299E60] transition-colors">{title}</h3>

        {/* Vendor */}
        <div className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#299E60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span className="text-[11px] text-[#299E60] font-medium">Verified Seller</span>
        </div>

        {/* Prices */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[18px] text-[#299E60] font-bold">${price}</span>
          <span className="text-[13px] text-[#6C757D] line-through">${originalPrice}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < Math.floor(Number(rating)) ? "#FFB800" : "#E6E6E6"} stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span className="text-[10px] text-[#6C757D]">({reviewCount})</span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 pt-0 mt-auto">
        <button 
          onClick={handleAddToCart}
          className="w-full py-2 bg-[#FF6B35] text-white font-semibold text-[13px] rounded-[50px] shadow-[0_4px_12px_0_rgba(255,107,53,0.2)] hover:bg-[#e85a28] transition-colors"
        >
          Add To Cart
        </button>
      </div>
    </LocalizedClientLink>
  )
}

export const RecommendedProducts = () => {
  const { hits } = useHits()
  const recommendedHits = hits.slice(6, 14)

  if (recommendedHits.length === 0) return null

  return (
    <section className="w-full px-4 lg:px-8">
      <h2 className="text-xl md:text-2xl font-bold text-[#121535] tracking-[-0.0230em] mb-6">
        🎯 Recommended For You
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recommendedHits.map((hit, i) => (
          <RecommendedCard key={hit.objectID} hit={hit} index={i} />
        ))}
      </div>
    </section>
  )
}
