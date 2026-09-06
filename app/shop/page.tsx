import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { PACKS, ARCHIVE_PACK_DISCOUNT_PERCENT } from '@/lib/packs'
import { SHOP_RATING } from '@/lib/reviews'
import ProductCard from '@/components/shop/ProductCard'
import ShopRating from '@/components/ShopRating'

export const metadata = buildMetadata(
  'The Archives',
  'Curated esoteric study packs — tarot, sacred geometry, grimoires, alchemy and more. One-time purchase, delivered as Google Drive access.',
  '/shop',
)

// Highest-engagement packs first (the flagship grimoires bundle leads).
const packs = [...PACKS].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 60)
const total = PACKS.length

export default function ShopPage({ searchParams }: { searchParams?: { cancelled?: string } }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <header className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
          Archive sale · {ARCHIVE_PACK_DISCOUNT_PERCENT}% off every pack
        </div>
        <h1 className="text-4xl font-serif mb-3">The Archives</h1>
        <p className="text-zinc-300 max-w-2xl mx-auto">
          Curated esoteric study packs — tarot, sacred geometry, grimoires, alchemy, and more.
          One-time purchase. Delivered as <strong>Google Drive access</strong> to your own archive.
          <span className="mt-2 block text-emerald-300">Sale prices are charged at checkout; originals are shown crossed out.</span>
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <ShopRating rating={SHOP_RATING.rating} count={SHOP_RATING.count} size={18} />
          <span className="text-xs text-zinc-500">from Etsy customers</span>
        </div>
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
