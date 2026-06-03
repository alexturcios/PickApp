import { ArrowRightIcon } from "@/icons"

/**
 * Marketing top banner (Shop-app style), recolored to the Pickapp palette:
 * Ink Navy surface, Brand Green badge.
 */
export const TopBanner = () => {
  return (
    <div className="flex h-14 items-center justify-center gap-2.5 rounded-card bg-ink px-4 text-white">
      <span className="rounded-xs bg-brand-green px-1.5 py-0.5 text-[11px] font-bold lowercase">
        pickapp
      </span>
      <span className="text-[15px] font-medium">Download the Pickapp app.</span>
      <span className="hidden text-[15px] text-white/70 sm:inline">
        Available on iOS &amp; Android
      </span>
      <ArrowRightIcon size={16} color="#FFFFFF" />
    </div>
  )
}
