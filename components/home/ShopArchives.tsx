'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PACKS, ARCHIVE_PACK_DISCOUNT_PERCENT } from '@/lib/packs'
import { pickHomePacks } from '@/lib/pack-ordering'
import { SHOP_RATING } from '@/lib/reviews'
import ProductCard from '@/components/shop/ProductCard'
import ShopRating from '@/components/ShopRating'

export default function ShopArchives() {
  // Keep the server render stable, then draw a fresh six-pack selection per visit.
  const [featured, setFeatured] = useState(() => PACKS.slice(0, 6))
  useEffect(() => {
    setFeatured(pickHomePacks(PACKS, 6))
    const reshuffleOnRestore = (event: PageTransitionEvent) => {
      if (event.persisted) setFeatured(pickHomePacks(PACKS, 6))
    }
    window.addEventListener('pageshow', reshuffleOnRestore)
    return () => window.removeEventListener('pageshow', reshuffleOnRestore)
  }, [])
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
          Limited archive sale · {ARCHIVE_PACK_DISCOUNT_PERCENT}% off every pack
        </div>
        <h2 className="text-3xl font-serif mb-2">Shop the Archives</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto text-sm">
          One-time purchases of curated esoteric study packs — delivered as Google Drive access,
          authorized by an admin within a few hours. Sale prices are shown with the original price crossed out.
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
