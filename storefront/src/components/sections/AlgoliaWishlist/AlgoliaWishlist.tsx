"use client"

import { Button } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { useStore } from "@/lib/store/useStore"
import Image from "next/image"

export const AlgoliaWishlist = () => {
  const wishlist = useStore((state) => state.wishlist) || []
  const removeFromWishlist = useStore((state) => state.removeFromWishlist)
  const addToCart = useStore((state) => state.addToCart)

  const handleMoveToCart = (item: any) => {
    addToCart({
      id: item.id,
      handle: item.handle,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: 1
    })
    removeFromWishlist(item.id)
  }

  if (wishlist.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center bg-[#FFFFFF] rounded-[16px] shadow-[0_4px_12px_0_rgba(18,21,53,0.05)] border border-[#E6E6E6]">
        <div className="w-24 h-24 bg-[#F2F9F5] rounded-full flex items-center justify-center text-[#299E60] mb-6">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-[#121535] tracking-[-0.0230em] mb-2">Your Wishlist is Empty</h2>
        <p className="text-[#6C757D] mb-8">Save items you love and buy them later.</p>
        <LocalizedClientLink href="/categories">
          <Button className="bg-[#299E60] text-white px-8 py-3 rounded-[50px] font-semibold hover:bg-[#238a53] shadow-[0_6px_16px_0_rgba(41,158,96,0.2)] border-none">
            Explore Products
          </Button>
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-[#121535] tracking-[-0.0230em]">My Wishlist</h1>
        <span className="bg-[#F2F9F5] text-[#299E60] font-semibold px-3 py-1 rounded-[50px] text-[13px]">
          {wishlist.length} Items
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlist.map((item) => (
          <div key={item.id} className="bg-[#FFFFFF] rounded-[16px] shadow-[0_4px_12px_0_rgba(18,21,53,0.05)] border border-[#E6E6E6] overflow-hidden flex flex-col hover:shadow-[0_8px_24px_0_rgba(18,21,53,0.08)] transition-shadow relative">
            
            <button 
              onClick={() => removeFromWishlist(item.id)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-[#121535] hover:text-[#E63946] shadow-sm transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>

            <LocalizedClientLink href={`/products/${item.handle}`} className="relative w-full aspect-square bg-[#F8F9FA] flex items-center justify-center group block">
              <Image src={item.image} alt={item.title} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
            </LocalizedClientLink>

            <div className="p-4 flex flex-col gap-2 flex-1">
              <LocalizedClientLink href={`/products/${item.handle}`} className="text-[14px] text-[#121535] font-semibold tracking-[-0.0170em] line-clamp-2 leading-tight hover:text-[#299E60] transition-colors">
                {item.title}
              </LocalizedClientLink>
              <div className="text-[18px] text-[#299E60] font-bold mt-auto pt-2">${item.price.toFixed(2)}</div>
            </div>

            <div className="p-3 pt-0">
              <button 
                onClick={() => handleMoveToCart(item)}
                className="w-full py-2.5 bg-[#FF6B35] text-white font-semibold text-[13px] rounded-[50px] shadow-[0_6px_16px_0_rgba(255,107,53,0.25)] hover:bg-[#e85a28] transition-colors"
              >
                Move To Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
