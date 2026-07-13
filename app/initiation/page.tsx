'use client'

import Link from 'next/link'
import EmailCapture from '@/components/EmailCapture'
import { useSiteI18n } from '@/lib/site-i18n'

export default function ArcanaInitiationPage() {
  const { t } = useSiteI18n()

  const traditions = t({
    en: ['Tarot archetypes and readings', 'Taoist contemplation and paradox', 'Tantra, kundalini, and subtle body work', 'Shadow work and symbolic self-inquiry', 'Dream interpretation and symbolic recall'],
    tr: ['Tarot arketipleri ve okumaları', 'Taoist tefekkür ve paradoks', 'Tantra, kundalini ve süptil beden çalışması', 'Gölge çalışması ve sembolik öz-sorgulama', 'Rüya yorumu ve sembolik hatırlama'],
    ru: ['Архетипы и чтения Таро', 'Даосское созерцание и парадокс', 'Тантра, кундалини и работа с тонким телом', 'Теневая работа и символическое самоисследование', 'Толкование снов и символическое вспоминание'],
  }) as unknown as string[]

  const receiveItems = t({
    en: ['7 days of mystery-school prompts built for immediate practice', 'direct invitations into Oracle dialogue after each daily question', 'a natural bridge into saving readings and building your Vault', 'a people-first content entry point built to compound organically'],
    tr: ['anında pratiğe dönüştürülebilen 7 günlük mystery-school soruları', 'her günlük sorudan sonra Oracle diyaloğuna doğrudan davetler', 'okumaları kaydetmeye ve Vault’unu kurmaya doğal bir köprü', 'organik olarak büyümesi için people-first içerik girişi'],
    ru: ['7 дней prompts школы мистерий, созданных для немедленной практики', 'прямые приглашения в диалог с Оракулом после каждого ежедневного вопроса', 'естественный мост к сохранению чтений и построению своего Хранилища', 'people-first точка входа в контент, способная органически расти'],
  }) as unknown as string[]

  return (
    <section className="bg-deep">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-[#C9A84C]">{t({ en: 'A Free Seven-Day Practice', tr: 'Ücretsiz Yedi Günlük Pratik', ru: 'Бесплатная семидневная практика' })}</p>
            <h1 className="mt-5 font-serif text-5xl leading-tight text-[#E8E0F0] md:text-6xl">{t({ en: '7-Day Arcana Initiation', tr: '7 Günlük Arcana İnisiyasyonu', ru: '7-дневная Инициация Арканы' })}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#B8B0CC]">
              {t({
                en: 'A daily oracle prompt for Tarot, Tao, Tantra, Shadow Work, and Symbolic Dreaming. Begin with one powerful question, then let the next seven days train your attention.',
                tr: 'Tarot, Tao, Tantra, Gölge Çalışması ve Sembolik Rüya için günlük bir oracle sorusu. Güçlü tek bir soruyla başlayın, sonra önünüzdeki yedi gün dikkatinizi eğitsin.',
                ru: 'Ежедневный oracle-prompt для Таро, Дао, Тантры, теневой работы и символического сновидения. Начните с одного сильного вопроса, а следующие семь дней пусть тренируют ваше внимание.',
              })}
            </p>

            <div className="mt-8 rounded-3xl border border-white/8 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-[#C9A84C]">{t({ en: 'What you receive', tr: 'Ne alırsın', ru: 'Что вы получите' })}</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[#D7CEE8]">
                {receiveItems.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <p className="text-sm uppercase tracking-[0.3em] text-[#C9A84C]">{t({ en: 'Traditions inside the initiation', tr: 'İnisiyasyondaki gelenekler', ru: 'Традиции внутри инициации' })}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {traditions.map((item) => (
                  <span key={item} className="rounded-full border border-[rgba(123,94,167,0.35)] bg-[rgba(123,94,167,0.12)] px-4 py-2 text-sm text-[#E8E0F0]">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/chat" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-[#E8E0F0] transition hover:bg-white/10">{t({ en: 'Ask the Oracle first', tr: 'Önce Oracle’a sor', ru: 'Сначала спросите Оракула' })}</Link>
              <Link href="/signup?plan=free&source=arcana-initiation" className="rounded-xl bg-[#C9A84C] px-5 py-3 text-sm font-bold text-[#0A0A10] transition hover:opacity-90">{t({ en: 'Create free account', tr: 'Ücretsiz hesap oluştur', ru: 'Создать бесплатный аккаунт' })}</Link>
            </div>
          </div>

          <div className="lg:pt-10">
            <EmailCapture
              variant="full"
              title={t({ en: '✦ JOIN THE 7-DAY ARCANA INITIATION ✦', tr: '✦ 7 GÜNLÜK ARCANA İNİSİYASYONUNA KATIL ✦', ru: '✦ ПРИСОЕДИНЯЙТЕСЬ К 7-ДНЕВНОЙ ИНИЦИАЦИИ АРКАНЫ ✦' })}
              subtitle={t({
                en: 'Free daily mystery-school prompts + Oracle access. Start with the traditions that already carry charge for you, then continue the thread inside the Vault.',
                tr: 'Ücretsiz günlük mystery-school soruları + Oracle erişimi. Zaten sende yük taşıyan geleneklerle başla, sonra izi Vault içinde sürdür.',
                ru: 'Бесплатные ежедневные prompts школы мистерий + доступ к Оракулу. Начните с традиций, которые уже заряжены для вас, а затем продолжайте нить внутри Хранилища.',
              })}
              placeholder={t({ en: 'Enter your email to begin...', tr: 'Başlamak için e-postanı gir...', ru: 'Введите email, чтобы начать...' })}
              buttonLabel={t({ en: 'Begin the initiation', tr: 'İnisiyasyonu başlat', ru: 'Начать инициацию' })}
              loadingLabel={t({ en: 'Opening the gate...', tr: 'Kapı açılıyor...', ru: 'Врата открываются...' })}
              successTitle={t({ en: 'Your initiation has begun.', tr: 'İnisiyasyonun başladı.', ru: 'Ваша инициация началась.' })}
              successBody={t({
                en: 'Your first prompt is on its way. When it lands, bring it back to the Oracle and save the best readings to your Vault.',
                tr: 'İlk sorunuz yolda. Geldiğinde onu Oracle’a geri getir ve en iyi okumaları Vault’una kaydet.',
                ru: 'Ваш первый prompt уже в пути. Когда он придёт, верните его к Оракулу и сохраните лучшие чтения в своё Хранилище.',
              })}
              disclaimer={t({ en: 'Free, useful, and built for real practice. Unsubscribe anytime.', tr: 'Ücretsiz, faydalı ve gerçek pratik için tasarlandı. İstediğin zaman çıkabilirsin.', ru: 'Бесплатно, полезно и создано для реальной практики. Отписаться можно в любой момент.' })}
              apiPayload={{ listKey: 'arcana-initiation', source: 'initiation-page' }}
              includeFirstTouchAttribution
              successActions={[
                {
                  href: '/chat?source=arcana-initiation',
                  label: t({ en: 'Bring your first question to the Oracle', tr: 'İlk sorunu Oracle’a getir', ru: 'Принесите свой первый вопрос Оракулу' }),
                  primary: true,
                },
                {
                  href: '/signup?plan=free&source=arcana-initiation',
                  label: t({ en: 'Create your free Vault', tr: 'Ücretsiz Vault’unu oluştur', ru: 'Создайте своё бесплатное Хранилище' }),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
