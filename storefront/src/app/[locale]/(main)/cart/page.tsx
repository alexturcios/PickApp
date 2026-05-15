import { AlgoliaCart } from '@/components/sections/Cart/AlgoliaCart';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cart | Storefront',
  description: 'Your shopping cart',
};

export default function CartPage() {
  return (
    <main className='container mx-auto px-4 py-8 md:py-12 grid grid-cols-12 gap-8'>
      <AlgoliaCart />
    </main>
  );
}
