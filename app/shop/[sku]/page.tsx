import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPack, PACKS, formatUsd } from '@/lib/packs'
import BuyButton from '@/components/shop/BuyButton'
import ImageGallery from '@/components/shop/ImageGallery'
import DescriptionText from '@/components/shop/DescriptionText'

export const dynamicParams = true

export function generateStaticParams() {
  return PACKS.map((p) => ({ sku: p.sku }))
}

export function generateMetadata({ params }: { params: { sku: string } }) {
  const pack = getPack(params.sku)
  if (!pack) return { title: 'Archive pack — Vault of Arcana' }
  return {
    title: `${pack.title} — Vault of Arcana`,
    description: `One-time purchase of "${pack.title}" — delivered as Google Drive access, authorized within a few hours.`,
  }
}

export default function PackPage({ params }: { params: { sku: string } }) {
  const pack = getPack(params.sku)
  if (!pack) notFound()

  const hasImages = pack.images && pack.images.length > 0

  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
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

          <div className="mt-3 flex items-center gap-4">
            <span className="text-amber-200 font-semibold text-3xl">{formatUsd(pack.price)}</span>
            <span className="text-sm text-zinc-400">
              {pack.views > 0 && <span>{pack.views.toLocaleString()} views</span>}
              {pack.favs > 0 && <span> · {pack.favs} favorites</span>}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <BuyButton sku={pack.sku} price={formatUsd(pack.price)} />
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
        </div>
      </div>

      {/* Full description */}
      {pack.description && (
        <section className="mt-12 max-w-3xl">
          <h2 className="font-serif text-xl text-[#EBE4F2] mb-4">About this archive</h2>
          <DescriptionText text={pack.description} />
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
