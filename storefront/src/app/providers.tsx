"use client"

import { CartProvider } from "@/components/providers"
import { Cart } from "@/types/cart"
import type React from "react"
import { PropsWithChildren } from "react"
import { AlgoliaProvider } from "@/components/providers/AlgoliaProvider"

interface ProvidersProps extends PropsWithChildren {
  cart: Cart | null
}

export function Providers({ children, cart }: ProvidersProps) {
  return (
    <AlgoliaProvider>
      <CartProvider cart={cart}>{children}</CartProvider>
    </AlgoliaProvider>
  )
}
