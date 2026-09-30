'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { PLAN_CONFIG, PlanId, TraditionId, TRADITIONS, normalizeSelectedTraditions } from '@/lib/plans'
import { useSiteI18n } from '@/lib/site-i18n'

const labels: Record<TraditionId, string> = {
  tao: 'Tao Oracle',
  tarot: 'Tarot Oracle',
  tantra: 'Tantra Oracle',
  entheogen: 'Esoteric Entheogen',
  sufi: 'Sufi Mystic',
  dreamwalker: 'Dreamwalker',
  'chaos-magick': 'Chaos Magick',
}

export default function AccountClient() {
  const auth = useAuth()
  const { t } = useSiteI18n()
  const router = useRouter()
  const [selected, setSelected] = useState<TraditionId[]>(() => {
    if (auth.plan === 'full') return [...TRADITIONS]
    if (auth.plan === 'guest') return auth.selectedTraditions.length ? auth.selectedTraditions : [...TRADITIONS]
    return auth.selectedTraditions
  })
  const slots = PLAN_CONFIG[auth.plan].slots

  useEffect(() => {
    if (auth.plan === 'full') {
      setSelected([...TRADITIONS])
    } else if (auth.plan === 'guest') {
      setSelected([...auth.selectedTraditions])
    }
  }, [auth.plan, auth.selectedTraditions])

  useEffect(() => {
    if (auth.plan === 'full') {
      setSelected([...TRADITIONS])
    } else {
      setSelected([...auth.selectedTraditions])
    }
  }, [auth.plan, auth.selectedTraditions])

  const toggle = async (tradition: TraditionId) => {
    if (auth.plan === 'full') return // full plan — all always active, nothing to toggle
    const next = selected.includes(tradition)
      ? selected.filter((t) => t !== tradition)
      : selected.length >= (PLAN_CONFIG[auth.plan].slots as number)
        ? selected // already at limit
        : [...selected, tradition]
    setSelected(next)
    if (auth.plan === 'guest') {
      // guest: immediately save after deselect
      await fetch('/api/account/traditions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ traditions: next }),
      })
      await auth.refresh()
    }
  }

  const save = async () => {
    const toSave = auth.plan === 'full' ? [...TRADITIONS] : normalizeSelectedTraditions(auth.plan, selected)
    await fetch('/api/account/traditions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ traditions: toSave }),
    })
    await auth.refresh()
  }

  const activateFree = async () => {
    await fetch('/api/billing/activate-free', { method: 'POST' })
    await auth.refresh()
  }

  const openPortal = async () => {
    const res = await fetch('/api/billing/portal', { method: 'POST' })
    const data = await res.json().catch(() => ({}))
    if (data?.url) window.location.href = data.url
  }

  if (auth.loading) return <div className="glass-card p-6">Loading…</div>
  if (!auth.isAuthenticated) {
    return (
      <div className="glass-card p-8 space-y-4">
        <div className="font-serif text-3xl text-[var(--text-primary)]">{t('account.title')}</div>
        <p className="text-[var(--text-secondary)]">Sign in to manage your plan and traditions.</p>
        <div className="flex gap-3">
          <button onClick={() => router.push('/login')} className="rounded-full bg-[var(--primary-gold)] px-4 py-2 text-black">{t('nav.login')}</button>
          <button onClick={() => router.push('/signup')} className="rounded-full border border-white/10 px-4 py-2 text-[var(--text-primary)]">{t('nav.signup')}</button>
        </div>
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 space-y-8">
      <div className="glass-card p-8">
        <div className="text-xs uppercase tracking-[0.25em] text-[var(--primary-gold)] mb-3">{t('account.plan')}</div>
        <div className="font-serif text-4xl mb-2 text-[var(--text-primary)]">{PLAN_CONFIG[auth.plan].name}</div>
        <div className="text-[var(--text-secondary)]">{auth.user?.email}</div>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="glass-card p-6 space-y-5">
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--primary-gold)]">{t('account.traditions')}</div>
          <div className="text-sm text-[var(--text-secondary)]">{slots === 'all' ? 'All traditions are available on your plan.' : `Choose ${slots} tradition slot${Number(slots) > 1 ? 's' : ''}.`}</div>
          <div className="grid sm:grid-cols-2 gap-3">
            {TRADITIONS.map((tradition) => {
              const active = auth.plan === 'full' || slots === 'all' || selected.includes(tradition)
              return (
                <button
                  key={tradition}
                  type="button"
                  onClick={() => { toggle(tradition); void save() }}
                  className={`glass-card p-4 text-left transition-all cursor-pointer ${active ? 'border-[var(--primary-purple)]/40 bg-[var(--primary-purple)]/10' : 'border-[var(--primary-gold)]/30 bg-[var(--primary-gold)]/5 hover:border-[var(--primary-gold)]/60'}`}
                >
                  <div className="font-medium text-[var(--text-primary)]">{active ? '✓ ' : '○ '}{labels[tradition]}</div>
                </button>
              )
            })}
          </div>
          <button onClick={save} className="rounded-full bg-[var(--primary-gold)] px-5 py-3 text-black">{t('account.save')}</button>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--primary-gold)]">Billing</div>
          <p className="text-[var(--text-secondary)] leading-7">Upgrade, manage your subscription, or activate the free one-tradition plan.</p>
          <div className="flex flex-wrap gap-3">
            {auth.plan === 'guest' && (
              <button onClick={activateFree} className="rounded-full bg-[var(--primary-gold)] px-4 py-2 text-black">{t('pricing.free.activate')}</button>
            )}
            <button onClick={() => router.push('/pricing')} className="rounded-full border border-white/10 px-4 py-2 text-[var(--text-primary)]">{t('nav.pricing')}</button>
            {/*
              Win-back (added 2026-09-30). A lapsed member — someone with a
              Stripe subscription on record that is no longer active — used to
              land here looking identical to a brand-new free user, with no
              reason to return. This only renders when the database actually
              shows billing history, so we never imply a past payment that
              didn't happen.
            */}
            {auth.isLapsedMember && (
              <div className="mt-6 w-full rounded-2xl border border-[var(--primary-gold)]/30 bg-[var(--primary-gold)]/[0.05] p-6">
                <h2 className="font-serif text-xl text-[var(--primary-gold)]">
                  Your tradition access is still here
                </h2>
                <p className="mt-2 max-w-prose text-sm leading-6 text-[var(--text-secondary)]">
                  Your membership has ended, so your account is back on the free
                  plan. Every tradition you chose is saved — reactivate and your
                  selections come straight back.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => router.push('/pricing')}
                    className="rounded-full bg-[var(--primary-gold)] px-5 py-2.5 text-sm text-black"
                  >
                    Reactivate my membership
                  </button>
                  {auth.hasBillingHistory && (
                    <button
                      onClick={openPortal}
                      className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-[var(--text-primary)]"
                    >
                      Manage billing
                    </button>
                  )}
                </div>
              </div>
            )}

            {(auth.plan === 'seeker' || auth.plan === 'adept' || auth.plan === 'full') && (
              <button onClick={openPortal} className="rounded-full border border-white/10 px-4 py-2 text-[var(--text-primary)]">{t('account.portal')}</button>
            )}
          </div>
          <button onClick={() => auth.logout()} className="rounded-full border border-white/10 px-4 py-2 text-[var(--text-primary)]">{t('account.logout')}</button>
        </div>
      </div>
    </section>
  )
}
