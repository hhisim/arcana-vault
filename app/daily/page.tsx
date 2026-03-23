import { getTodayContent } from '@/lib/daily-content'
import Link from 'next/link'

const TRADITIONS = [
  {
    key: 'tao',
    emoji: '☯️',
    label: 'Tao',
    sublabel: 'Wisdom of the Day',
    cta: 'Continue in the Tao Oracle →',
    href: '/chat?tradition=tao&mode=oracle',
    accent: '#C9A84C',
  },
  {
    key: 'tarot',
    emoji: '🎴',
    label: 'Tarot',
    sublabel: 'Daily Card',
    cta: 'Discuss this card with the Oracle →',
    href: '/chat?tradition=tarot&mode=reading',
    accent: '#9B93AB',
  },
  {
    key: 'tantra',
    emoji: '🔥',
    label: 'Tantra',
    sublabel: 'Daily Meditation',
    cta: 'Deepen this practice with the Oracle →',
    href: '/chat?tradition=tantra&mode=dharana',
    accent: '#E8722A',
  },
  {
    key: 'entheogen',
    emoji: '🍄',
    label: 'Entheogen',
    sublabel: 'Daily Reflection',
    cta: 'Enter the reflection with the Oracle →',
    href: '/chat?tradition=entheogen&mode=guide',
    accent: '#4ECDC4',
  },
]

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const dynamic = 'force-dynamic'

export default async function DailyPage() {
  const content = await getTodayContent()

  const todayStr = new Date().toISOString().slice(0, 10)

  return (
    <div className="bg-deep text-text-primary min-h-screen">
      {/* Header */}
      <div className="border-b border-white/5 bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.15),_transparent_50%),linear-gradient(180deg,#090912_0%,#090912_100%)]">
        <div className="mx-auto max-w-3xl px-6 py-20 md:px-8 md:py-28 text-center">
          <p className="mb-6 text-xs uppercase tracking-[0.45em] text-gold">Vault of Arcana</p>
          <h1 className="font-serif text-5xl text-text-primary md:text-6xl">Today in the Vault</h1>
          <div className="mx-auto mt-6 h-px w-16 bg-gold/40"></div>
          <p className="mt-8 text-lg text-text-secondary">
            {content ? formatDate(content.date) : formatDate(todayStr)}
          </p>
          <p className="mt-4 max-w-xl mx-auto text-base leading-7 text-text-secondary">
            A daily practice from each tradition. Return each morning. Let the Vault speak.
          </p>
        </div>
      </div>

      {/* Daily Content Sections */}
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-8 space-y-16">
        {TRADITIONS.map((tradition) => {
          const entry = content?.entries?.[tradition.key]
          return (
            <div key={tradition.key}>
              {/* Divider */}
              <div className="mb-12 flex items-center gap-4">
                <div className="h-px flex-1" style={{ backgroundColor: `${tradition.accent}25` }}></div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tradition.emoji}</span>
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: tradition.accent }}>
                      {tradition.label}
                    </p>
                    <p className="text-xs text-text-secondary tracking-wide">{tradition.sublabel}</p>
                  </div>
                </div>
                <div className="h-px flex-1" style={{ backgroundColor: `${tradition.accent}25` }}></div>
              </div>

              {entry ? (
                <div className="space-y-6">
                  <h2 className="font-serif text-3xl text-text-primary md:text-4xl">
                    &ldquo;{entry.title}&rdquo;
                  </h2>
                  {entry.fullText ? (
                    <p className="text-lg leading-8 text-text-secondary">
                      {entry.fullText}
                    </p>
                  ) : (
                    <p className="text-lg leading-8 text-text-secondary italic">
                      {entry.teaser}
                    </p>
                  )}
                  <Link
                    href={tradition.href}
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all hover:opacity-90"
                    style={{
                      backgroundColor: `${tradition.accent}18`,
                      border: `1px solid ${tradition.accent}40`,
                      color: tradition.accent,
                    }}
                  >
                    {tradition.cta}
                  </Link>
                </div>
              ) : (
                /* Locked state — show a poetic teaser placeholder */
                <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-card/50 p-8 text-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
                  <div className="relative">
                    <p className="font-serif text-xl text-text-primary mb-3" style={{ filter: 'blur(4px)' }}>
                      The tradition speaks when you unlock it.
                    </p>
                    <p className="text-sm text-text-secondary mb-6" style={{ filter: 'blur(3px)' }}>
                      Today's teaching awaits behind the gateway.
                    </p>
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-medium text-black transition hover:opacity-90"
                    >
                      Unlock all daily practices →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-white/5 bg-[#0a0a10]">
        <div className="mx-auto max-w-3xl px-6 py-16 md:px-8 text-center">
          <p className="font-serif text-2xl text-text-primary mb-4">
            The Vault renews at midnight.
          </p>
          <p className="text-text-secondary mb-8">
            Return tomorrow for a new threshold. Each day offers a fresh encounter with the traditions.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-medium text-black transition hover:opacity-90"
          >
            Ask the Oracle →
          </Link>
        </div>
      </div>
    </div>
  )
}
