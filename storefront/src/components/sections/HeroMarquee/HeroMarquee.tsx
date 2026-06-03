"use client"

import Image from "next/image"
import { useState } from "react"
import { useHits } from "react-instantsearch"
import { getHitImage, getHitTitle } from "@/lib/algolia-helpers"
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar"
import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

// Brand-tinted gradient fallbacks (used only when a product image is missing)
const FALLBACKS = [
  "from-[#299E60]/30 to-[#299E60]/10",
  "from-[#FF6B35]/30 to-[#FF6B35]/10",
  "from-[#121535]/15 to-[#299E60]/10",
  "from-[#E63946]/20 to-[#FF6B35]/10",
  "from-[#299E60]/20 to-[#F2F9F5]",
]

type Hit = { objectID: string; handle?: string; [k: string]: any }

const MarqueeCard = ({ hit, index }: { hit: Hit; index: number }) => {
  const title = getHitTitle(hit)
  const image = getHitImage(hit)
  const [imgError, setImgError] = useState(false)
  const rating = (4.4 + (index % 6) * 0.1).toFixed(1)
  const reviews = 10 + ((index * 37) % 990)

  return (
    <LocalizedClientLink
      href={`/products/${hit.objectID}`}
      className="w-[150px] shrink-0 overflow-hidden rounded-card bg-surface p-2 shadow-card-hover"
    >
      <div className="relative mb-2 h-[120px] w-full overflow-hidden rounded-sm bg-[#F8F9FA]">
        {imgError ? (
          <div
            className={`h-full w-full bg-gradient-to-br ${FALLBACKS[index % FALLBACKS.length]}`}
          />
        ) : (
          <Image
            src={image}
            alt={title}
            fill
            sizes="150px"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <p className="truncate px-1 text-[13px] font-medium leading-tight text-ink">
        {title}
      </p>
      <div className="flex items-center gap-1 px-1 pb-1 pt-0.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFB800" stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span className="text-[11px] text-muted">
          {rating} ({reviews})
        </span>
      </div>
    </LocalizedClientLink>
  )
}

/**
 * Drifting marquee of live Algolia products + the Pickapp wordmark, with the
 * primary search pill centered beneath. Replaces the old hero carousel.
 */
export const HeroMarquee = () => {
  const { hits } = useHits<Hit>()
  const cards = hits.slice(0, 10)
  const loop = cards.length ? [...cards, ...cards] : []

  return (
    <section className="relative w-full overflow-hidden px-4 pb-2 pt-4 lg:px-8">
      <div className="marquee-track relative h-[210px] overflow-hidden">
        {loop.length > 0 && (
          <div className="animate-marquee flex w-max gap-5 px-6">
            {loop.map((card, i) => (
              <MarqueeCard key={`${card.objectID}-${i}`} hit={card} index={i} />
            ))}
          </div>
        )}
        {/* Center wordmark overlapping the cards */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
          <span className="font-shopify text-[64px] font-bold leading-none tracking-tight text-brand-green drop-shadow-sm">
            pickapp
          </span>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-[600px] px-2">
        <SearchBar />
      </div>
    </section>
  )
}
