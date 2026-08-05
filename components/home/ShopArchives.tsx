'use client'

import Link from 'next/link'
import { SHOP_PACKS, formatUsd } from '@/lib/shop'
import BuyButton from '@/components/shop/BuyButton'

const featured = [...SHOP_PACKS]
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
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {featured.map((p) => (
          <div key={p.sku} className="border border-white/10 rounded-xl p-5 flex flex-col bg-white/[0.02]">
            <h3 className="font-serif text-base leading-snug mb-2">{p.title}</h3>
            <div className="text-zinc-500 text-xs mb-4">
              {p.views != null && p.views > 0 && <span>{p.views.toLocaleString()} views</span>}
              {p.favs != null && p.favs > 0 && <span> · {p.favs} favorites</span>}
            </div>
            <div className="mt-auto flex items-center justify-between">
              <span className="text-amber-200 font-semibold">{formatUsd(p.price)}</span>
              <BuyButton sku={p.sku} price={formatUsd(p.price)} />
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/shop"
          className="inline-block border border-amber-400/40 text-amber-300 px-6 py-2.5 rounded-lg hover:bg-amber-400/10 transition-colors text-sm"
        >
          Browse all {SHOP_PACKS.length} packs →
        </Link>
      </div>
    </section>
  )
}
