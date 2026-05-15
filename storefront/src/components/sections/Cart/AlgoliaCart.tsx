"use client"

import { Button } from "@/components/atoms"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { useStore } from "@/lib/store/useStore"
import Image from "next/image"

export const AlgoliaCart = () => {
  const cart = useStore((state) => state.cart) || []
  const removeFromCart = useStore((state) => state.removeFromCart)
  const updateQuantity = useStore((state) => state.updateQuantity)

  if (cart.length === 0) {
    return (
      <div className="col-span-12 py-20 flex flex-col items-center justify-center bg-[#FFFFFF] rounded-[16px] shadow-[0_4px_12px_0_rgba(18,21,53,0.05)] border border-[#E6E6E6]">
        <div className="w-24 h-24 bg-[#F2F9F5] rounded-full flex items-center justify-center text-[#299E60] mb-6">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-[#121535] tracking-[-0.0230em] mb-2">Your Cart is Empty</h2>
        <p className="text-[#6C757D] mb-8">Looks like you haven't added any products to your cart yet.</p>
        <LocalizedClientLink href="/categories">
          <Button className="bg-[#299E60] text-white px-8 py-3 rounded-[50px] font-semibold hover:bg-[#238a53] shadow-[0_6px_16px_0_rgba(41,158,96,0.2)] border-none">
            Continue Shopping
          </Button>
        </LocalizedClientLink>
      </div>
    )
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  return (
    <>
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-[#121535] tracking-[-0.0230em] mb-2">Shopping Cart</h1>
        <div className="bg-[#FFFFFF] rounded-[16px] shadow-[0_4px_12px_0_rgba(18,21,53,0.05)] border border-[#E6E6E6] overflow-hidden">
          {/* Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-[#E6E6E6] bg-[#F8F9FA] text-[13px] font-bold text-[#121535]">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          
          {/* Items */}
          <div className="flex flex-col">
            {cart.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 border-b border-[#E6E6E6] last:border-0 items-center">
                <div className="col-span-1 md:col-span-6 flex gap-4 items-center">
                  <button onClick={() => removeFromCart(item.id)} className="text-[#E63946] hover:bg-[#F2F9F5] p-2 rounded-full transition-colors flex-shrink-0" aria-label="Remove item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                  <div className="w-20 h-20 bg-[#F8F9FA] rounded-[8px] flex items-center justify-center border border-[#E6E6E6] relative overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-contain p-2" />
                  </div>
                  <LocalizedClientLink href={`/products/${item.handle}`} className="font-semibold text-[14px] text-[#121535] hover:text-[#299E60] transition-colors line-clamp-2">
                    {item.title}
                  </LocalizedClientLink>
                </div>
                
                <div className="col-span-1 md:col-span-2 text-center md:text-center flex justify-between md:block">
                  <span className="md:hidden text-[#6C757D] text-[13px]">Price:</span>
                  <span className="font-semibold text-[#121535]">${item.price.toFixed(2)}</span>
                </div>
                
                <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center">
                  <span className="md:hidden text-[#6C757D] text-[13px]">Quantity:</span>
                  <div className="flex items-center bg-[#F8F9FA] rounded-[50px] border border-[#E6E6E6] p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-7 h-7 flex items-center justify-center text-[#121535] hover:bg-[#E6E6E6] rounded-full transition-colors text-[16px] font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold text-[#121535] text-[13px]">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-[#121535] hover:bg-[#E6E6E6] rounded-full transition-colors text-[16px] font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-2 text-right flex justify-between md:block mt-2 md:mt-0">
                  <span className="md:hidden text-[#6C757D] text-[13px]">Total:</span>
                  <span className="font-bold text-[#299E60]">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="col-span-12 lg:col-span-4 mt-8 lg:mt-[56px]">
        <div className="bg-[#F2F9F5] p-6 rounded-[16px] border border-[#E6E6E6] sticky top-24">
          <h2 className="text-xl font-bold text-[#121535] mb-6">Order Summary</h2>
          
          <div className="flex flex-col gap-4 text-[14px]">
            <div className="flex justify-between items-center text-[#6C757D]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#121535]">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-[#6C757D]">
              <span>Shipping</span>
              <span className="text-[#299E60] font-semibold">Free</span>
            </div>
            <div className="flex justify-between items-center text-[#6C757D]">
              <span>Tax (10%)</span>
              <span className="font-semibold text-[#121535]">${tax.toFixed(2)}</span>
            </div>
            
            <div className="border-t border-[#E6E6E6] my-2"></div>
            
            <div className="flex justify-between items-center text-[18px] mb-6">
              <span className="font-bold text-[#121535]">Total</span>
              <span className="font-bold text-[#FF6B35]">${total.toFixed(2)}</span>
            </div>
          </div>
          
          <LocalizedClientLink href="/checkout">
            <Button className="w-full py-4 bg-[#FF6B35] text-white rounded-[50px] shadow-[0_6px_16px_0_rgba(255,107,53,0.25)] hover:bg-[#e85a28] font-bold text-[14px] border-none flex justify-center items-center gap-2">
              Proceed to Checkout
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Button>
          </LocalizedClientLink>
          
          <div className="mt-6 flex flex-col items-center gap-3">
            <span className="text-[11px] text-[#6C757D] uppercase tracking-wider font-semibold">Secure Payment</span>
            <div className="flex gap-2">
              <div className="w-10 h-6 bg-[#FFFFFF] rounded border border-[#E6E6E6] flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#121535]">VISA</span>
              </div>
              <div className="w-10 h-6 bg-[#FFFFFF] rounded border border-[#E6E6E6] flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#121535]">MC</span>
              </div>
              <div className="w-10 h-6 bg-[#FFFFFF] rounded border border-[#E6E6E6] flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#121535]">AMEX</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
