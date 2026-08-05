'use client'

import Link from 'next/link'
import { PACKS } from '@/lib/packs'
import { SHOP_RATING } from '@/lib/reviews'
import ProductCard from '@/components/shop/ProductCard'
import ShopRating from '@/components/ShopRating'

const featured = [...PACKS]
  .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
  .slice(0, 3)

export default function ShopArchives() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-serif mb-2">Shop the Archives</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto text-sm">
          One-time purchases of curated esoteric study packs — delivered as Google Drive access,
          authorized by an admin within a few hours.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <ShopRating rating={SHOP_RATING.rating} count={SHOP_RATING.count} size={18} />
          <span className="text-xs text-zinc-500">from Etsy customers</span>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((p) => (
          <ProductCard key={p.sku} pack={p} />
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/shop"
          className="inline-block border border-amber-400/40 text-amber-300 px-6 py-2.5 rounded-lg hover:bg-amber-400/10 transition-colors text-sm"
        >
          Browse all {PACKS.length} packs →
        </Link>
      </div>
    </section>
  )
}
