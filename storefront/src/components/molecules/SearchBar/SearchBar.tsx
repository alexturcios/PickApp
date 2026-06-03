"use client"

import { useSearchBox } from "react-instantsearch"
import { useRouter, usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { AutocompleteDropdown } from "@/components/organisms/AutocompleteDropdown/AutocompleteDropdown"
import { SearchIcon, ArrowRightIcon } from "@/icons"

/**
 * The Shop-style search pill, wired to the live Algolia InstantSearch state
 * (apparel sample dataset) + the Query Suggestions index via AutocompleteDropdown.
 *
 * - `floating`: renders the bottom-center sticky variant.
 */
export const SearchBar = ({
  floating = false,
  placeholder = "What are you shopping for today?",
}: {
  floating?: boolean
  placeholder?: string
}) => {
  const { query, refine } = useSearchBox()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const submitHandler = () => {
    setIsOpen(false)
    const target = `/search?q=${encodeURIComponent(query)}`
    if (!pathname?.endsWith("/search")) {
      router.push(target)
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    submitHandler()
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <form
        onSubmit={handleFormSubmit}
        className={`flex items-center gap-2 rounded-pill bg-surface p-1.5 pl-6 ${
          floating
            ? "border border-line shadow-card-hover"
            : "shadow-card ring-1 ring-black/5"
        }`}
      >
        <span className="shrink-0 text-muted">
          <SearchIcon size={18} />
        </span>
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            refine(e.target.value)
            if (!isOpen) setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
          className="h-10 flex-1 bg-transparent text-[16px] text-ink placeholder:text-muted focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Search"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green text-white shadow-brand transition-transform hover:scale-105"
        >
          <ArrowRightIcon size={18} color="#FFFFFF" />
        </button>
      </form>

      <AutocompleteDropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={submitHandler}
        openUpward={floating}
      />
    </div>
  )
}
