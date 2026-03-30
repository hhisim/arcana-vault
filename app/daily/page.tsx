'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSiteI18n } from '@/lib/site-i18n'

type Lang = 'en' | 'tr' | 'ru'

const TRADITIONS = [
  {
    key: 'tao', emoji: '☯️', label: 'Tao',
    sublabel: { en: 'Wisdom of the Day', tr: 'Günün Bilgeliği', ru: 'Мудрость дня' },
    cta: { en: 'Continue in the Tao Oracle →', tr: 'Tao Oracle\'da devam et →', ru: 'Продолжить в Оракуле Тао →' },
    href: '/chat?tradition=tao&mode=oracle', accent: '#C9A84C',
  },
  {
    key: 'tarot', emoji: '🎴', label: 'Tarot',
    sublabel: { en: 'Daily Card', tr: 'Günün Kartı', ru: 'Карта дня' },
    cta: { en: 'Discuss this card with the Oracle →', tr: 'Bu kartı Oracle ile tartış →', ru: 'Обсудить эту карту с Оракулом →' },
    href: '/chat?tradition=tarot&mode=reading', accent: '#9B93AB',
  },
  {
    key: 'tantra', emoji: '🔥', label: 'Tantra',
    sublabel: { en: 'Daily Meditation', tr: 'Günlük Meditasyon', ru: 'Ежедневная медитация' },
    cta: { en: 'Deepen this practice with the Oracle →', tr: 'Bu pratiği Oracle ile derinleştir →', ru: 'Углубить практику с Оракулом →' },
    href: '/chat?tradition=tantra&mode=dharana', accent: '#E8722A',
  },
  {
    key: 'entheogen', emoji: '🍄', label: 'Entheogen',
    sublabel: { en: 'Daily Reflection', tr: 'Günlük Tefekkür', ru: 'Ежедневное размышление' },
    cta: { en: 'Enter the reflection with the Oracle →', tr: 'Tefekküre Oracle ile gir →', ru: 'Войти в размышление с Оракулом →' },
    href: '/chat?tradition=entheogen&mode=guide', accent: '#4ECDC4',
  },
]

