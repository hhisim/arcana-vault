'use client'

import Link from 'next/link'
import { useSiteI18n } from '@/lib/lang-context'
import { type TraditionEntry } from '@/lib/tradition-config'
import { posts } from '@/lib/posts'
import { books } from '@/lib/books'
import NotifyForm from './NotifyForm'

// ─── Sub-components ───────────────────────────────────────────

function TraditionHero({ entry }: { entry: TraditionEntry }) {
  const { t } = useSiteI18n()
  return (
    <section
      className="relative border-b border-white/5 overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${entry.color}08 0%, transparent 60%)` }}
    >
      {/* Background orb */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: entry.color }}
      />

      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center justify-center gap-3">
          {entry.status === 'live' && (
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-widest text-emerald-400">
              ✦ {t('tradition.status.live')}
            </span>
          )}
          {entry.status === 'coming_soon' && (
            <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs uppercase tracking-widest text-amber-400">
              {t('tradition.status.coming_soon')}
            </span>
          )}
        </div>

        {/* Icon */}
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 border"
          style={{
            backgroundColor: `${entry.color}18`,
            borderColor: `${entry.color}40`,
            boxShadow: `0 0 40px ${entry.color}20`,
          }}
        >
          <span className="text-4xl">{entry.icon}</span>
        </div>

        {/* Title */}
        <h1
          className="font-serif text-5xl md:text-6xl text-[#E8E0F0] mb-4"
          style={{ textShadow: `0 0 40px ${entry.color}40` }}
        >
          {entry.name}
        </h1>

        {/* Subtitle */}
        <p className="text-xl italic text-[#9B93AB] mb-8">{entry.subtitle}</p>

        {/* Description */}
        <p className="mx-auto max-w-2xl text-base leading-8 text-[#B8B0CC] mb-10">
          {entry.description}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {entry.status === 'live' && (
            <Link
              href={entry.oracleLink}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-bold uppercase tracking-wider text-[#0A0A10] transition-all duration-200 hover:shadow-[0_0_24px_rgba(0,0,0,0.3)]"
              style={{ backgroundColor: entry.color }}
            >
              {t('tradition.cta.enter', { name: entry.name })}
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          )}
          <Link
            href="/traditions"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md border border-white/20 text-sm text-[#E8E0F0] hover:bg-white/5 transition-colors"
          >
            ← {t('tradition.cta.all')}
          </Link>
        </div>
      </div>
    </section>
  )
}

function ArchiveSection({ entry }: { entry: TraditionEntry }) {
  const { t } = useSiteI18n()
  if (entry.primaryTexts.length === 0 && entry.commentaryAndSources.length === 0) return null

  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#C9A84C]">{t('tradition.archive.label')}</p>
          <h2 className="font-serif text-3xl text-[#E8E0F0]">{t('tradition.archive.title')}</h2>
        </div>

        {/* Primary texts grid */}
        {entry.primaryTexts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {entry.primaryTexts.map((text, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/8 bg-white/[0.02] p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">📖</span>
                  <div>
                    <p className="font-serif text-base text-[#E8E0F0] leading-snug">{text.title}</p>
                    <p className="text-xs text-[#C9A84C] mt-0.5">{text.author}</p>
                    <p className="text-sm text-[#9B93AB] mt-2 leading-6">{text.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Commentary sources */}
        {entry.commentaryAndSources.length > 0 && (
          <div className="mt-8">
            <p className="mb-4 text-xs uppercase tracking-widest text-[#9B93AB]">{t('tradition.archive.commentary')}</p>
            <div className="flex flex-wrap gap-2">
              {entry.commentaryAndSources.map((source, i) => (
                <span
                  key={i}
                  className="rounded-full border border-white/8 bg-white/[0.02] px-3 py-1 text-xs text-[#9B93AB]"
                >
                  {source}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Domains */}
        {entry.domains.length > 0 && (
          <div className="mt-8">
            <p className="mb-4 text-xs uppercase tracking-widest text-[#9B93AB]">{t('tradition.archive.domains')}</p>
            <div className="flex flex-wrap gap-2">
              {entry.domains.map((domain, i) => (
                <span
                  key={i}
                  className="rounded-full border border-white/8 bg-white/[0.02] px-3 py-1 text-xs text-[#9B93AB]"
                >
                  {domain}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function ModesSection({ entry }: { entry: TraditionEntry }) {
  const { t } = useSiteI18n()
  if (entry.keyModes.length === 0) return null

  const modeDetails: Record<string, { description: string; example: string }> = {
    Oracle: { description: t('tradition.mode.oracle.desc'), example: t('tradition.mode.oracle.example', { name: entry.name.split(' ')[0], domain: entry.domains[0] || 'my current situation' }) },
    'I Ching Consultation': { description: t('tradition.mode.i_ching.desc'), example: t('tradition.mode.i_ching.example') },
    'Wu Wei Guidance': { description: t('tradition.mode.wu_wei.desc'), example: t('tradition.mode.wu_wei.example') },
    'Deep Study': { description: t('tradition.mode.deep_study.desc'), example: t('tradition.mode.deep_study.example') },
    'Daily Wisdom': { description: t('tradition.mode.daily_wisdom.desc'), example: t('tradition.mode.daily_wisdom.example') },
    Reading: { description: t('tradition.mode.reading.desc'), example: t('tradition.mode.reading.example') },
    Shadow: { description: t('tradition.mode.shadow.desc'), example: t('tradition.mode.shadow.example') },
    Pathwork: { description: t('tradition.mode.pathwork.desc'), example: t('tradition.mode.pathwork.example') },
    Teacher: { description: t('tradition.mode.teacher.desc'), example: t('tradition.mode.teacher.example') },
    Historian: { description: t('tradition.mode.historian.desc'), example: t('tradition.mode.historian.example') },
    'Deck Compare': { description: t('tradition.mode.deck_compare.desc'), example: t('tradition.mode.deck_compare.example') },
    Qabalah: { description: t('tradition.mode.qabalah.desc'), example: t('tradition.mode.qabalah.example') },
    Astrology: { description: t('tradition.mode.astrology.desc'), example: t('tradition.mode.astrology.example') },
    Numerology: { description: t('tradition.mode.numerology.desc'), example: t('tradition.mode.numerology.example') },
    Seeker: { description: t('tradition.mode.seeker.desc'), example: t('tradition.mode.seeker.desc') },
    'Daily Meditation': { description: t('tradition.mode.daily_meditation.desc'), example: t('tradition.mode.daily_meditation.example') },
    'Practice Support': { description: t('tradition.mode.practice_support.desc'), example: t('tradition.mode.practice_support.example') },
    Integration: { description: t('tradition.mode.integration.desc'), example: t('tradition.mode.integration.example') },
    Cartography: { description: t('tradition.mode.cartography.desc'), example: t('tradition.mode.cartography.example') },
    'Dream Interpretation': { description: t('tradition.mode.dream_interpretation.desc'), example: t('tradition.mode.dream_interpretation.example') },
    'Practice Guidance': { description: t('tradition.mode.practice_guidance.desc'), example: t('tradition.mode.practice_guidance.example') },
    'Daily Reflection': { description: t('tradition.mode.daily_reflection.desc'), example: t('tradition.mode.daily_reflection.example') },
    Poetry: { description: t('tradition.mode.poetry.desc'), example: t('tradition.mode.poetry.example') },
    'Sigil Workshop': { description: t('tradition.mode.sigil_workshop.desc'), example: t('tradition.mode.sigil_workshop.example') },
    'Paradigm Analysis': { description: t('tradition.mode.paradigm_analysis.desc'), example: t('tradition.mode.paradigm_analysis.example') },
    'Tree of Life Navigation': { description: t('tradition.mode.tree_of_life.desc'), example: t('tradition.mode.tree_of_life.example') },
    Gematria: { description: t('tradition.mode.gematria.desc'), example: t('tradition.mode.gematria.example') },
  }

  const modesToShow = entry.keyModes.slice(0, 5)

  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#C9A84C]">{t('tradition.modes.label')}</p>
          <h2 className="font-serif text-3xl text-[#E8E0F0]">{t('tradition.modes.title')}</h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {modesToShow.map((mode) => {
            const detail = modeDetails[mode]
            return (
              <div
                key={mode}
                className="rounded-xl border border-white/8 bg-white/[0.02] p-5"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                    style={{ backgroundColor: entry.color }}
                  />
                  <div>
                    <p className="font-serif text-base text-[#E8E0F0] mb-1">{mode}</p>
                    {detail && (
                      <>
                        <p className="text-sm text-[#9B93AB] leading-6">{detail.description}</p>
                        <p className="mt-2 text-xs italic text-[#7B5EA7] font-mono">
                          {detail.example}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function SampleExchange({ entry }: { entry: TraditionEntry }) {
  const { t } = useSiteI18n()
  if (!entry.sampleExchange) return null

  const { user, oracle, tags } = entry.sampleExchange
  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#C9A84C]">{t('tradition.sample.glimpse')}</p>
          <h2 className="font-serif text-3xl text-[#E8E0F0]">{t('tradition.sample.title')}</h2>
        </div>

        <div className="rounded-2xl border border-white/8 bg-[#08080f] overflow-hidden">
          {/* User */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-start gap-3">
              <span
                className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: `${entry.color}30`, color: entry.color }}
              >
                Y
              </span>
              <p className="text-[#B8B0CC] leading-7">{user}</p>
            </div>
          </div>

          {/* Oracle */}
          <div className="p-6" style={{ backgroundColor: `${entry.color}06` }}>
            <div className="flex items-start gap-3">
              <span
                className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: `${entry.color}25`, color: entry.color }}
              >
                ✦
              </span>
              <div>
                <p className="text-sm font-serif text-[#C9A84C] mb-3">{entry.name}</p>
                {oracle.split('\n\n').map((para, i) => (
                  <p key={i} className="text-[#B8B0CC] leading-7 mb-4 last:mb-0">
                    {para}
                  </p>
                ))}

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-0.5 text-xs text-[#9B93AB]"
                      >
                        ◈ {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-[#9B93AB]/60 italic">
          {t('tradition.sample.disclaimer')}
        </p>

        {entry.status === 'live' && (
          <div className="mt-6 text-center">
            <Link
              href={entry.oracleLink}
              className="inline-flex items-center gap-2 text-sm text-[#C9A84C] hover:text-[#E8D590] transition-colors font-medium"
            >
              {t('tradition.sample.try')} →
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

function CorrespondencesSection({ entry }: { entry: TraditionEntry }) {
  const { t } = useSiteI18n()
  if (entry.relatedCorrespondences.length === 0) return null

  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#C9A84C]">{t('tradition.correspondences.crosslinked')}</p>
          <h2 className="font-serif text-3xl text-[#E8E0F0]">{t('tradition.correspondences.title')}</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {entry.relatedCorrespondences.map((slug) => (
            <Link
              key={slug}
              href={`/correspondence-engine?node=${slug}`}
              className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-4 py-2 text-sm text-[#9B93AB] hover:border-white/15 hover:text-[#E8E0F0] hover:bg-white/[0.04] transition-all duration-200"
            >
              <span>◈</span>
              <span className="capitalize">{slug.replace(/-/g, ' ')}</span>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/correspondence-engine"
            className="text-xs text-[#9B93AB] hover:text-[#C9A84C] transition-colors"
          >
            {t('tradition.correspondences.explore')} →
          </Link>
        </div>
      </div>
    </section>
  )
}

function ScrollsSection({ entry }: { entry: TraditionEntry }) {
  const { t } = useSiteI18n()
  const relatedPosts = posts.filter((p) => entry.relatedScrollSlugs.includes(p.slug))
  if (relatedPosts.length === 0) return null

  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#C9A84C]">{t('tradition.scrolls.from_scroll')}</p>
          <h2 className="font-serif text-3xl text-[#E8E0F0]">{t('tradition.scrolls.title')}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {relatedPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-white/12 transition-all duration-200"
            >
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <div>
                <p className="text-sm font-medium text-[#E8E0F0] group-hover:text-[#C9A84C] transition-colors leading-snug">
                  {post.title}
                </p>
                <p className="mt-1 text-xs text-[#9B93AB]">{post.tradition}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/scroll"
            className="text-xs text-[#9B93AB] hover:text-[#C9A84C] transition-colors"
          >
            {t('tradition.scrolls.browse')} →
          </Link>
        </div>
      </div>
    </section>
  )
}

function LibrarySection({ entry }: { entry: TraditionEntry }) {
  const { t } = useSiteI18n()
  const relatedBooks = books.filter((b) => entry.relatedLibrarySlugs.includes(b.id))
  if (relatedBooks.length === 0) return null

  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#C9A84C]">{t('tradition.library.archive_label')}</p>
          <h2 className="font-serif text-3xl text-[#E8E0F0]">{t('tradition.library.title')}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {relatedBooks.map((book) => (
            <div
              key={book.id}
              className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-5"
            >
              <span className="text-xl mt-0.5">📖</span>
              <div>
                <p className="text-sm font-serif text-[#E8E0F0] leading-snug">{book.title}</p>
                <p className="text-xs text-[#C9A84C] mt-0.5">{book.author}</p>
                <p className="mt-2 text-xs text-[#9B93AB] leading-5">{book.description}</p>
                {book.free ? (
                  <span className="mt-2 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-emerald-400">
                    {t('tradition.library.free')}
                  </span>
                ) : (
                  <span className="mt-2 inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-400">
                    {t('tradition.library.adept_plus')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/library"
            className="text-xs text-[#9B93AB] hover:text-[#C9A84C] transition-colors"
          >
            {t('tradition.library.browse')} →
          </Link>
        </div>
      </div>
    </section>
  )
}

function VoiceSection({ entry }: { entry: TraditionEntry }) {
  const { t } = useSiteI18n()
  if (!entry.voiceDescription || entry.status !== 'live') return null

  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#C9A84C]">{t('tradition.voice.label')}</p>
          <h2 className="font-serif text-3xl text-[#E8E0F0]">{t('tradition.voice.title')}</h2>
        </div>

        <div
          className="rounded-2xl border p-8 text-center"
          style={{ borderColor: `${entry.color}30`, backgroundColor: `${entry.color}08` }}
        >
          <p className="font-serif text-xl italic leading-9 text-[#E8E0F0]">
            &ldquo;{entry.voiceDescription}&rdquo;
          </p>
        </div>
      </div>
    </section>
  )
}

function ComingSoonSection({ entry }: { entry: TraditionEntry }) {
  const { t } = useSiteI18n()
  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 border"
          style={{ backgroundColor: `${entry.color}15`, borderColor: `${entry.color}35` }}
        >
          <span className="text-3xl">{entry.icon}</span>
        </div>

        <h2 className="font-serif text-3xl text-[#E8E0F0] mb-4">{t('tradition.coming.title')}</h2>
        <p className="mx-auto max-w-xl text-[#9B93AB] leading-8 mb-10">
          {t('tradition.coming.body')}
        </p>

        {/* Notify form */}
        <NotifyForm traditionName={entry.name} color={entry.color} />

        {/* Related scrolls for upcoming */}
        <div className="mt-12">
          <p className="mb-4 text-xs uppercase tracking-widest text-[#9B93AB]">
            {t('tradition.coming.meanwhile')}
          </p>
          <ScrollsSection entry={entry} />
        </div>
      </div>
    </section>
  )
}

// ─── Main Page ───────────────────────────────────────────────

export default function TraditionDetailContent({ tradition: entry }: { tradition: TraditionEntry }) {
  const { t } = useSiteI18n()

  return (
    <main className="min-h-screen bg-[#0a0a10]">
      <TraditionHero entry={entry} />

      {entry.status === 'live' ? (
        <>
          <VoiceSection entry={entry} />
          <ArchiveSection entry={entry} />
          <ModesSection entry={entry} />
          <SampleExchange entry={entry} />
          <CorrespondencesSection entry={entry} />
          <ScrollsSection entry={entry} />
          <LibrarySection entry={entry} />

          {/* Final CTA */}
          <section className="py-20 text-center">
            <div className="mx-auto max-w-2xl px-6">
              <h2 className="font-serif text-4xl text-[#E8E0F0] mb-4">
                {t('tradition.final.title').replace('{name}', entry.name)}
              </h2>
              <p className="text-[#9B93AB] mb-8 leading-7">
                {t('tradition.final.body').replace('{source}', entry.primaryTexts[0]?.title || t('tradition.final.default_source'))}
              </p>
              <Link
                href={entry.oracleLink}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-base font-bold uppercase tracking-wider text-[#0A0A10] transition-all duration-200 hover:shadow-[0_0_24px_rgba(0,0,0,0.3)]"
                style={{ backgroundColor: entry.color }}
              >
                {t('tradition.final.cta')} →
              </Link>
              <p className="mt-4 text-xs text-[#9B93AB]/60">
                {t('tradition.final.plan_note')}
              </p>
            </div>
          </section>
        </>
      ) : (
        <ComingSoonSection entry={entry} />
      )}
    </main>
  )
}
