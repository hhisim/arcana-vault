'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { PLAN_CONFIG, PlanId } from '@/lib/plans'
import { useSiteI18n } from '@/lib/site-i18n'

async function postJson(url: string, body?: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  return res.json().catch(() => ({}))
}

export default function PricingPage() {
  const router = useRouter()
  const auth = useAuth()
  const { t } = useSiteI18n()

  const begin = async (plan: PlanId) => {
    if (!auth.isAuthenticated) {
      router.push(`/signup?returnTo=/pricing`)
      return
    }
    if (plan === 'free') {
      await postJson('/api/billing/activate-free')
      await auth.refresh()
      router.push('/account')
      return
    }
    const data = await postJson('/api/billing/checkout', { plan })
    if (data?.url) window.location.href = data.url
  }

  const plans: PlanId[] = ['free', 'seeker', 'adept', 'full']

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-3xl mb-12">
        <h1 className="font-serif text-5xl text-[var(--text-primary)] mb-4">{t('pricing.title')}</h1>
        <p className="text-[var(--text-secondary)] leading-8">{t('pricing.subtitle')}</p>
        <p className="text-[var(--primary-gold)] mt-4">{t('pricing.note')}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const cfg = PLAN_CONFIG[plan]
          const isCurrent = auth.plan === plan
          return (
            <div key={plan} className="glass-card p-6 flex flex-col gap-4">
              <div className="text-xs uppercase tracking-[0.25em] text-[var(--primary-gold)]">{cfg.name}</div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-3xl text-[var(--text-primary)]">{cfg.priceMonthly ? `$${cfg.priceMonthly}` : 'Free'}</span>
                {cfg.priceMonthly && <span className="text-[var(--text-secondary)] text-sm">/month</span>}
              </div>
              <div className="text-[var(--text-secondary)] leading-7">{cfg.description}</div>
              <div className="text-sm text-[var(--text-primary)]">{cfg.slots === 'all' ? 'All traditions' : `${cfg.slots} tradition slot${Number(cfg.slots) > 1 ? 's' : ''}`}</div>
              <div className="text-sm text-[var(--text-primary)]">Daily: {cfg.dailyLimit === 'unlimited' ? 'Unlimited' : cfg.dailyLimit}</div>
              {isCurrent ? (
                <div className="rounded-full border border-[var(--primary-gold)]/40 px-4 py-2 text-center text-[var(--primary-gold)]">{t('pricing.current')}</div>
              ) : (
                <button onClick={() => begin(plan)} className="rounded-full bg-[var(--primary-gold)] px-4 py-3 text-black font-medium">
                  {plan === 'free' ? t('pricing.free.activate') : t('pricing.checkout')}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
