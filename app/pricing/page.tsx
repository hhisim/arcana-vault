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
      router.push(`/signup?plan=${plan}&returnTo=/pricing`)
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

  const planLabels: Record<string, { name: string; desc: string }> = {
    free:    { name: t('plans.free',    PLAN_CONFIG.free.name),
               desc: t('plans.free.desc',  PLAN_CONFIG.free.description) },
    seeker:  { name: t('plans.seeker',  PLAN_CONFIG.seeker.name),
               desc: t('plans.seeker.desc', PLAN_CONFIG.seeker.description) },
    adept:   { name: t('plans.adept',   PLAN_CONFIG.adept.name),
               desc: t('plans.adept.desc',  PLAN_CONFIG.adept.description) },
    full:    { name: t('plans.full',    PLAN_CONFIG.full.name),
               desc: t('plans.full.desc',   PLAN_CONFIG.full.description) },
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-3xl mb-12">
        <h1 className="font-serif text-5xl text-[var(--text-primary)] mb-4">{t('pricing.title')}</h1>
        <p className="text-[var(--text-secondary)] leading-8">{t('pricing.subtitle')}</p>
        <p className="text-[var(--primary-gold)] mt-4">{t('pricing.note')}</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const cfg = PLAN_CONFIG[plan]
          const isCurrent = auth.plan === plan
          const label = planLabels[plan]
          return (
            <div key={plan} className="glass-card p-6 flex flex-col gap-4">
              <div className="text-xs uppercase tracking-[0.25em] text-[var(--primary-gold)]">{label.name}</div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-3xl text-[var(--text-primary)]">{cfg.priceMonthly ? `$${cfg.priceMonthly}` : t('plans.free', 'Free')}</span>
                {cfg.priceMonthly && <span className="text-[var(--text-secondary)] text-sm">/month</span>}
              </div>
              <div className="text-[var(--text-secondary)] leading-7">{label.desc}</div>
              <div className="text-sm text-[var(--text-primary)]">
                {cfg.slots === 'all' ? t('traditionsPicker.all', 'All traditions') : `${cfg.slots} ${t('traditionsPicker.title', 'tradition slot').toLowerCase()}${Number(cfg.slots) > 1 ? 's' : ''}`}
              </div>
              <div className="text-sm text-[var(--text-primary)]">
                {t('chat.meter.daily', 'Daily')}: {cfg.dailyLimit === 'unlimited' ? t('chat.meter.unlimited', 'Unlimited') : cfg.dailyLimit}
              </div>
              {isCurrent ? (
                <div className="rounded-full border border-[var(--primary-gold)]/40 px-4 py-2 text-center text-[var(--primary-gold)]">{t('pricing.current', 'Current Plan')}</div>
              ) : (
                <button onClick={() => begin(plan)} className="rounded-full bg-[var(--primary-gold)] px-4 py-3 text-black font-medium">
                  {plan === 'free' ? t('pricing.free.activate', 'Activate Free Plan') : t('pricing.checkout', 'Subscribe')}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
