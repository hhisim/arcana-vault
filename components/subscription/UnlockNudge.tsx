'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { useSiteI18n } from '@/lib/site-i18n'

export default function UnlockNudge({ compact = false }: { compact?: boolean }) {
  const { plan, usageRemaining, guestTotalRemaining, isAuthenticated } = useAuth()
  const { t } = useSiteI18n()
  const remaining = isAuthenticated ? usageRemaining : guestTotalRemaining
  const shouldShow = !isAuthenticated || remaining !== 'unlimited' && Number(remaining) <= 3 || plan === 'free'
  if (!shouldShow) return null

  return (
    <div className={`glass-card border border-[var(--primary-gold)]/20 ${compact ? 'p-4' : 'p-6'} space-y-3`}>
      <div className="text-xs uppercase tracking-[0.25em] text-[var(--primary-gold)]">{t('chat.unlock.title')}</div>
      <p className="text-[var(--text-secondary)] leading-7">{t('chat.unlock.copy')}</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/pricing" className="rounded-full bg-[var(--primary-gold)] px-4 py-2 text-black font-medium">{t('chat.unlock.cta')}</Link>
        {!isAuthenticated && <Link href="/signup" className="rounded-full border border-white/10 px-4 py-2 text-[var(--text-primary)]">{t('nav.signup')}</Link>}
      </div>
    </div>
  )
}
