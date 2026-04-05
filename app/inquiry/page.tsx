'use client'

import Link from 'next/link'
import { useSiteI18n } from '@/lib/site-i18n'

const SECTIONS = [
  { id: 'intro',   icon: '⚡', color: '#C9A84C' },
  { id: 'delphic', icon: '🏛️', color: '#9B8AE8' },
  { id: 'shallow', icon: '⚠️', color: '#E05C5C' },
  { id: 'deep',    icon: '✦', color: '#4ECDC4' },
  { id: 'followup',icon: '↺', color: '#7B5EA7' },
  { id: 'modes',   icon: '🔮', color: '#E87EA1' },
  { id: 'framework',icon: '🧭', color: '#D4A574' },
  { id: 'traditions',icon: '☯', color: '#4ECDC4' },
  { id: 'threshold',icon: '🌌', color: '#C9A84C' },
]

const STARTERS = [
  { label: 'inquiry.starters.intro', sub: 'inquiry.starters.intro_sub', href: '/chat', color: '#C9A84C' },
  { label: 'inquiry.starters.deeper', sub: 'inquiry.starters.deeper_sub', href: '/chat', color: '#7B5EA7' },
  { label: 'inquiry.starters.sitting', sub: 'inquiry.starters.sitting_sub', href: '/chat', color: '#4ECDC4' },
]

const TRADITION_BUTTONS = [
  { key: 'tao', icon: '☯', href: '/chat?tradition=tao', color: '#4ECDC4' },
  { key: 'tarot', icon: '🌟', href: '/chat?tradition=tarot', color: '#7B5EA7' },
  { key: 'tantra', icon: '🔮', href: '/chat?tradition=tantra', color: '#E87EA1' },
  { key: 'sufism', icon: '🌀', href: '/chat?tradition=sufism', color: '#D4A574' },
  { key: 'entheogens', icon: '🧬', href: '/chat?tradition=entheogens', color: '#2D5A4A' },
  { key: 'dreamwork', icon: '🌙', href: '/chat?tradition=dreamwalker', color: '#5C8FE0' },
  { key: 'qabalah', icon: '✡', href: '/chat?tradition=kabbalah', color: '#E05CE0' },
  { key: 'all_modes', icon: '✨', href: '/chat', color: '#C9A84C' },
]

export default function InquiryPage() {
  const { t } = useSiteI18n()

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0] font-sans antialiased pb-24 pt-16">
      {/* Hero */}
      <section className="relative py-24 px-6 text-center border-b border-white/8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f2e]/60 via-[#0A0A0F] to-[#0A0A0F]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-[#C9A84C]/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C9A84C] mb-4">{t('inquiry.hero.eyebrow')}</p>
          <h1 className="font-cinzel text-4xl md:text-6xl text-[#E8E0F0] mb-6 leading-tight">{t('inquiry.hero.title')}</h1>
          <p className="text-lg text-[#9B93AB] leading-8 max-w-2xl mx-auto">
            {t('inquiry.hero.subtitle')}
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/chat" className="px-8 py-3.5 rounded-xl bg-[#C9A84C] text-[#0A0A0F] font-bold text-sm uppercase tracking-widest hover:bg-[#B1933E] transition-colors">
              {t('inquiry.hero.cta')}
            </Link>
            <a href="#intro" className="px-6 py-3.5 rounded-xl border border-white/15 text-[#9B93AB] text-sm hover:text-[#E8E0F0] hover:border-white/30 transition-colors">
              {t('inquiry.hero.read_essay')}
            </a>
          </div>
        </div>
      </section>

      {/* Article Sections */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        {SECTIONS.map((section, i) => {
          const title = t(`inquiry.sections.${section.id}.title`)
          const content = t(`inquiry.sections.${section.id}.content`)
          return (
            <section key={section.id} id={section.id} className="mb-16 scroll-mt-24">
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${section.color}18`, border: `1px solid ${section.color}30` }}
                >
                  {section.icon}
                </div>
                <div className="flex-1 pt-1">
                  <span className="text-xs uppercase tracking-widest text-[#5A5470] mb-1 block">Part {i + 1}</span>
                  <h2 className="font-cinzel text-xl md:text-2xl text-[#E8E0F0] leading-snug">{title}</h2>
                </div>
              </div>
              <div className="pl-4 ml-4 border-l border-white/10">
                {content.split('\n\n').map((para: string, j: number) => (
                  <p key={j} className="text-[#9B93AB] leading-8 mb-4 text-base">{para}</p>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {/* Begin Section */}
      <section className="border-t border-white/8 bg-gradient-to-b from-[#0f0f1a] to-[#0A0A0F]">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <h2 className="font-cinzel text-3xl text-[#E8E0F0] text-center mb-12">{t('inquiry.starters.cta')}</h2>

          <div className="grid gap-6 md:grid-cols-3 mb-16">
            {STARTERS.map((s, i) => (
              <Link
                key={i}
                href={s.href}
                className="group p-6 rounded-2xl border border-white/8 bg-[#0f0f1a] hover:border-white/20 transition-all hover:-translate-y-0.5 text-left"
              >
                <div className="w-2 h-2 rounded-full mb-4" style={{ backgroundColor: s.color }} />
                <p className="font-cinzel text-sm text-[#E8E0F0] mb-2">{t(s.label)}</p>
                <p className="text-xs text-[#6B6382] leading-relaxed">{t(s.sub)}</p>
              </Link>
            ))}
          </div>

          {/* Practice Chamber */}
          <div className="rounded-2xl border border-[#C9A84C]/20 bg-[#C9A84C]/5 p-8 text-center">
            <p className="text-sm text-[#9B93AB] mb-6 italic">
              {t('inquiry.traditions.lens')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TRADITION_BUTTONS.map((btn) => (
                <Link
                  key={btn.key}
                  href={btn.href}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/8 bg-[#0A0A0F] hover:border-white/20 transition-all text-left"
                >
                  <span className="text-lg">{btn.icon}</span>
                  <span className="text-xs font-cinzel uppercase tracking-wider" style={{ color: btn.color }}>{t(`inquiry.traditions.${btn.key}`)}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Email CTA */}
      <section className="border-t border-white/8 py-16 px-6">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-[#5A5470] mb-3">{t('inquiry.email.eyebrow')}</p>
          <h3 className="font-cinzel text-xl text-[#E8E0F0] mb-3">{t('inquiry.email.title')}</h3>
          <p className="text-sm text-[#6B6382] mb-6 leading-relaxed">
            {t('inquiry.email.body')}
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2 max-w-sm mx-auto"
          >
            <input
              type="email"
              placeholder={t('inquiry.email.placeholder')}
              className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-[#E8E0F0] placeholder:text-[#5A5470] focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#C9A84C] text-[#0A0A0F] px-5 py-3 text-sm font-bold uppercase tracking-wider hover:bg-[#B1933E] transition-colors whitespace-nowrap"
            >
              {t('inquiry.email.cta')}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
