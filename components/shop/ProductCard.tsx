'use client'

import Link from 'next/link'
import { ShopPack, heroImage, formatUsd } from '@/lib/packs'
import BuyButton from '@/components/shop/BuyButton'

/**
 * Vault product card. The pack's hero image sits as a dimmed (50% opacity)
 * backdrop that brightens on hover; on desktop the same hover lifts the card
 * and reveals a "View details" affordance linking to the pack's own page.
 */
export default function ProductCard({ pack }: { pack: ShopPack }) {
  const img = heroImage(pack)
  const detailHref = `/shop/${pack.sku}`

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0d15] transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/50 hover:shadow-[0_14px_44px_-12px_rgba(201,168,76,0.28)]">
      <Link href={detailHref} className="relative block overflow-hidden">
        {/* Hero image — 50% opacity base, brightens on hover */}
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          {img ? (
            <img
              src={img}
              alt={pack.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-50 transition-all duration-500 ease-out group-hover:scale-[1.06] group-hover:opacity-90"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-[#141225] to-black" />
          )}
          {/* Bottom legibility gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

          {/* Title + meta overlaid on the image */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="font-serif text-base leading-snug text-[#EBE4F2] line-clamp-2">
              {pack.title}
            </h3>
            <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-400">
              <span>
                {pack.views > 0 && <span>{pack.views.toLocaleString()} views</span>}
                {pack.favs > 0 && <span> · {pack.favs} favorites</span>}
              </span>
              <span className="text-amber-300 underline-offset-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Details →
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Price + buy bar */}
      <div className="mt-auto flex items-center justify-between border-t border-white/10 px-4 py-3">
        <span className="text-amber-200 font-semibold text-lg">{formatUsd(pack.price)}</span>
        <BuyButton sku={pack.sku} price={formatUsd(pack.price)} />
      </div>
    </article>
  )
}
