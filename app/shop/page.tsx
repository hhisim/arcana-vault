import Link from 'next/link'
import { PACKS } from '@/lib/packs'
import ProductCard from '@/components/shop/ProductCard'

export const metadata = {
  title: 'The Archives — Vault of Arcana',
  description:
    'Curated esoteric study packs — tarot, sacred geometry, grimoires, alchemy and more. One-time purchase, delivered as Google Drive access.',
}

// Highest-engagement packs first (the flagship grimoires bundle leads).
const packs = [...PACKS].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 60)
const total = PACKS.length

export default function ShopPage({ searchParams }: { searchParams?: { cancelled?: string } }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-serif mb-3">The Archives</h1>
        <p className="text-zinc-300 max-w-2xl mx-auto">
          Curated esoteric study packs — tarot, sacred geometry, grimoires, alchemy, and more.
          One-time purchase. Delivered as <strong>Google Drive access</strong> to your own archive.
        </p>
        <p className="text-zinc-500 text-sm mt-3">
          {total} packs · Admin authorizes your Drive access within a few hours of purchase
        </p>
        {searchParams?.cancelled && (
          <p className="text-zinc-400 text-sm mt-4">Checkout was cancelled — nothing was charged.</p>
        )}
        <p className="text-zinc-500 text-sm mt-4">
          Already bought a pack?{' '}
          <Link href="/account/access" className="text-amber-300 underline">
            Go to your locker
          </Link>
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {packs.map((p) => (
          <ProductCard key={p.sku} pack={p} />
        ))}
      </div>

      <p className="text-center text-zinc-500 text-sm mt-12">
        Every purchase is delivered as Google Drive access.{' '}
        <Link href="/contact" className="text-amber-300 underline">
          Contact us
        </Link>{' '}
        with any questions.
      </p>
    </main>
  )
}
