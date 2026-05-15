"use client"

import { Badge, Button } from "@/components/atoms"
import { Dropdown } from "@/components/molecules"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { CartIcon } from "@/icons"
import { useState } from "react"
import { useStore } from "@/lib/store/useStore"
import Image from "next/image"

export const CartDropdown = () => {
  const [open, setOpen] = useState(false)
  
  const cart = useStore((state) => state.cart) || []
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (
    <div
      className="relative"
      onMouseOver={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <LocalizedClientLink
        href="/cart"
        className="relative"
        aria-label="Go to cart"
      >
        <CartIcon size={20} />
        {Boolean(cartItemsCount) && (
          <Badge className="absolute -top-2 -right-2 w-4 h-4 p-0 bg-[#FF6B35] text-white">
            {cartItemsCount}
          </Badge>
        )}
      </LocalizedClientLink>
      <Dropdown show={open}>
        <div className="lg:w-[360px] shadow-[0_8px_24px_0_rgba(18,21,53,0.15)] bg-white rounded-[16px] overflow-hidden border border-[#E6E6E6]">
          <h3 className="text-[14px] font-bold text-[#121535] border-b border-[#E6E6E6] p-4 bg-[#F2F9F5]">Shopping Cart</h3>
          <div className="p-4">
            {cartItemsCount > 0 ? (
              <div className="flex flex-col gap-4">
                <div className="overflow-y-auto max-h-[300px] flex flex-col gap-4 pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-[#F8F9FA] rounded-[8px] flex items-center justify-center border border-[#E6E6E6] relative overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-contain p-1" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[13px] font-semibold text-[#121535] line-clamp-1">{item.title}</h4>
                        <div className="text-[12px] text-[#6C757D] mt-1">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-bold text-[#299E60] text-[13px]">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#E6E6E6] pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[14px] font-semibold text-[#121535]">Subtotal</span>
                    <span className="text-[18px] font-bold text-[#FF6B35]">${cartTotal.toFixed(2)}</span>
                  </div>
                  <LocalizedClientLink href="/cart">
                    <Button className="w-full bg-[#FF6B35] text-white py-3 rounded-[50px] shadow-[0_6px_16px_0_rgba(255,107,53,0.25)] hover:bg-[#e85a28] font-semibold text-[13px] border-none">
                      Go to Checkout
                    </Button>
                  </LocalizedClientLink>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#F2F9F5] rounded-full flex items-center justify-center text-[#299E60] mx-auto mb-4">
                  <CartIcon size={24} />
                </div>
                <h4 className="text-[14px] font-bold text-[#121535] mb-2">Your cart is empty</h4>
                <p className="text-[13px] text-[#6C757D] mb-6">Discover our latest products and deals.</p>
                <LocalizedClientLink href="/categories">
                  <Button className="w-full bg-[#299E60] text-white py-2.5 rounded-[50px] font-semibold text-[13px] border-none shadow-[0_6px_16px_0_rgba(41,158,96,0.2)]">
                    Explore Marketplace
                  </Button>
                </LocalizedClientLink>
              </div>
            )}
          </div>
        </div>
      </Dropdown>
    </div>
  )
}
