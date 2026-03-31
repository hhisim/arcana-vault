'use client'

import { useSiteI18n } from '@/lib/site-i18n'

export default function CorrespondenceGuide() {
  const { t } = useSiteI18n()

  return (
    <div className="mb-8 rounded-2xl border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.05)] p-6">
      <h2 className="font-serif text-2xl text-[var(--primary-gold)] mb-3">
        {t('correspondence.guide.title')}
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-[var(--primary-gold)] text-sm font-bold mb-1">
            {t('correspondence.guide.step1_title')}
          </p>
          <p className="text-[var(--text-secondary)] text-sm">
            {t('correspondence.guide.step1_body')}
          </p>
        </div>
        <div>
          <p className="text-[var(--primary-gold)] text-sm font-bold mb-1">
            {t('correspondence.guide.step2_title')}
          </p>
          <p className="text-[var(--text-secondary)] text-sm">
            {t('correspondence.guide.step2_body')}
          </p>
        </div>
        <div>
          <p className="text-[var(--primary-gold)] text-sm font-bold mb-1">
            {t('correspondence.guide.step3_title')}
          </p>
          <p className="text-[var(--text-secondary)] text-sm">
            {t('correspondence.guide.step3_body')}
          </p>
        </div>
      </div>
    </div>
  )
}
