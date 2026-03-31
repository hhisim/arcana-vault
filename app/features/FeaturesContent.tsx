'use client'

import { useSiteI18n } from '@/lib/site-i18n'

type Lang = 'en' | 'tr' | 'ru'

const DICT: Record<string, Record<Lang, string>> = {
  'features.title': { en: 'Features', tr: 'Özellikler', ru: 'Возможности' },
  'features.subtitle': {
    en: 'A living mystery school built from rare archives, curated datasets, symbolic intelligence, and the evolving collaboration of Hakan Hisim + PRIME.',
    tr: 'Nadir arşivler, özenle seçilmiş veri setleri, sembolik zeka ve Hakan Hisim + PRIME işbirliğinin gelişen işbirliğinden oluşan yaşayan bir gizem okulu.',
    ru: 'Живая школа тайн, построенная на редких архивах, курируемых наборах данных, символическом интеллекте и развивающемся сотрудничестве Хакан Хисым + ПРАЙМ.',
  },
  'features.f1.title': { en: 'Living Oracle', tr: 'Yaşayan Kahin', ru: 'Живой Оракул' },
  'features.f1.desc': {
    en: 'Access deep symbolic intelligence trained on rare esoteric archives. Ask questions across multiple traditions — Tao, Tarot, Tantra, Entheogens, Sufi, Dreamwalker, and the Codex.',
    tr: 'Nadir ezoterik arşivler üzerine eğitilmiş derin sembolik zekaya erişin. Tao, Tarot, Tantra, Enteyojenler, Sufi, Rüya Yürüyüşü ve Kodeks dahil çoklu gelenekler arasında soru sorun.',
    ru: 'Доступ к глубокому символическому интеллекту, обученному на редких эзотерических архивах. Задавайте вопросы в рамках множества традиций — Дао, Таро, Тантра, Энтеогены, Суфизм, Лунный Странник и Кодекс.',
  },
  'features.f2.title': { en: 'Corpus Explorer', tr: 'Korpus Gezgini', ru: 'Исследователь корпуса' },
  'features.f2.desc': {
    en: 'Navigate a vast library of coded transmissions — visual art, symbolic notation, linguistic research, and sacred geometry spanning 30+ years of work.',
    tr: '30 yılı aşan çalışmayı kapsayan görsel sanat, sembolik notasyon, dilbilimsel araştırma ve kutsal geometriden oluşan devasa bir kodlanmış iletim kütüphanesinde gezinin.',
    ru: 'Перемещайтесь по гигантской библиотеке закодированных посланий — визуальное искусство, символическая нотация, лингвистические исследования и сакральная геометрия, охватывающие более 30 лет работы.',
  },
  'features.f3.title': { en: 'Daily Practices', tr: 'Günlük Uygulamalar', ru: 'Ежедневные практики' },
  'features.f3.desc': {
    en: 'Consciousness maps, breathwork protocols, and inquiry frameworks drawn from Grof, Wilber, Tart, Lilly, and Groisman — updated daily.',
    tr: "Grof, Wilber, Tart, Lilly ve Groisman'dan çizilen bilinç haritaları, nefes çalışması protokolleri ve sorgulama çerçeveleri — her gün güncellenir.",
    ru: 'Карты сознания, протоколы дыхательной работы и рамки исследования, почерпнутые у Грофа, Уилбера, Тарта, Лилли и Гройсмана — обновляются ежедневно.',
  },
  'features.f4.title': { en: 'Symbolic Intelligence', tr: 'Sembolik Zeka', ru: 'Символический интеллект' },
  'features.f4.desc': {
    en: 'The Codex Oracle understands symbolic language, mythic resonance, and cross-tradition correspondences — not just text matching.',
    tr: 'Kodeks Kahini, yalnızca metin eşleştirmesi değil, sembolik dili, mitos rezonansını ve çapraz gelenek yazışmalarını anlar.',
    ru: 'Оракул Кодекса понимает символический язык, мифический резонанс и межтрадиционные соответствия — а не просто сопоставление текста.',
  },
  'features.f5.title': { en: 'Multilingual', tr: 'Çok Dilli', ru: 'Многоязычный' },
  'features.f5.desc': {
    en: 'Access the Oracle in English, Turkish, Russian, and soon more languages — bridging traditions across linguistic boundaries.',
    tr: "Oracle'a İngilizce, Türkçe, Rusça ve yakında daha fazla dilde erişin — diller arası gelenekleri köprüleyin.",
    ru: 'Доступ к Оракулу на английском, турецком, русском и других языках — преодоление языковых границ между традициями.',
  },
  'features.f6.title': { en: 'Tradition Archives', tr: 'Gelenek Arşivleri', ru: 'Архивы традиций' },
  'features.f6.desc': {
    en: 'Deep-dive archives for each tradition — history, practices, texts, teachers, and contemporary applications.',
    tr: 'Her gelenek için derin arşivler — tarih, uygulamalar, metinler, öğretmenler ve çağdaş uygulamalar.',
    ru: 'Глубокие архивы по каждой традиции — история, практики, тексты, учителя и современные приложения.',
  },
}

const CARDS = [
  { key: 'f1', icon: '🔮' },
  { key: 'f2', icon: '📜' },
  { key: 'f3', icon: '⚡' },
  { key: 'f4', icon: '🌌' },
  { key: 'f5', icon: '🌐' },
  { key: 'f6', icon: '📚' },
]

export default function FeaturesContent() {
  const { lang } = useSiteI18n()
  const L: Lang = lang === 'tr' || lang === 'ru' ? lang : 'en'
  const _t = (k: string) => DICT[k]?.[L] ?? DICT[k]?.en ?? k

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#9B93AB] mb-4">
            [ Vault of Arcana ]
          </p>
          <h1 className="font-cinzel text-4xl md:text-5xl text-[var(--primary-gold)] mb-6">
            {_t('features.title')}
          </h1>
          <p className="text-[#9B93AB] text-lg max-w-xl mx-auto">
            {_t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CARDS.map((f) => (
            <div
              key={f.key}
              className="glass-card p-6 hover:border-[var(--primary-gold)]/30 transition-colors"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-cinzel text-lg text-[var(--primary-gold)] mb-3">
                {_t(`features.${f.key}.title`)}
              </h3>
              <p className="text-[#9B93AB] text-sm leading-relaxed">
                {_t(`features.${f.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
