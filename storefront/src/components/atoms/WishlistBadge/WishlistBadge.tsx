"use client"

import { useStore } from "@/lib/store/useStore"
import { Badge } from "@/components/atoms"

export const WishlistBadge = () => {
  const wishlist = useStore((state) => state.wishlist) || []
  const count = wishlist.length

  if (count === 0) return null

  return (
    <Badge className="absolute -top-2 -right-2 w-4 h-4 p-0 bg-[#E63946] text-white">
      {count}
    </Badge>
  )
}
