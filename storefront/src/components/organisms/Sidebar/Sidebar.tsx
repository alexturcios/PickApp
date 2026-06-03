"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import {
  HomeIcon,
  DashboardIcon,
  CartIcon,
  DiscountIcon,
  HeartIcon,
  ProfileIcon,
} from "@/icons"

const navItems = [
  { icon: HomeIcon, label: "Home", href: "/" },
  { icon: DashboardIcon, label: "Categories", href: "/categories" },
  { icon: CartIcon, label: "Cart", href: "/cart" },
  { icon: DiscountIcon, label: "Deals", href: "/search" },
  { icon: HeartIcon, label: "Saved", href: "/user/wishlist" },
]

/**
 * Fixed left icon rail (desktop only) — the Shop-app navigation skeleton,
 * skinned with the Pickapp Brand Green active state.
 */
export const Sidebar = () => {
  const pathname = usePathname() || "/"

  // strip the leading /{locale} segment for active matching
  const normalized = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/"

  const isActive = (href: string) =>
    href === "/" ? normalized === "/" : normalized.startsWith(href)

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[76px] flex-col items-center justify-between border-r border-line bg-surface py-6 md:flex">
      <div className="flex flex-col items-center gap-7">
        <LocalizedClientLink href="/" aria-label="Pickapp home">
          <Image src="/Logo.svg" width={36} height={36} alt="Pickapp" priority />
        </LocalizedClientLink>
        <nav className="flex flex-col items-center gap-1">
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = isActive(href)
            return (
              <LocalizedClientLink
                key={label}
                href={href}
                aria-label={label}
                title={label}
                className={`flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-canvas ${
                  active ? "bg-canvas" : ""
                }`}
              >
                <Icon
                  size={22}
                  color={active ? "#299E60" : "#6C757D"}
                />
              </LocalizedClientLink>
            )
          })}
        </nav>
      </div>
      <LocalizedClientLink
        href="/user"
        aria-label="Account"
        className="flex flex-col items-center gap-1 text-muted transition-colors hover:text-ink"
      >
        <ProfileIcon size={22} color="#6C757D" />
        <span className="text-[11px] font-medium">Account</span>
      </LocalizedClientLink>
    </aside>
  )
}
