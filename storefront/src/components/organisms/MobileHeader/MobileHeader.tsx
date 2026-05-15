"use client"

import Image from "next/image"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { useState } from "react"
import { NavbarSearch } from "@/components/molecules"
import { useStore } from "@/lib/store/useStore"

export const MobileHeader = () => {
  const [searchOpen, setSearchOpen] = useState(false)
  const cart = useStore((state) => state.cart) || []
  const wishlist = useStore((state) => state.wishlist) || []

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const wishlistCount = wishlist.length

  return (
    <div className="lg:hidden sticky top-0 z-50 bg-[#FFFFFF] border-b border-[#E6E6E6] shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <LocalizedClientLink href="/" className="flex items-center">
          <Image src="/Logo.svg" width={100} height={32} alt="Logo" priority />
        </LocalizedClientLink>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          {/* Search toggle */}
          <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Search" className="relative">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#121535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>

          {/* Wishlist */}
          <LocalizedClientLink href="/user/wishlist" className="relative" aria-label="Wishlist">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#121535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#E63946] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </LocalizedClientLink>

          {/* Cart */}
          <LocalizedClientLink href="/cart" className="relative" aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#121535" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#E63946] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </LocalizedClientLink>
        </div>
      </div>

      {/* Expandable search */}
      {searchOpen && (
        <div className="px-4 pb-3">
          <NavbarSearch />
        </div>
      )}
    </div>
  )
}
