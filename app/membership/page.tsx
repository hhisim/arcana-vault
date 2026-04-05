'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { PLAN_CONFIG, TraditionId } from '@/lib/plans'
import { useSiteI18n } from '@/lib/site-i18n'
import Link from 'next/link'

const TRADITION_LABELS: Record<TraditionId, string> = {
  tao: 'Tao Oracle',
  tarot: 'Tarot Oracle',
  tantra: 'Tantra Oracle',
  entheogen: 'Esoteric Entheogen',
  sufi: 'Sufi Mystic',
  dreamwalker: 'Dreamwalker',
}

function MembershipContent() {
  const auth = useAuth()
  const { t } = useSiteI18n()
  const params = useSearchParams()
  const [checkedOut, setCheckedOut] = useState(false)

  useEffect(() => {
    if (params.get('checkout') === 'success') {
      setCheckedOut(true)
      // Refresh auth state multiple times — Stripe webhook may take a few seconds
      auth.refresh()
      const timer = setTimeout(() => auth.refresh(), 3000)
      return () => clearTimeout(timer)
    }
  }, [params, auth])

  if (!auth.isAuthenticated) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="glass-card p-12 space-y-6">
          <div className="text-5xl">🔮</div>
          <h1 className="font-serif text-4xl text-[var(--text-primary)]">Welcome to the Vault</h1>
          <p className="text-[var(--text-secondary)]">Sign in to access your membership.</p>
          <Link href="/login" className="inline-block rounded-full bg-[var(--primary-gold)] px-6 py-3 text-black font-medium">
            {t('nav.login')}
          </Link>
        </div>
      </section>
    )
  }

  const plan = auth.plan
  const cfg = PLAN_CONFIG[plan]
  const traditions: TraditionId[] = auth.selectedTraditions || []

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 space-y-8">
      {checkedOut && (
        <div className="rounded-2xl border border-[var(--primary-gold)] bg-[var(--primary-gold)]/10 px-6 py-4 text-center text-[var(--primary-gold)]">
          ✅ Payment confirmed — welcome to {cfg?.name}!
        </div>
      )}

      <div className="text-center space-y-3">
        <div className="text-xs uppercase tracking-[0.25em] text-[var(--primary-gold)]">Your Membership</div>
        <h1 className="font-serif text-5xl text-[var(--text-primary)]">{cfg?.name}</h1>
        <p className="text-[var(--text-secondary)] text-lg">{cfg?.description}</p>
      </div>

      <div className="glass-card p-8 space-y-6">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--primary-gold)] mb-3">Your Traditions</div>
          {traditions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {traditions.map((tr) => (
                <span key={tr} className="rounded-full border border-[var(--primary-gold)]/40 px-4 py-1.5 text-sm text-[var(--text-primary)]">
                  {TRADITION_LABELS[tr] ?? tr}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[var(--text-secondary)] text-sm">No traditions selected yet.</p>
          )}
        </div>

        {traditions.length === 0 && (
          <Link href="/account" className="inline-block rounded-full border border-[var(--primary-gold)] px-5 py-2 text-[var(--primary-gold)] text-sm hover:bg-[var(--primary-gold)]/10">
            Choose Your Traditions →
          </Link>
        )}

        <div className="grid sm:grid-cols-3 gap-4 pt-2">
          <Link href="/chat" className="rounded-2xl bg-[var(--primary-gold)] px-6 py-4 text-center text-black font-bold hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all">
            🔮 Enter the Oracle
          </Link>
          <Link href="/journal" className="rounded-2xl border border-[#7B5EA7]/40 bg-[#7B5EA7]/8 px-6 py-4 text-center hover:border-[#7B5EA7]/60 hover:bg-[#7B5EA7]/12 transition-all">
            <div className="text-lg mb-1">📓</div>
            <div className="text-sm font-medium text-[var(--text-primary)]">Your Journal</div>
            <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">Sessions &amp; memories</div>
          </Link>
          <Link href="/library" className="rounded-2xl border border-white/10 px-6 py-4 text-center text-[var(--text-primary)] hover:bg-white/5 transition-all">
            📚 Browse the Library
          </Link>
        </div>
      </div>

      <div className="text-center">
        <Link href="/account" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          Manage your plan →
        </Link>
      </div>
    </section>
  )
}

export default function MembershipPage() {
  return (
    <Suspense>
      <MembershipContent />
    </Suspense>
  )
}
