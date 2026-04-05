'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import { useSiteI18n } from '@/lib/site-i18n'

export default function QuestionMeter() {
  const { plan, usageUsed, usageLimit, usageRemaining, guestTotalRemaining, isAuthenticated } = useAuth()
  const { t } = useSiteI18n()

  const label = isAuthenticated ? t('chat.meter.daily') : t('chat.meter.guest')
  const limitLabel = isAuthenticated ? usageLimit : 3
  const remainingLabel = isAuthenticated ? usageRemaining : guestTotalRemaining
  const pct = limitLabel === 'unlimited' ? 0 : Math.min(100, Math.round((usageUsed / Math.max(1, Number(limitLabel))) * 100))

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--primary-gold)]">{label}</div>
          <div className="text-sm text-[var(--text-secondary)] mt-1">{plan.toUpperCase()}</div>
        </div>
        <div className="text-right text-sm text-[var(--text-primary)]">
          {limitLabel === 'unlimited' ? '∞' : `${remainingLabel} / ${limitLabel}`}
        </div>
      </div>
      {limitLabel !== 'unlimited' && (
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[var(--primary-purple)] to-[var(--primary-gold)]" style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  )
}
