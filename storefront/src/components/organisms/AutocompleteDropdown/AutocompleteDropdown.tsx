"use client"

import { useHits, useSearchBox, Index, useRefinementList } from "react-instantsearch"
import { AutocompleteProductRow } from "../../molecules/AutocompleteProductRow/AutocompleteProductRow"
import clsx from "clsx"

const SuggestionHit = ({ hit, onSelect }: { hit: any, onSelect: (q: string) => void }) => {
  return (
    <button 
      type="button"
      onClick={() => onSelect(hit.query)}
      className="flex items-center justify-between w-full py-2 px-3 hover:bg-[#F2F9F5] rounded-md transition-colors text-left"
    >
      <div className="flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#299E60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <span className="text-[14px] text-[#121535]">{hit.query}</span>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6C757D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
    </button>
  )
}

const PopularSearches = ({ onSelect }: { onSelect: (q: string) => void }) => {
  const { hits } = useHits()
  
  if (hits.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-[11px] font-bold text-[#121535] uppercase tracking-widest mb-3 px-2">Popular Searches</h3>
      <div className="flex flex-col">
        {hits.slice(0, 5).map((hit: any) => (
          <SuggestionHit key={hit.objectID} hit={hit} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}

const BrandFacets = () => {
  // Using vendor as the attribute since sample datasets often use vendor or brand
  const { items, refine } = useRefinementList({ attribute: 'vendor' })
  
  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-[11px] font-bold text-[#121535] uppercase tracking-widest mb-3 px-2">Brand</h3>
      <div className="flex flex-col">
        {items.slice(0, 5).map((item) => (
          <button 
            type="button"
            key={item.value}
            onClick={() => refine(item.value)}
            className="flex items-center gap-2 w-full py-2 px-3 hover:bg-[#F2F9F5] rounded-md transition-colors text-left"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6C757D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            <span className="text-[14px] text-[#121535]">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const RecentSearches = ({ onSelect }: { onSelect: (q: string) => void }) => {
  const recent = ["shoes", "iphone", "computers", "phones"]; // Mocked recent
  return (
    <div className="mb-6">
      <h3 className="text-[11px] font-bold text-[#121535] uppercase tracking-widest mb-3 px-2">Recent Searches</h3>
      <div className="flex flex-col">
        {recent.map((q) => (
          <button 
            type="button"
            key={q}
            onClick={() => onSelect(q)}
            className="flex items-center justify-between w-full py-2 px-3 hover:bg-[#F2F9F5] rounded-md transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6C757D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span className="text-[14px] text-[#121535]">{q}</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6C757D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
          </button>
        ))}
      </div>
    </div>
  )
}

export const AutocompleteDropdown = ({
  isOpen,
  onClose,
  onSubmit
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}) => {
  const { query, refine } = useSearchBox()
  const { hits } = useHits()
  
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-2 w-full max-w-[800px] min-w-[600px] bg-[#FFFFFF] rounded-[16px] shadow-[0_8px_24px_0_rgba(18,21,53,0.15)] border border-[#E6E6E6] z-50 overflow-hidden flex flex-col md:flex-row">
      {/* Left Sidebar */}
      <div className="w-full md:w-[35%] bg-[#FFFFFF] p-6 border-b md:border-b-0 md:border-r border-[#E6E6E6] flex flex-col max-h-[500px] overflow-y-auto">
        {query ? (
          <Index indexName="algolia_apparel_sample_dataset_query_suggestions2">
            <PopularSearches onSelect={(q) => { refine(q); onSubmit(); }} />
          </Index>
        ) : (
          <>
            <RecentSearches onSelect={(q) => { refine(q); onSubmit(); }} />
            <BrandFacets />
          </>
        )}
      </div>
      
      {/* Right Content Area */}
      <div className="w-full md:w-[65%] bg-[#FFFFFF] p-6 max-h-[500px] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-[11px] font-bold text-[#121535] uppercase tracking-widest">Products</h3>
          <button type="button" onClick={onSubmit} className="text-[11px] text-[#299E60] font-semibold hover:underline flex items-center gap-1">
            See more products <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {hits.slice(0, 5).map((hit) => (
            <AutocompleteProductRow key={hit.objectID} hit={hit} onSelect={onClose} />
          ))}
          {hits.length === 0 && (
            <p className="text-[14px] text-[#6C757D] p-2">No products found for "{query}".</p>
          )}
        </div>
      </div>
    </div>
  )
}
