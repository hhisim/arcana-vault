'use client'

import Link from 'next/link'
import { ShopPack, heroImage, formatUsd, formatArchiveSalePrice, ARCHIVE_PACK_DISCOUNT_PERCENT, isBestseller } from '@/lib/packs'
import { getPackRating } from '@/lib/reviews'
import BuyButton from '@/components/shop/BuyButton'
import ShopRating from '@/components/ShopRating'

/**
 * Vault product card. The pack's hero image sits as a dimmed (50% opacity)
 * backdrop that brightens on hover; on desktop the same hover lifts the card
 * and reveals a "View details" affordance linking to the pack's own page.
 */
export default function ProductCard({ pack }: { pack: ShopPack }) {
  const img = heroImage(pack)
  const detailHref = `/shop/${pack.sku}`
  const rating = getPackRating(pack.sku)
  const best = isBestseller(pack.sku)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0d15] transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/50 hover:shadow-[0_14px_44px_-12px_rgba(201,168,76,0.28)]">
      <Link href={detailHref} className="relative block overflow-hidden">
        {best && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a1206] shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            Bestseller
          </span>
        )}
        <span className="absolute right-3 top-3 z-10 rounded-full border border-emerald-300/50 bg-emerald-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#06140c] shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          {ARCHIVE_PACK_DISCOUNT_PERCENT}% off
        </span>
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
            <div className="mt-1.5">
              {rating ? (
                <ShopRating rating={rating.rating} count={rating.count} size={13} />
              ) : (
                <span className="text-[11px] text-zinc-400">
                  {pack.views > 0 && <span>{pack.views.toLocaleString()} views</span>}
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-400">
              {rating ? (
                <span>{pack.views > 0 && <span>{pack.views.toLocaleString()} views</span>}</span>
              ) : (
                <span>{pack.favs > 0 && <span>{pack.favs} favorites</span>}</span>
              )}
              <span className="text-amber-300 underline-offset-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Details →
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Price + buy bar */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
        <div className="leading-tight">
          <div className="flex items-baseline gap-2">
            <span className="text-amber-200 font-semibold text-lg">{formatArchiveSalePrice(pack.price)}</span>
            <span className="text-xs text-zinc-500 line-through decoration-red-400/80 decoration-2">{formatUsd(pack.price)}</span>
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300">Archive sale</div>
        </div>
        <BuyButton sku={pack.sku} price={formatArchiveSalePrice(pack.price)} />
      </div>
    </article>
  )
}
