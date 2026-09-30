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
  // Buyer questions. Answers stay grounded in policies the page already states
  // (Stripe checkout, immediate access file, admin authorisation of Google Drive
  // access within a few hours, lifetime access, contact page). No invented
  // refund or licensing promises.
  const faqs = [
    {
      q: `What exactly is in the ${pack.title} archive?`,
      a: pack.description
        ? pack.description.replace(/\s+/g, ' ').slice(0, 320).trim() + (pack.description.length > 320 ? '\u2026' : '')
        : 'A curated digital archive of esoteric source texts, delivered as a downloadable collection. See the full description above for the contents.',
    },
    {
      q: 'How is this delivered after I pay?',
      a: 'Your payment is processed securely by Stripe. You receive an access file with the link immediately, and an administrator authorises your Google Drive access within a few hours at the most. You can track everything from your locker at any time.',
    },
    {
      q: 'Do I keep access permanently?',
      a: 'Yes \u2014 every archive is a one-time purchase with lifetime access. There is no subscription, no renewal, and nothing to cancel.',
    },
    {
      q: 'What format are the files in?',
      a: 'The archive is delivered as digital files through Google Drive, optimised for reading on desktop and mobile. Individual items are predominantly PDFs.',
    },
    {
      q: 'Is this a physical product that ships to me?',
      a: 'No. This is a digital archive. Nothing is posted and there is no delivery address needed \u2014 you receive access electronically.',
    },
    {
      q: 'What if something is wrong with my purchase?',
      a: 'Get in touch through the contact page and we will sort it out. If an administrator cannot authorise your access, you are not left paying for something unusable.',
    },
    {
      q: 'Can I try the Vault before buying?',
      a: 'Yes. Free accounts get 12 questions per day and full access to the Correspondence Codex, and the Oracle demo on the homepage needs no signup at all.',
    },
  ]
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
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

          {/* Free-with-signup alternative: the Tao Oracle Pack on the Tao pack only. */}
          {pack.sku === 'etsy-4471894787' && (
            <div className="mt-4 rounded-xl border border-amber-400/25 bg-amber-400/[0.04] p-4 text-sm">
              <h2 className="font-serif text-amber-200">Not ready to buy?</h2>
              <p className="mt-2 leading-6 text-zinc-300">
                Create a free account and this pack is yours to claim — the 3GB Taoist
                archive plus 30 days of Seeker access. No card, no purchase.
              </p>
              <Link
                href="/redeem/tao"
                className="mt-3 inline-block rounded-full bg-amber-300 px-5 py-2 font-medium text-black transition-colors hover:bg-amber-200"
              >
                Claim the free pack
              </Link>
            </div>
          )}

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
            </div>
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

      {/* Buyer FAQ — also emitted as FAQPage structured data above */}
      <section className="mt-14 max-w-3xl">
        <h2 className="font-serif text-xl text-[#EBE4F2] mb-1">Questions before you buy</h2>
        <p className="text-sm text-zinc-400 mb-5">
          Delivery, format and access — answered plainly.
        </p>
        <div className="space-y-2">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 open:border-amber-300/30"
            >
              <summary className="cursor-pointer list-none text-[15px] font-medium text-[#EBE4F2] marker:hidden">
                <span className="flex items-start justify-between gap-4">
                  <span>{f.q}</span>
                  <span
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-amber-300 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-zinc-300">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-12 border-t border-white/10 pt-6 text-sm text-zinc-500">
        Questions about this pack?{' '}
        <Link href="/contact" className="text-amber-300 underline">
          Contact us
        </Link>
      </div>
    </main>
  )
}
