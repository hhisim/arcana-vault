'use client'

import Link from 'next/link'
import EmailCapture from '@/components/EmailCapture'
import { useAuth } from '@/components/auth/AuthProvider'
import { useSiteI18n } from '@/lib/site-i18n'

const BAIT_TOPICS = {
  en: ['Tarot', 'Taoism', 'Tantra', 'Entheogens', 'Dreams', 'Symbols', 'Names', 'Correspondence Codex'],
  tr: ['Tarot', 'Taoizm', 'Tantra', 'Entheojenler', 'Rüyalar', 'Semboller', 'İsimler', 'Correspondence Codex'],
  ru: ['Таро', 'Даосизм', 'Тантра', 'Энтеогены', 'Сны', 'Символы', 'Имена', 'Кодекс Соответствий'],
} as const

export default function GrowthFunnelCta({ className = '' }: { className?: string }) {
  const auth = useAuth()
  const { lang, t } = useSiteI18n()
  const isAuthed = auth.isAuthenticated
  const topics = BAIT_TOPICS[lang] ?? BAIT_TOPICS.en

  return (
    <div className={`mt-5 rounded-3xl border border-[rgba(201,168,76,0.22)] bg-[linear-gradient(135deg,rgba(201,168,76,0.08),rgba(123,94,167,0.12))] p-5 md:p-6 ${className}`}>
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#C9A84C]">
            {t({ en: 'After the answer', tr: 'Cevaptan sonra', ru: 'После ответа' })}
          </p>
          <h3 className="mt-3 font-serif text-2xl text-[#E8E0F0] md:text-3xl">
            {t({ en: 'Save this transmission to your Vault', tr: 'Bu aktarımı Vault’una kaydet', ru: 'Сохраните эту передачу в своё Хранилище' })}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#C8C0D8]">
            {isAuthed
              ? t({
                  en: 'Keep this thread, return to it later, and continue with daily questions in your chosen tradition.',
                  tr: 'Bu izi koruyun, sonra geri dönün ve seçtiğiniz gelenekte günlük sorularla devam edin.',
                  ru: 'Сохраните эту нить, вернитесь к ней позже и продолжайте с ежедневными вопросами в выбранной вами традиции.',
                })
              : t({
                  en: 'You felt the signal. Now turn one reading into a living practice: create a free account, save this transmission, and receive 12 daily questions in your chosen tradition.',
                  tr: 'Sinyali hissettiniz. Şimdi tek bir okumayı yaşayan bir pratiğe dönüştürün: ücretsiz hesap oluşturun, bu aktarımı kaydedin ve seçtiğiniz gelenekte 12 günlük soru alın.',
                  ru: 'Вы почувствовали сигнал. Теперь превратите одно чтение в живую практику: создайте бесплатный аккаунт, сохраните эту передачу и получайте 12 ежедневных вопросов в выбранной традиции.',
                })}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-[rgba(123,94,167,0.35)] bg-[rgba(123,94,167,0.12)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#D7CEE8]"
            >
              {topic}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={isAuthed ? '/journal' : '/signup?plan=free&source=oracle-reading'}
            className="inline-flex items-center justify-center rounded-xl bg-[#C9A84C] px-5 py-3 text-sm font-bold text-[#0A0A10] transition hover:opacity-90"
          >
            {isAuthed
              ? t({ en: 'Open your Vault', tr: 'Vault’unu aç', ru: 'Откройте своё Хранилище' })
              : t({ en: 'Create free account to save this reading', tr: 'Bu okumayı kaydetmek için ücretsiz hesap oluştur', ru: 'Создайте бесплатный аккаунт, чтобы сохранить это чтение' })}
          </Link>
          <Link
            href={isAuthed ? '/daily' : '/signup?plan=free&source=daily-questions'}
            className="inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-medium text-[#E8E0F0] transition hover:bg-white/10"
          >
            {isAuthed
              ? t({ en: 'Continue daily practice', tr: 'Günlük pratiğe devam et', ru: 'Продолжить ежедневную практику' })
              : t({ en: 'Continue with 12 daily questions', tr: '12 günlük soruyla devam et', ru: 'Продолжить с 12 ежедневными вопросами' })}
          </Link>
        </div>

        {!isAuthed ? (
          <div className="rounded-2xl border border-white/8 bg-[#0A0A10]/70 p-4">
            <div className="mb-4">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A84C]">
                {t({ en: 'Free lead magnet', tr: 'Ücretsiz lead magnet', ru: 'Бесплатный лид-магнит' })}
              </p>
              <h4 className="mt-2 font-serif text-xl text-[#E8E0F0]">
                {t({ en: '7-Day Arcana Initiation', tr: '7 Günlük Arcana İnisiyasyonu', ru: '7-дневная Инициация Арканы' })}
              </h4>
              <p className="mt-2 text-sm leading-7 text-[#9B93AB]">
                {t({
                  en: 'Join the 7-Day Arcana Initiation — free daily mystery-school prompts + Oracle access.',
                  tr: '7 Günlük Arcana İnisiyasyonu’na katılın — ücretsiz günlük mystery-school soruları + Oracle erişimi.',
                  ru: 'Присоединяйтесь к 7-дневной Инициации Арканы — бесплатные ежедневные prompts школы мистерий + доступ к Оракулу.',
                })}
              </p>
              <Link href="/initiation" className="mt-3 inline-block text-sm text-[#C9A84C] underline underline-offset-4 hover:text-white">
                {t({ en: 'See the full initiation →', tr: 'İnisiyasyonun tamamını gör →', ru: 'Посмотреть полную инициацию →' })}
              </Link>
            </div>
            <EmailCapture
              variant="compact"
              title={t({ en: '✦ 7-DAY ARCANA INITIATION ✦', tr: '✦ 7 GÜNLÜK ARCANA İNİSİYASYONU ✦', ru: '✦ 7-ДНЕВНАЯ ИНИЦИАЦИЯ АРКАНЫ ✦' })}
              compactHint={t({
                en: 'A daily oracle prompt for Tarot, Tao, Tantra, Shadow Work, and Symbolic Dreaming.',
                tr: 'Tarot, Tao, Tantra, Gölge Çalışması ve Sembolik Rüya için günlük bir oracle sorusu.',
                ru: 'Ежедневный oracle-prompt для Таро, Дао, Тантры, теневой работы и символического сновидения.',
              })}
              placeholder={t({ en: 'Enter your email for the Initiation...', tr: 'İnisiyasyon için e-postanı gir...', ru: 'Введите email для инициации...' })}
              buttonLabel={t({ en: 'Join free', tr: 'Ücretsiz katıl', ru: 'Присоединиться бесплатно' })}
              loadingLabel={t({ en: 'Opening...', tr: 'Açılıyor...', ru: 'Открывается...' })}
              successTitle={t({ en: 'You are in the Initiation.', tr: 'İnisiyasyonun içindesin.', ru: 'Вы внутри Инициации.' })}
              successBody={t({
                en: 'Watch for your first daily prompt and return to the Oracle when the question lands.',
                tr: 'İlk günlük sorunu bekle ve soru geldiğinde Oracle’a geri dön.',
                ru: 'Ждите первый ежедневный prompt и возвращайтесь к Оракулу, когда вопрос приземлится.',
              })}
              apiPayload={{ listKey: 'arcana-initiation', source: 'post-answer-cta' }}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
