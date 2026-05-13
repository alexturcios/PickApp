"use client"
import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { liteClient as algoliasearch } from 'algoliasearch/lite';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

export const AlgoliaProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <InstantSearchNext searchClient={searchClient} indexName="algolia_apparel_sample_dataset">
      {children}
    </InstantSearchNext>
  )
}
