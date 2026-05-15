import { UserNavigation } from "@/components/molecules"
import { AlgoliaWishlist } from "@/components/sections/AlgoliaWishlist/AlgoliaWishlist"

export default function Wishlist() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <UserNavigation />
        <div className="md:col-span-3">
          <AlgoliaWishlist />
        </div>
      </div>
    </main>
  )
}
