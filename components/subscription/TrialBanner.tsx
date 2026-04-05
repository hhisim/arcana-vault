'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'

/**
 * Drop this anywhere visible (layout, NavBar, account page, chat sidebar).
 * Only renders for users on an active trial.
 *
 * Usage: <TrialBanner />
 */
export default function TrialBanner() {
  const { isTrial, trialDaysRemaining, plan } = useAuth()

  if (!isTrial || trialDaysRemaining === null) return null

  const urgent = trialDaysRemaining <= 5
  const expiring = trialDaysRemaining <= 1

  return (
    <div className={`
      rounded-2xl px-5 py-3 flex items-center justify-between gap-4 flex-wrap text-sm
      ${urgent
        ? 'bg-red-900/30 border border-red-500/40'
        : 'bg-[var(--primary-gold)]/10 border border-[var(--primary-gold)]/20'
      }
    `}>
      <div className="flex items-center gap-3">
        <span className="text-lg">{urgent ? '⚠' : '✦'}</span>
        <div>
          <span className={urgent ? 'text-red-300' : 'text-[var(--primary-gold)]'}>
            {expiring
              ? 'Your trial ends today!'
              : `${trialDaysRemaining} day${trialDaysRemaining !== 1 ? 's' : ''} left on your ${plan} trial`
            }
          </span>
          {urgent && (
            <span className="text-[var(--text-secondary)] ml-2">
              Subscribe to keep your access.
            </span>
          )}
        </div>
      </div>
      <Link
        href="/pricing"
        className={`
          rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap
          ${urgent
            ? 'bg-red-500 text-white hover:bg-red-400'
            : 'bg-[var(--primary-gold)] text-black hover:opacity-90'
          }
          transition-colors
        `}
      >
        {urgent ? 'Subscribe Now' : 'View Plans'}
      </Link>
    </div>
  )
}
