import { SearchResults } from "@/components/sections/SearchResults/SearchResults"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#121535] mb-2">Search Results</h1>
        {q && <p className="text-[#6C757D]">Showing results for "{q}"</p>}
      </div>
      <SearchResults initialQuery={q || ""} />
    </main>
  )
}
