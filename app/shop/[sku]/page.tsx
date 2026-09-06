import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { notFound } from 'next/navigation'
import { getPack, PACKS, formatUsd, formatArchiveSalePrice, ARCHIVE_PACK_DISCOUNT_PERCENT, isBestseller } from '@/lib/packs'
import { getPackRating } from '@/lib/reviews'
import { getJournalLinks, journalUrl } from '@/lib/journal-links'
import BuyButton from '@/components/shop/BuyButton'
import ImageGallery from '@/components/shop/ImageGallery'
import DescriptionText from '@/components/shop/DescriptionText'
import ShopRating from '@/components/ShopRating'

export const dynamicParams = true

const baseUrl = 'https://www.vaultofarcana.com'

export function generateStaticParams() {
  return PACKS.map((p) => ({ sku: p.sku }))
}

export function generateMetadata({ params }: { params: { sku: string } }) {
  const pack = getPack(params.sku)
  if (!pack) {
    return buildMetadata(
      'Archive Pack Not Found',
      'The requested Vault of Arcana archive pack could not be found.',
      `/shop/${params.sku}`,
      { noIndex: true },
    )
  }
  return buildMetadata(
    pack.title,
    `One-time purchase of "${pack.title}" — delivered as Google Drive access, authorized within a few hours.`,
    `/shop/${pack.sku}`,
    { image: pack.images?.[0], imageAlt: pack.title },
  )
}

export default function PackPage({ params }: { params: { sku: string } }) {
  const pack = getPack(params.sku)
  if (!pack) notFound()

  const hasImages = pack.images && pack.images.length > 0
  const rating = getPackRating(pack.sku)
  const best = isBestseller(pack.sku)
  const relatedJournal = getJournalLinks(pack.sku)

  const heroImg = pack.images && pack.images.length > 0 ? pack.images[0] : undefined
  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pack.title,
    description: pack.description?.slice(0, 500) ?? `${pack.title} — one-time esoteric study pack.`,
    image: heroImg ? `${baseUrl}${heroImg}` : undefined,
    url: `${baseUrl}/shop/${pack.sku}`,
    brand: { '@type': 'Brand', name: 'Vault of Arcana' },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/shop/${pack.sku}`,
      priceCurrency: 'USD',
      price: String(formatArchiveSalePrice(pack.price).replace('$', '')),
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    ...(rating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rating.rating,
            reviewCount: rating.count,
            bestRating: 5,
          },
        }
      : {}),
  }
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'The Archives', item: `${baseUrl}/shop` },
      { '@type': 'ListItem', position: 2, name: pack.title, item: `${baseUrl}/shop/${pack.sku}` },
    ],
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/shop" className="hover:text-amber-300 transition-colors">
          The Archives
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-300 line-clamp-1">{pack.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <ImageGallery images={pack.images ?? []} title={pack.title} />
        </div>

        {/* Info */}
        <div>
          <h1 className="font-serif text-2xl md:text-3xl leading-tight text-[#EBE4F2]">
            {pack.title}
          </h1>
          {best && (
            <span className="mt-3 inline-block rounded-full bg-gradient-to-r from-amber-400 to-amber-300 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a1206]">
              ★ Bestseller — one of the Vault's most-favorited archives
            </span>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <span className="text-amber-200 font-semibold text-3xl">{formatArchiveSalePrice(pack.price)}</span>
            <span className="text-lg text-zinc-500 line-through decoration-red-400/80 decoration-2">{formatUsd(pack.price)}</span>
            <span className="rounded-full border border-emerald-300/40 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
              {ARCHIVE_PACK_DISCOUNT_PERCENT}% archive sale
            </span>
            <span className="text-sm text-zinc-400">
              {pack.views > 0 && <span>{pack.views.toLocaleString()} views</span>}
              {pack.favs > 0 && <span> · {pack.favs} favorites</span>}
            </span>
          </div>

          {rating && (
            <div className="mt-3 flex items-center gap-2">
              <ShopRating rating={rating.rating} count={rating.count} />
              <span className="text-xs text-zinc-500">from Etsy customers</span>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <BuyButton sku={pack.sku} price={formatArchiveSalePrice(pack.price)} />
            <span className="text-xs text-zinc-500">One-time purchase · delivered as Google Drive access</span>
          </div>

          {/* Delivery card */}
          <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-300">
            <h2 className="font-serif text-amber-200 mb-2">What happens after purchase</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Your payment is processed securely by Stripe.</li>
              <li>You receive an access file with the link immediately.</li>
              <li>An administrator authorizes your Google Drive access within a few hours at the most.</li>
              <li>Track everything in your{' '}
                <Link href="/account/access" className="text-amber-300 underline">
                  locker
                </Link>
                .
              </li>
            </ul>
          </div>

          {/* Risk-reversal trust strip */}
          <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.04] p-4 text-sm text-zinc-300">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
              <span className="text-emerald-300">✓ Instant digital delivery</span>
              <span className="text-emerald-300">✓ Lifetime access to your archive</span>
              <span className="text-emerald-300">✓ 30-day guarantee</span>
            </div>
            <p className="mt-2 leading-6 text-zinc-400">
              Not the right fit? You have <strong className="text-zinc-200">30 days</strong> to ask for a
              replacement or a full refund — no questions asked. Your archive stays yours.
            </p>
          </div>
        </div>
      </div>

      {/* Full description */}
      {pack.description && (
        <section className="mt-12 max-w-3xl">
          <h2 className="font-serif text-xl text-[#EBE4F2] mb-4">About this archive</h2>
          <DescriptionText text={pack.description} />
        </section>
      )}

      {/* Related journal transmissions (UT → VOA back-loop) */}
      {relatedJournal.length > 0 && (
        <section className="mt-12 max-w-3xl">
          <h2 className="font-serif text-xl text-[#EBE4F2] mb-1">
            Begin with the transmission
          </h2>
          <p className="text-sm text-zinc-400 mb-4">
            This archive grows out of free essays in the Universal Transmissions
            journal. Read the introduction for free, then go deeper here.
          </p>
          <div className="space-y-3">
            {relatedJournal.map((j) => (
              <a
                key={j.slug}
                href={journalUrl(j.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-amber-300/40 hover:bg-white/[0.04]"
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  Journal · {j.tradition}
                </div>
                <div className="mt-1 font-serif text-[#EBE4F2] group-hover:text-amber-200 transition-colors">
                  {j.title}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 border-t border-white/10 pt-6 text-sm text-zinc-500">
        Questions about this pack?{' '}
        <Link href="/contact" className="text-amber-300 underline">
          Contact us
        </Link>
      </div>
    </main>
  )
}
