'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import QuestionMeter from '@/components/subscription/QuestionMeter'
import UnlockNudge from '@/components/subscription/UnlockNudge'
import { useAuth } from '@/components/auth/AuthProvider'
import { getSlots } from '@/lib/plans'
import { useSiteI18n } from '@/lib/site-i18n'

const OraclePortal = dynamic(() => import('@/app/components/OraclePortal'), { ssr: false })

export default function ChatPage() {
  const { t } = useSiteI18n()
  const auth = useAuth()
  const slots = getSlots(auth.plan)

  return (
    <section className="mx-auto max-w-7xl px-6 py-8 space-y-6">
      <div className="grid lg:grid-cols-[360px_1fr] gap-6 items-start">
        <div className="space-y-4 lg:sticky lg:top-24">
          <QuestionMeter />
          <UnlockNudge compact />
          {auth.plan !== 'full' && (
            <div className="glass-card p-4">
              <div className="text-xs uppercase tracking-[0.25em] text-[var(--primary-gold)] mb-2">{t('chat.chooseTraditions')}</div>
              <div className="text-sm text-[var(--text-secondary)] leading-7">
                {slots === 'all' ? 'All traditions unlocked.' : `You can keep ${slots} tradition slot${Number(slots) > 1 ? 's' : ''} active on your current plan.`}
              </div>
              <div className="mt-4 flex gap-3 flex-wrap">
                <Link href="/account" className="rounded-full border border-white/10 px-4 py-2 text-[var(--text-primary)]">{t('nav.account')}</Link>
                <Link href="/pricing" className="rounded-full bg-[var(--primary-gold)] px-4 py-2 text-black font-medium">{t('nav.pricing')}</Link>
              </div>
            </div>
          )}
        </div>
        <OraclePortal />
      </div>
    </section>
  )
}
