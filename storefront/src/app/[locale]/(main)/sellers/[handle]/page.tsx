import { SearchResults } from "@/components/sections"

export default async function SellerPage({
  params,
}: {
  params: Promise<{ handle: string; locale: string }>
}) {
  const { handle } = await params
  
  // Format handle to generic store name (e.g. "super-store" -> "Super Store")
  const storeName = handle.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Generic Vendor Header Banner */}
      <div className="w-full h-48 md:h-64 rounded-[16px] overflow-hidden mb-8 relative bg-gradient-to-r from-[#299E60] to-[#121535]">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex items-end gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#FFFFFF] bg-[#FFFFFF] flex items-center justify-center text-4xl md:text-5xl shadow-[0_4px_12px_0_rgba(18,21,53,0.15)] font-bold text-[#121535]">
            {storeName.charAt(0)}
          </div>
          <div className="mb-2">
            <h1 className="text-2xl md:text-4xl font-bold text-white tracking-[-0.0230em] drop-shadow-md">{storeName}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="bg-[#FFFFFF]/20 backdrop-blur-sm px-3 py-1 rounded-[50px] text-white text-[12px] font-semibold flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFB800" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                4.9 (2k+ reviews)
              </span>
              <span className="bg-[#FFFFFF]/20 backdrop-blur-sm px-3 py-1 rounded-[50px] text-white text-[12px] font-semibold">
                Member since 2023
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#121535]">All Products</h2>
      </div>

      {/* Reusing SearchResults to filter by vendor. We don't have a vendor prop yet, so we use categoryHandle as a hack for now, or we can update SearchResults to support vendor filtering. */}
      {/* Wait, I can pass a `vendorHandle` to SearchResults. I will update SearchResults.tsx shortly. */}
      <SearchResults vendorHandle={storeName} />
    </main>
  )
}
