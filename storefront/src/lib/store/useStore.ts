import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string // variant ID or objectID from Algolia
  title: string
  price: number
  image: string
  quantity: number
  handle: string
}

export type WishlistItem = {
  id: string
  title: string
  price: number
  image: string
  handle: string
}

interface AppState {
  cartItems: CartItem[]
  wishlistItems: WishlistItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleWishlist: (item: WishlistItem) => void
  isInWishlist: (id: string) => boolean
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      wishlistItems: [],

      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cartItems.find((i) => i.id === item.id)
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { cartItems: [...state.cartItems, item] }
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        })),

      clearCart: () => set({ cartItems: [] }),

      toggleWishlist: (item) =>
        set((state) => {
          const exists = state.wishlistItems.find((i) => i.id === item.id)
          if (exists) {
            return {
              wishlistItems: state.wishlistItems.filter((i) => i.id !== item.id),
            }
          }
          return { wishlistItems: [...state.wishlistItems, item] }
        }),

      isInWishlist: (id) => {
        return get().wishlistItems.some((i) => i.id === id)
      },
    }),
    {
      name: 'pickapp-storage',
    }
  )
)