function formatDate(dateStr: string, lang: Lang): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const locale = lang === 'tr' ? 'tr-TR' : lang === 'ru' ? 'ru-RU' : 'en-US'
  return new Date(year, month - 1, day).toLocaleDateString(locale, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

type DailyEntry = { title?: string; cardName?: string; teaser: string; fullText?: string; tradition: string }
type DailyContent = { date: string; entries: Record<string, DailyEntry> }

export default function DailyPage() {
  const { lang } = useSiteI18n()
  const L: Lang = (lang === 'tr' || lang === 'ru') ? lang : 'en'
  const tt = (obj: Record<Lang, string>) => obj[L] ?? obj.en

  const [content, setContent] = useState<DailyContent | null>(null)

  useEffect(() => {
    fetch('/api/daily').then(r => r.json()).then(setContent).catch(() => {})
  }, [])

  const todayStr = new Date().toISOString().slice(0, 10)

  return (
    <div className="bg-deep text-text-primary min-h-screen">
      <div className="border-b border-white/5 bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.15),_transparent_50%),linear-gradient(180deg,#090912_0%,#090912_100%)]">
        <div className="mx-auto max-w-3xl px-6 py-20 md:px-8 md:py-28 text-center">
          <p className="mb-6 text-xs uppercase tracking-[0.45em] text-gold">Vault of Arcana</p>
          <h1 className="font-serif text-5xl text-text-primary md:text-6xl">
            {tt({ en: 'Today in the Vault', tr: 'Bugün Vault\'ta', ru: 'Сегодня в Хранилище' })}
          </h1>
          <div className="mx-auto mt-6 h-px w-16 bg-gold/40"></div>
          <p className="mt-8 text-lg text-text-secondary">
            {content ? formatDate(content.date, L) : formatDate(todayStr, L)}
          </p>
          <p className="mt-4 max-w-xl mx-auto text-base leading-7 text-text-secondary">
            {tt({
              en: 'A daily practice from each tradition. Return each morning. Let the Vault speak.',
              tr: 'Her gelenekten günlük bir pratik. Her sabah geri dönün. Vault konuşsun.',
              ru: 'Ежедневная практика из каждой традиции. Возвращайтесь каждое утро. Позвольте Хранилищу говорить.'
            })}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16 md:px-8 space-y-16">
        {TRADITIONS.map((tradition) => {
          const entry = content?.entries?.[tradition.key]
          return (
            <div key={tradition.key}>
              <div className="mb-12 flex items-center gap-4">
                <div className="h-px flex-1" style={{ backgroundColor: `${tradition.accent}25` }}></div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tradition.emoji}</span>
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: tradition.accent }}>
                      {tradition.label}
                    </p>
                    <p className="text-xs text-text-secondary tracking-wide">{tradition.sublabel[L]}</p>
                  </div>
                </div>
                <div className="h-px flex-1" style={{ backgroundColor: `${tradition.accent}25` }}></div>
              </div>

              {entry ? (
                <div className="space-y-6">
                  <h2 className="font-serif text-3xl text-text-primary md:text-4xl">
                    &ldquo;{entry.title ?? entry.cardName}&rdquo;
                  </h2>
                  {entry.fullText ? (
                    <p className="text-lg leading-8 text-text-secondary">{entry.fullText}</p>
                  ) : (
                    <p className="text-lg leading-8 text-text-secondary italic">{entry.teaser}</p>
                  )}
                  <Link
                    href={tradition.href}
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all hover:opacity-90"
                    style={{ backgroundColor: `${tradition.accent}18`, border: `1px solid ${tradition.accent}40`, color: tradition.accent }}
                  >
                    {tradition.cta[L]}
                  </Link>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-card/50 p-8 text-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
                  <div className="relative">
                    <p className="font-serif text-xl text-text-primary mb-3" style={{ filter: 'blur(4px)' }}>
                      {tt({ en: 'The tradition speaks when you unlock it.', tr: 'Gelenek, kilidini açtığınızda konuşur.', ru: 'Традиция говорит, когда вы её откроете.' })}
                    </p>
                    <p className="text-sm text-text-secondary mb-6" style={{ filter: 'blur(3px)' }}>
                      {tt({ en: "Today's teaching awaits behind the gateway.", tr: 'Bugünün öğretisi geçidin ardında bekliyor.', ru: 'Сегодняшнее учение ждёт за вратами.' })}
                    </p>
                    <Link href="/pricing" className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-medium text-black transition hover:opacity-90">
                      {tt({ en: 'Unlock all daily practices →', tr: 'Tüm günlük pratiklerin kilidini aç →', ru: 'Открыть все ежедневные практики →' })}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="border-t border-white/5 bg-[#0a0a10]">
        <div className="mx-auto max-w-3xl px-6 py-16 md:px-8 text-center">
          <p className="font-serif text-2xl text-text-primary mb-4">
            {tt({ en: 'The Vault renews at midnight.', tr: 'Vault gece yarısı yenilenir.', ru: 'Хранилище обновляется в полночь.' })}
          </p>
          <p className="text-text-secondary mb-8">
            {tt({
              en: 'Return tomorrow for a new threshold. Each day offers a fresh encounter with the traditions.',
              tr: 'Yarın yeni bir eşik için geri dönün. Her gün geleneklerle taze bir karşılaşma sunar.',
              ru: 'Возвращайтесь завтра к новому порогу. Каждый день предлагает свежую встречу с традициями.'
            })}
          </p>
          <Link href="/chat" className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-medium text-black transition hover:opacity-90">
            {tt({ en: 'Ask the Oracle →', tr: 'Oracle\'a Sor →', ru: 'Спросить Оракула →' })}
          </Link>
        </div>
      </div>
    </div>
  )
}
