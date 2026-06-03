import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"
import { categories } from "@/components/sections/HomeCategories/HomeCategories"

// Cycle the Pickapp palette for the category dots
const DOTS = ["#299E60", "#FF6B35", "#121535", "#E63946", "#FFB800"]

/**
 * Shop-app style horizontal category pills (color dot + label), wired to the
 * real category handles.
 */
export const CategoryPills = () => {
  return (
    <div className="no-scrollbar flex justify-start gap-3 overflow-x-auto px-4 py-6 md:justify-center lg:px-8">
      {categories.map((c, i) => (
        <LocalizedClientLink
          key={c.id}
          href={`/categories/${c.handle}`}
          className="flex shrink-0 items-center gap-2 rounded-pill border border-line bg-surface py-2 pl-2 pr-4 text-[15px] font-medium text-ink transition-colors hover:bg-canvas"
        >
          <span
            className="h-7 w-7 rounded-full"
            style={{ backgroundColor: DOTS[i % DOTS.length] }}
          />
          {c.name}
        </LocalizedClientLink>
      ))}
    </div>
  )
}
