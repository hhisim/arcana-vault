import { notFound } from 'next/navigation'
import Link from 'next/link'
import { traditions, liveTraditions, upcomingTraditions, horizonTraditions, type TraditionEntry } from '@/lib/tradition-config'
import { posts } from '@/lib/posts'
import { books } from '@/lib/books'
import NotifyForm from './NotifyForm'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return [...liveTraditions, ...upcomingTraditions, ...horizonTraditions].map((t) => ({
    slug: t.slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const tradition = traditions[slug]
  if (!tradition) return { title: 'Tradition Not Found' }
  return {
    title: `${tradition.name} — Vault of Arcana`,
    description: tradition.description,
  }
}

// ─── Sub-components ───────────────────────────────────────────

function TraditionHero({ t }: { t: TraditionEntry }) {
  return (
    <section
      className="relative border-b border-white/5 overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${t.color}08 0%, transparent 60%)` }}
    >
      {/* Background orb */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: t.color }}
      />

      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        {/* Eyebrow */}
        <div className="mb-6 flex items-center justify-center gap-3">
          {t.status === 'live' && (
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-widest text-emerald-400">
              ✦ Live Gateway
            </span>
          )}
          {t.status === 'coming_soon' && (
            <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs uppercase tracking-widest text-amber-400">
              Activating Soon
            </span>
          )}
        </div>

        {/* Icon */}
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 border"
          style={{
            backgroundColor: `${t.color}18`,
            borderColor: `${t.color}40`,
            boxShadow: `0 0 40px ${t.color}20`,
          }}
        >
          <span className="text-4xl">{t.icon}</span>
        </div>

        {/* Title */}
        <h1
          className="font-serif text-5xl md:text-6xl text-[#E8E0F0] mb-4"
          style={{ textShadow: `0 0 40px ${t.color}40` }}
        >
          {t.name}
        </h1>

        {/* Subtitle */}
        <p className="text-xl italic text-[#9B93AB] mb-8">{t.subtitle}</p>

        {/* Description */}
        <p className="mx-auto max-w-2xl text-base leading-8 text-[#B8B0CC] mb-10">
          {t.description}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {t.status === 'live' && (
            <Link
              href={t.oracleLink}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-bold uppercase tracking-wider text-[#0A0A10] transition-all duration-200 hover:shadow-[0_0_24px_rgba(0,0,0,0.3)]"
              style={{ backgroundColor: t.color }}
            >
              Enter the {t.name}
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          )}
          <Link
            href="/traditions"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md border border-white/20 text-sm text-[#E8E0F0] hover:bg-white/5 transition-colors"
          >
            ← All Traditions
          </Link>
        </div>
      </div>
    </section>
  )
}

function ArchiveSection({ t }: { t: TraditionEntry }) {
  if (t.primaryTexts.length === 0 && t.commentaryAndSources.length === 0) return null

  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#C9A84C]">The Archive</p>
          <h2 className="font-serif text-3xl text-[#E8E0F0]">What This Oracle Knows</h2>
        </div>

        {/* Primary texts grid */}
        {t.primaryTexts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {t.primaryTexts.map((text, i) => (
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
        {t.commentaryAndSources.length > 0 && (
          <div className="mt-8">
            <p className="mb-4 text-xs uppercase tracking-widest text-[#9B93AB]">Commentary &amp; Sources</p>
            <div className="flex flex-wrap gap-2">
              {t.commentaryAndSources.map((source, i) => (
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
        {t.domains.length > 0 && (
          <div className="mt-8">
            <p className="mb-4 text-xs uppercase tracking-widest text-[#9B93AB]">Practice Domains</p>
            <div className="flex flex-wrap gap-2">
              {t.domains.map((domain, i) => (
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

function ModesSection({ t }: { t: TraditionEntry }) {
  if (t.keyModes.length === 0) return null

  const modeDetails: Record<string, { description: string; example: string }> = {
    Oracle: { description: 'Open dialogue. Ask anything about the tradition, its teachings, or your situation.', example: `"What would ${t.name.split(' ')[0]} say about ${t.domains[0] || 'my current situation'}?"` },
    'I Ching Consultation': { description: 'Cast a hexagram. Receive an interpretation grounded in the classical text and the commentary tradition.', example: '"Cast a hexagram about my decision to leave my current path."' },
    'Wu Wei Guidance': { description: 'Bring a decision or situation. Let non-action speak.', example: '"I am paralyzed between two choices. Guide me through the lens of Wu Wei."' },
    'Deep Study': { description: 'Explore any concept, text, or teaching in depth. The Oracle cites specific passages and commentaries.', example: '"Walk me through a key concept from this tradition and its practical application."' },
    'Daily Wisdom': { description: 'A daily contemplation drawn from the tradition, attuned to the current season and lunar cycle.', example: '"Give me today\'s contemplation."' },
    Reading: { description: 'A full tarot reading — Celtic Cross or three-card spread — interpreted through the lens of the tradition.', example: '"Give me a three-card spread: past, present, and guidance."' },
    Shadow: { description: 'Bring a card, a symbol, or a recurring pattern. We go into the shadow work.', example: '"I keep pulling the Five of Swords. What is this card really asking of me?"' },
    Pathwork: { description: 'Journey the Major Arcana as a map of inner transformation, one card at a time.', example: '"Walk me through The Tower. I am going through a dissolution."' },
    Teacher: { description: 'Comprehensive explanations of any concept, archetype, or practice within the tradition.', example: '"Explain the nature of the Fool\'s journey as a map of initiation."' },
    Historian: { description: 'The tradition\'s own history — texts, figures, lineages, schisms, and development.', example: '"What is the history of the relationship between the Golden Dawn and the Thoth tradition?"' },
    'Deck Compare': { description: 'Compare any two decks\' rendering of the same card or symbol.', example: '"Compare the Rider-Waite and Thoth versions of the Ace of Wands."' },
    Qabalah: { description: 'Navigate the Tree of Life — paths, sephiroth, gematria, and the symbolic architecture.', example: '"Walk me through the path of Gimel — what does the High Priestess represent on the Tree?"' },
    Astrology: { description: 'Integrate astrological symbolism — signs, houses, aspects — into tarot interpretation.', example: '"How does my Sun in Scorpio in the 8th house interact with this card?"' },
    Numerology: { description: 'The numeric structure of the tarot — number meanings, digit analysis, and sequence logic.', example: '"What is the numerological significance of the seven planets in the heptagram?"' },
    Seeker: { description: 'A guided conversation through a key concept, question, or practice area.', example: '"Help me understand the relationship between shakti and shiva in the Kashmir Shaivism tradition."' },
    'Daily Meditation': { description: 'A guided meditation drawn from the tradition\'s practice lineage.', example: '"Give me today\'s meditation from the Tantra Oracle."' },
    'Practice Support': { description: 'Practical guidance for integrating the tradition into daily life and practice.', example: '"I want to begin a daily kundalini practice. Where do I start?"' },
    Integration: { description: 'Process an entheogenic experience with depth — meaning-making, symbolism, and life integration.', example: '"I had an experience last week I cannot stop thinking about. Can you help me understand what happened?"' },
    Cartography: { description: 'Map the inner landscape of an altered state — geometry, entities, and territory.', example: '"I encountered what I can only describe as a living geometric structure. Help me map what I experienced."' },
    'Dream Interpretation': { description: 'Bring a dream, recurring symbol, or sleep pattern for deep analysis.', example: '"I keep dreaming of the same place. Each time I go deeper. What is this?"' },
    'Practice Guidance': { description: 'Specific techniques for lucid dreaming, astral projection, or dream yoga practice.', example: '"I want to lucid dream tonight. Give me a specific induction protocol."' },
    'Deep Study': { description: 'Explore any concept, text, or practice in depth from the tradition.', example: '"What does the Tibetan Buddhist tradition say about the nature of the dream body?"' },
    'Daily Reflection': { description: 'A daily contemplation from the Sufi tradition, keyed to the current spiritual station.', example: '"Give me today\'s reflection from Rumi."' },
    Poetry: { description: 'Sufi poetry as a mode of spiritual inquiry and direct knowing.', example: '"Read me a ghazal and tell me what it is really about."' },
    'Sigil Workshop': { description: 'Design, charge, and release a sigil with precision and intentionality.', example: '"Help me construct a sigil for [desire]. I want to do this properly."' },
    'Paradigm Analysis': { description: 'Examine a belief system, ideology, or worldview using chaos magick methodology.', example: '"Apply chaos magick methodology to analyze [belief system]."' },
    'Tree of Life Navigation': { description: 'Navigate the ten Sephiroth, the twenty-two paths, and their correspondences.', example: '"Walk me through the path between Chesed and Gevurah — what transformation does it represent?"' },
    Gematria: { description: 'Letter-number analysis using the Hebrew tradition and Hermetic correspondences.', example: '"What is the gematria of [word/phrase] and what does it reveal?"' },
    Pathwork: { description: 'Walk one of the twenty-two paths of the Tree of Life as a journey of consciousness.', example: '"Guide me through the 21st path — what am I meant to understand?"' },
  }

  const modesToShow = t.keyModes.slice(0, 5)

  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Capabilities</p>
          <h2 className="font-serif text-3xl text-[#E8E0F0]">What You Can Do</h2>
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
                    style={{ backgroundColor: t.color }}
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

function SampleExchange({ t }: { t: TraditionEntry }) {
  if (!t.sampleExchange) return null

  const { user, oracle, tags } = t.sampleExchange
  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#C9A84C]">A Glimpse of the Oracle</p>
          <h2 className="font-serif text-3xl text-[#E8E0F0]">A Real Exchange</h2>
        </div>

        <div className="rounded-2xl border border-white/8 bg-[#08080f] overflow-hidden">
          {/* User */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-start gap-3">
              <span
                className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: `${t.color}30`, color: t.color }}
              >
                Y
              </span>
              <p className="text-[#B8B0CC] leading-7">{user}</p>
            </div>
          </div>

          {/* Oracle */}
          <div className="p-6" style={{ backgroundColor: `${t.color}06` }}>
            <div className="flex items-start gap-3">
              <span
                className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: `${t.color}25`, color: t.color }}
              >
                ✦
              </span>
              <div>
                <p className="text-sm font-serif text-[#C9A84C] mb-3">{t.name}</p>
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
          This is a real exchange, not a simulation.
        </p>

        {t.status === 'live' && (
          <div className="mt-6 text-center">
            <Link
              href={t.oracleLink}
              className="inline-flex items-center gap-2 text-sm text-[#C9A84C] hover:text-[#E8D590] transition-colors font-medium"
            >
              Try it yourself →
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

function CorrespondencesSection({ t }: { t: TraditionEntry }) {
  if (t.relatedCorrespondences.length === 0) return null

  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Cross-Linked</p>
          <h2 className="font-serif text-3xl text-[#E8E0F0]">In the Correspondence Codex</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {t.relatedCorrespondences.map((slug) => (
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
            Explore the full Correspondence Codex →
          </Link>
        </div>
      </div>
    </section>
  )
}

function ScrollsSection({ t }: { t: TraditionEntry }) {
  const relatedPosts = posts.filter((p) => t.relatedScrollSlugs.includes(p.slug))
  if (relatedPosts.length === 0) return null

  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#C9A84C]">From the Scroll</p>
          <h2 className="font-serif text-3xl text-[#E8E0F0]">Essays in This Tradition</h2>
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
                style={{ backgroundColor: t.color }}
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
            Browse all Scrolls →
          </Link>
        </div>
      </div>
    </section>
  )
}

function LibrarySection({ t }: { t: TraditionEntry }) {
  const relatedBooks = books.filter((b) => t.relatedLibrarySlugs.includes(b.id))
  if (relatedBooks.length === 0) return null

  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Texts in the Archive</p>
          <h2 className="font-serif text-3xl text-[#E8E0F0]">From the Library</h2>
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
                    Free
                  </span>
                ) : (
                  <span className="mt-2 inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-400">
                    Adept+
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
            Browse the full Library →
          </Link>
        </div>
      </div>
    </section>
  )
}

function VoiceSection({ t }: { t: TraditionEntry }) {
  if (!t.voiceDescription || t.status !== 'live') return null

  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-[#C9A84C]">The Voice</p>
          <h2 className="font-serif text-3xl text-[#E8E0F0]">How the Oracle Speaks</h2>
        </div>

        <div
          className="rounded-2xl border p-8 text-center"
          style={{ borderColor: `${t.color}30`, backgroundColor: `${t.color}08` }}
        >
          <p className="font-serif text-xl italic leading-9 text-[#E8E0F0]">
            &ldquo;{t.voiceDescription}&rdquo;
          </p>
        </div>
      </div>
    </section>
  )
}

function ComingSoonSection({ t }: { t: TraditionEntry }) {
  return (
    <section className="border-b border-white/5">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 border"
          style={{ backgroundColor: `${t.color}15`, borderColor: `${t.color}35` }}
        >
          <span className="text-3xl">{t.icon}</span>
        </div>

        <h2 className="font-serif text-3xl text-[#E8E0F0] mb-4">This gate is being prepared.</h2>
        <p className="mx-auto max-w-xl text-[#9B93AB] leading-8 mb-10">
          The archive is being curated, the voice is being shaped, and the Oracle is being trained.
          When ready, this tradition will open as a living gateway.
        </p>

        {/* Notify form */}
        <NotifyForm traditionName={t.name} color={t.color} />

        {/* Related scrolls for upcoming */}
        <div className="mt-12">
          <p className="mb-4 text-xs uppercase tracking-widest text-[#9B93AB]">
            Meanwhile, explore related scrolls:
          </p>
          <ScrollsSection t={t} />
        </div>
      </div>
    </section>
  )
}

// ─── Main Page ────────────────────────────────────────────────

export default async function TraditionPage({ params }: Props) {
  const { slug } = await params
  const tradition = traditions[slug]

  if (!tradition) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#0a0a10]">
      <TraditionHero t={tradition} />

      {tradition.status === 'live' ? (
        <>
          <VoiceSection t={tradition} />
          <ArchiveSection t={tradition} />
          <ModesSection t={tradition} />
          <SampleExchange t={tradition} />
          <CorrespondencesSection t={tradition} />
          <ScrollsSection t={tradition} />
          <LibrarySection t={tradition} />

          {/* Final CTA */}
          <section className="py-20 text-center">
            <div className="mx-auto max-w-2xl px-6">
              <h2 className="font-serif text-4xl text-[#E8E0F0] mb-4">
                Enter the {tradition.name}
              </h2>
              <p className="text-[#9B93AB] mb-8 leading-7">
                A living intelligence shaped by {tradition.primaryTexts[0]?.title || 'curated archives'}.
              </p>
              <Link
                href={tradition.oracleLink}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-base font-bold uppercase tracking-wider text-[#0A0A10] transition-all duration-200 hover:shadow-[0_0_24px_rgba(0,0,0,0.3)]"
                style={{ backgroundColor: tradition.color }}
              >
                Begin the conversation →
              </Link>
              <p className="mt-4 text-xs text-[#9B93AB]/60">
                Available on Seeker, Adept, and Magister plans.
              </p>
            </div>
          </section>
        </>
      ) : (
        <ComingSoonSection t={tradition} />
      )}
    </main>
  )
}
