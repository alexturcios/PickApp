"use client"

import { Input } from "@/components/atoms"
import { SearchIcon } from "@/icons"
import { useSearchBox } from "react-instantsearch"
import { redirect, usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { AutocompleteDropdown } from "@/components/organisms/AutocompleteDropdown/AutocompleteDropdown"

export const NavbarSearch = () => {
  const { query, refine } = useSearchBox()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const submitHandler = () => {
    setIsOpen(false)
    if (pathname !== "/") {
      redirect(`/?query=${query}`)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    submitHandler()
  }

  return (
    <div className="relative flex-1 max-w-2xl" ref={containerRef}>
      <form className="flex items-center w-full relative z-50" method="POST" onSubmit={handleFormSubmit}>
        <div className="w-full" onClick={() => setIsOpen(true)}>
          <Input
            icon={<SearchIcon />}
            placeholder="Search for products, brands, categories..."
            value={query}
            changeValue={(v) => {
              refine(v)
              if (!isOpen) setIsOpen(true)
            }}
            autoComplete="off"
          />
        </div>
        <input type="submit" className="hidden" />
      </form>

      <AutocompleteDropdown 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        onSubmit={submitHandler}
      />
    </div>
  )
}
