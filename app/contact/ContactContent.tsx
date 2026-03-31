'use client'

import { useSiteI18n } from '@/lib/site-i18n'

export default function ContactContent() {
  const { t } = useSiteI18n()

  const channels = [
    {
      icon: '✉️',
      titleKey: 'contact.general.title',
      descKey: 'contact.general.desc',
      emailKey: 'contact.general.email',
    },
    {
      icon: '🛒',
      titleKey: 'contact.order.title',
      descKey: 'contact.order.desc',
      emailKey: 'contact.order.email',
    },
    {
      icon: '💎',
      titleKey: 'contact.press.title',
      descKey: 'contact.press.desc',
      emailKey: 'contact.press.email',
    },
  ]

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#9B93AB] mb-4">
            [ Vault of Arcana ]
          </p>
          <h1 className="font-cinzel text-4xl md:text-5xl text-[var(--primary-gold)] mb-6">
            {t('contact.title')}
          </h1>
          <p className="text-[#9B93AB] text-lg">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="glass-card p-8 space-y-8">
          {channels.map((item) => (
            <div key={item.titleKey} className="flex gap-4">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h3 className="font-cinzel text-[var(--primary-gold)] mb-1">
                  {t(item.titleKey)}
                </h3>
                <p className="text-[#9B93AB] text-sm mb-2">
                  {t(item.descKey)}
                </p>
                <a
                  href={`mailto:${t(item.emailKey)}`}
                  className="text-sm text-[#C9A84C] hover:underline"
                >
                  {t(item.emailKey)}
                </a>
              </div>
            </div>
          ))}

          <div className="border-t border-white/10 pt-6">
            <p className="text-[#9B93AB] text-sm text-center">
              {t('contact.response_time')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
