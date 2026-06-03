import { HeartIcon } from "@/icons"
import { CartDropdown } from "@/components/cells"
import { UserDropdown } from "@/components/cells/UserDropdown/UserDropdown"
import { retrieveCustomer } from "@/lib/data/customer"
import { WishlistBadge } from "@/components/atoms/WishlistBadge/WishlistBadge"
import CountrySelector from "@/components/molecules/CountrySelector/CountrySelector"
import { listRegions } from "@/lib/data/regions"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { MessageButton } from "@/components/molecules/MessageButton/MessageButton"
import { SellNowButton } from "@/components/cells/SellNowButton/SellNowButton"

/**
 * Slim desktop utilities bar. Primary navigation now lives in the fixed
 * Sidebar rail; this bar keeps account, messaging, wishlist, region and cart
 * reachable. All data fetching (user / wishlist / regions) is preserved.
 */
export const Header = async () => {
  const user = await retrieveCustomer()
  const regions = await listRegions()

  return (
    <header className="flex items-center gap-3 lg:gap-4 py-3 px-4 lg:px-8 bg-canvas">
      <div className="mr-auto">
        <SellNowButton />
      </div>
      <CountrySelector regions={regions} />
      {user && <MessageButton />}
      <UserDropdown user={user} />
      {user && (
        <LocalizedClientLink href="/user/wishlist" className="relative" aria-label="Wishlist">
          <HeartIcon size={20} color="#121535" />
          <WishlistBadge />
        </LocalizedClientLink>
      )}
      <CartDropdown />
    </header>
  )
}
