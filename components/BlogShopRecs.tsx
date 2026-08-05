import Link from 'next/link'
import { packsForPost } from '@/lib/pack-recs'
import { heroImage, formatUsd } from '@/lib/packs'

/**
 * "Shop the Archives" strip — surfaces the shop packs relevant to a given
 * blog post's topic (matched by slug/tradition). Rendered server-side so the
 * recommendations are inline, indexable, and consistent with the Scroll.
 */
export default function BlogShopRecs({ slug, tradition }: { slug: string; tradition: string }) {
  const packs = packsForPost(slug, tradition)
  if (packs.length === 0) return null

  return (
    <section className="max-w-4xl mx-auto px-6 mb-4" aria-label="Shop the archives">
      <div className="glass-card rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        {/* Header */}
        <div className="px-7 pt-7 pb-5 border-b border-white/8">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#C9A84C] font-bold mb-2">
            Deepen this study
          </p>
          <h2 className="font-cinzel text-2xl md:text-3xl text-[#E8E0F0]">
            Shop the Archives
          </h2>
          <p className="text-sm text-[#9B93AB] mt-1">
            Continue the thread with the primary source vaults behind the Scroll.
          </p>
        </div>

        {/* Packs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/8">
          {packs.map((p) => {
            const img = heroImage(p)
            return (
              <Link
                key={p.sku}
                href={`/shop/${p.sku}`}
                className="group block p-5 transition-colors hover:bg-[#C9A84C]/5"
              >
                {img ? (
                  <div className="rounded-lg overflow-hidden bg-[#0A0A0F] aspect-[4/3] mb-4 border border-white/10">
                    <img
                      src={img}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                ) : (
                  <div className="rounded-lg aspect-[4/3] mb-4 bg-[#12121A] flex items-center justify-center border border-white/10">
                    <span className="text-[#C9A84C] text-2xl">✦</span>
                  </div>
                )}
                <h3 className="text-[#E8E0F0] font-medium leading-snug group-hover:text-[#C9A84C] transition-colors line-clamp-2 text-sm">
                  {p.title}
                </h3>
                <span className="text-[#C9A84C] text-xs font-semibold mt-2 inline-block">
                  {formatUsd(p.price)} · View →
                </span>
              </Link>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-white/8 bg-[#12121A]/40">
          <Link
            href="/shop"
            className="text-[11px] uppercase tracking-[0.25em] text-[#9B93AB] hover:text-[#C9A84C] transition-colors"
          >
            Browse all 50+ archives →
          </Link>
        </div>
      </div>
    </section>
  )
}
