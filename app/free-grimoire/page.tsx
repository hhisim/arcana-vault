import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { FreeGuideForm } from '@/components/FreeGuideForm'

function FormFallback() {
  return (
    <section className="mx-auto mt-16 max-w-3xl border border-[#2a2733] bg-[#111019] p-8 md:mt-20">
      <div className="h-7 w-48 bg-[#2a2733]" />
      <div className="mt-6 h-12 w-full bg-[#0a0a10]" />
      <div className="mt-3 h-12 w-40 bg-[#C9A84C]/30" />
    </section>
  )
}

export const metadata: Metadata = {
  title: 'Free Tradition Study Guides — Tarot, Kabbalah, Alchemy & More',
  description:
    'Seven free study guides compiled from the Vault of Arcana archive of original essays. Tarot, Kabbalah, Hermeticism, Alchemy, Sacred Geometry, Taoism and Sufism. No paywall on the content, no discount upsell — just the guide.',
  alternates: { canonical: '/free-grimoire' },
  openGraph: {
    title: 'Free Tradition Study Guides | Vault of Arcana',
    description:
      'Seven study guides compiled from 120,000+ words of original writing. Free, printable, citable.',
    url: '/free-grimoire',
    type: 'website',
  },
}

const GUIDES = [
  {
    slug: 'hermeticism',
    title: 'Hermeticism',
    tag: 'The Kybalion, the Corpus Hermeticum, and the Victorian compilation that is not the same thing',
    size: '17 essays · 35,600 words',
  },
  {
    slug: 'alchemy',
    title: 'Alchemy',
    tag: 'Operation, vessel, and the work that repeats — nigredo through rubedo',
    size: '9 essays · 22,200 words',
  },
  {
    slug: 'sacred-geometry',
    title: 'Sacred Geometry',
    tag: 'Metatron\'s Cube, the Flower of Life, and where the mathematics carries weight',
    size: '5 essays · 16,400 words',
  },
  {
    slug: 'kabbalah',
    title: 'Kabbalah',
    tag: 'The Tree from sefirot to the Four Worlds, and where tradition diverges from the popular version',
    size: '5 essays · 15,800 words',
  },
  {
    slug: 'taoism',
    title: 'Taoism',
    tag: 'Tao Te Ching, the I Ching and Neidan, with the philosophical and esoteric lines kept apart',
    size: '11 essays · 14,000 words',
  },
  {
    slug: 'sufism',
    title: 'Sufism',
    tag: 'The stations, the maqamat, and the attested sources versus the romantic accounts',
    size: '5 essays · 11,400 words',
  },
  {
    slug: 'tarot',
    title: 'Tarot',
    tag: 'The structure of the deck before the interpretation of a single card',
    size: '2 essays · 5,000 words',
  },
]

export default function FreeGrimoirePage() {
  return (
    <main className="min-h-screen bg-[#0a0a10] text-[#E8E0F0] font-serif">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <header className="max-w-3xl">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-[#C9A84C]">
            Free · No paywall on the content
          </p>
          <h1 className="mt-4 text-4xl leading-tight md:text-5xl">
            Seven study guides, compiled from our own archive.
          </h1>
          <p className="mt-6 text-lg text-[#9B93AB] leading-relaxed">
            These are not summaries. Each guide is assembled from the Vault of Arcana&apos;s own essays —
            every entry links to the full original, with word counts and verbatim excerpts so you can
            judge the material before you read it. Print them, cite them, share them.
          </p>
          <p className="mt-4 text-[#9B93AB] leading-relaxed">
            We ask for your email to send the guide and to tell you when a new one is compiled. That is
            the entire arrangement. There is no discount sequence afterwards and no upsell on the page
            you land on after downloading.
          </p>
        </header>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/free-grimoire?tradition=${g.slug}`}
              className="group block border border-[#2a2733] bg-[#111019] p-6 transition-colors hover:border-[#C9A84C]"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-2xl text-[#E8E0F0] group-hover:text-[#C9A84C]">
                  {g.title}
                </h2>
                <span className="font-sans text-xs text-[#9B93AB] whitespace-nowrap">{g.size}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#9B93AB]">{g.tag}</p>
              <span className="mt-4 inline-block font-sans text-xs uppercase tracking-[0.2em] text-[#C9A84C]">
                Unlock →
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-16 border-t border-[#2a2733] pt-10">
          <h2 className="text-2xl">Why an email, honestly</h2>
          <p className="mt-4 max-w-2xl text-[#9B93AB] leading-relaxed">
            Because we would rather have a way to tell you when a new guide or a new essay is ready
            than have you check a page and find nothing. That is the whole reason. The guide is not
            held hostage — you get the complete document.
          </p>
          <p className="mt-4 max-w-2xl text-[#9B93AB] leading-relaxed">
            If you would rather just read without an email, every essay in the archive is open at{' '}
            <Link href="/blog" className="text-[#C9A84C] underline">
              /blog
            </Link>{' '}
            and the{' '}
            <Link href="/correspondence-engine/classic" className="text-[#C9A84C] underline">
              Correspondence Engine
            </Link>{' '}
            is free to use.
          </p>
        </section>

        {/* useSearchParams needs a Suspense boundary to allow static prerender. */}
        <Suspense fallback={<FormFallback />}>
          <FreeGuideForm />
        </Suspense>
      </div>
    </main>
  )
}
