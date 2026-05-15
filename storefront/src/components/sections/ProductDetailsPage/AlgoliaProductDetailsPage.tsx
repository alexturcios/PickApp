"use client"

import { AlgoliaHit, getHitImage, getHitPrice, getHitTitle } from "@/lib/algolia-helpers"
import Image from "next/image"
import { useState } from "react"
import { useStore } from "@/lib/store/useStore"
import { ProductTabs } from "./ProductTabs"
import { RecommendedProducts } from "../RecommendedProducts/RecommendedProducts"

export const AlgoliaProductDetailsPage = ({ product, locale }: { product: AlgoliaHit, locale: string }) => {
  const title = getHitTitle(product)
  const image = getHitImage(product)
  const price = getHitPrice(product)
  const originalPrice = (price * 1.3).toFixed(2)
  const rating = (4.5 + Math.random() * 0.4).toFixed(1)
  const reviewCount = Math.floor(100 + Math.random() * 1000)
  
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(image)
  const addToCart = useStore((state) => state.addToCart)

  const handleAddToCart = () => {
    addToCart({
      id: product.objectID,
      title,
      price,
      image,
      quantity,
      handle: product.objectID
    })
    // Optionally trigger a toast or open cart drawer
  }

  return (
    <div className="flex flex-col gap-12">
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 bg-[#FFFFFF] p-6 lg:p-8 rounded-[16px] shadow-[0_4px_12px_0_rgba(18,21,53,0.05)] border border-[#E6E6E6]">
        
        {/* Left: Gallery */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="relative w-full aspect-square bg-[#F8F9FA] rounded-[16px] overflow-hidden border border-[#E6E6E6]">
            <Image src={activeImage} alt={title} fill className="object-contain p-4" />
          </div>
          <div className="flex gap-4">
            {[image, image, image, image].map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(img)}
                className={`relative w-1/4 aspect-square bg-[#F8F9FA] rounded-[8px] border overflow-hidden ${activeImage === img ? 'border-[#299E60]' : 'border-[#E6E6E6]'} hover:border-[#299E60] transition-colors`}
              >
                <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-contain p-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Center: Details */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#121535] leading-tight mb-2 tracking-[-0.0230em]">{title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#6C757D]">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < Math.floor(Number(rating)) ? "#FFB800" : "#E6E6E6"} stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="font-semibold text-[#121535]">{rating} Star Rating</span>
                <span>({reviewCount})</span>
              </div>
              <span>|</span>
              <span>SKU: {product.objectID}</span>
            </div>
          </div>

          <p className="text-[14px] text-[#6C757D] leading-relaxed">
            {product.description || `Experience premium quality with the ${title}. Perfectly crafted for your needs, combining durability with modern aesthetics. Grab yours today while supplies last!`}
          </p>

          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-[#121535] tracking-[-0.0230em]">${price.toFixed(2)}</span>
            <span className="text-xl text-[#6C757D] line-through mb-1">${originalPrice}</span>
          </div>

          <div className="flex items-center gap-4 mt-auto pt-6 border-t border-[#E6E6E6]">
            {/* Quantity Selector */}
            <div className="flex items-center bg-[#F8F9FA] rounded-[50px] border border-[#E6E6E6] p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-[#121535] hover:bg-[#E6E6E6] rounded-full transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center font-semibold text-[#121535]">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-[#121535] hover:bg-[#E6E6E6] rounded-full transition-colors"
              >
                +
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-[#299E60] text-white font-semibold py-3 px-6 rounded-[50px] shadow-[0_6px_16px_0_rgba(41,158,96,0.2)] hover:bg-[#238a53] transition-colors flex justify-center items-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              Add To Cart
            </button>
          </div>
        </div>

        {/* Right: Trust Badges */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 bg-[#F2F9F5] p-6 rounded-[16px] border border-[#E6E6E6]">
          {[
            { icon: "truck", title: "Fast Delivery", desc: "Lightning-fast shipping, guaranteed." },
            { icon: "refresh-cw", title: "Free 90-day returns", desc: "Shop risk-free with easy returns." },
            { icon: "map-pin", title: "Pickup available", desc: "Usually ready in 24 hours" },
            { icon: "credit-card", title: "Payment", desc: "Payment upon receipt, Google Pay, Online card." },
            { icon: "shield", title: "Warranty", desc: "Consumer Protection Act applies." },
            { icon: "package", title: "Packaging", desc: "Secure packaging for your items." },
          ].map((badge, i) => (
            <div key={i} className="flex gap-4 items-start pb-4 border-b border-[#E6E6E6] last:border-0 last:pb-0">
              <div className="w-8 h-8 bg-[#FFFFFF] rounded-full flex items-center justify-center shadow-sm flex-shrink-0 text-[#299E60]">
                {/* Generic icon SVG based on name, simplified for mock */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-[#121535]">{badge.title}</h4>
                <p className="text-[11px] text-[#6C757D] leading-tight mt-0.5">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Middle Section: Tabs */}
      <ProductTabs product={product} />

      {/* Bottom Section */}
      <RecommendedProducts />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 lg:px-8">
        {[
          { title: "Free Shipping", icon: "truck" },
          { title: "100% Satisfaction", icon: "smile" },
          { title: "Secure Payments", icon: "lock" },
          { title: "24/7 Support", icon: "headphones" }
        ].map((feat, i) => (
          <div key={i} className="bg-[#F2F9F5] p-4 rounded-[12px] flex items-center gap-3 border border-[#E6E6E6]">
            <div className="w-10 h-10 bg-[#299E60] rounded-full flex items-center justify-center text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-[#121535] leading-tight">{feat.title}</h4>
              <p className="text-[10px] text-[#6C757D]">Free shipping all over the US</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-4 lg:mx-8 bg-[#121535] rounded-[16px] p-8 md:p-12 text-white relative overflow-hidden mb-12">
        <div className="relative z-10 max-w-[400px]">
          <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.0230em] mb-4">Don't Miss Out on Grocery Deals</h2>
          <p className="text-[14px] uppercase tracking-widest text-[#6C757D] mb-6">Sign up for the update newsletter</p>
          <div className="flex items-center bg-white/10 p-1 rounded-[50px] border border-white/20">
            <input type="email" placeholder="Your email address..." className="bg-transparent border-none outline-none text-white px-4 py-2 flex-1 text-[13px] placeholder:text-[#6C757D]" />
            <button className="bg-[#FF6B35] text-white px-6 py-2 rounded-[50px] text-[13px] font-semibold hover:bg-[#e85a28] transition-colors">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  )
}
