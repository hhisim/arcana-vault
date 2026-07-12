'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { PLAN_CONFIG, PlanId, LAUNCH_DISCOUNT_PERCENT, getLaunchPrice, formatUsd } from '@/lib/plans'
import { useSiteI18n } from '@/lib/site-i18n'

export default function PricingPage() {
  const router = useRouter()
  const auth = useAuth()
  const { t } = useSiteI18n()

  const begin = async (plan: PlanId) => {
    console.log('[pricing] begin clicked, plan:', plan, 'auth:', auth.plan, auth.isAuthenticated)
    if (!auth.isAuthenticated) {
      console.log('[pricing] not auth, redirecting to signup')
      router.push(`/signup?plan=${plan}&returnTo=/pricing`)
      return
    }
    // Every plan begins with a tradition choice. For signed-in members this preserves
    // the selected plan in the URL and avoids sending Stripe customers into a locked account.
    router.push(`/signup?plan=${plan}&step=traditions`)
    return
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

      {/* Launch offer banner */}
      <div className="mb-8 rounded-2xl border border-[var(--primary-gold)]/30 bg-[var(--primary-gold)]/5 p-6 text-center">
        <p className="text-[var(--primary-gold)] text-sm uppercase tracking-widest mb-2">{t('pricing.launch.banner')}</p>
        <p className="text-[var(--text-primary)] text-2xl font-serif">{t('pricing.launch.headline')}</p>
        <p className="text-[var(--text-secondary)] mt-2">{t('pricing.launch.code')} <span className="text-[var(--primary-gold)] font-mono font-bold">LAUNCH30</span> {t('pricing.launch.at_checkout')} — {LAUNCH_DISCOUNT_PERCENT}% off your first 3 months.</p>
      </div>

      {/* Feature comparison table */}
      <div className="mb-12 overflow-x-auto">
        <table className="w-full text-sm mb-8">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-[#9B93AB] font-medium">Feature</th>
              <th className="text-center py-3 px-4 text-[#9B93AB] font-medium">Free</th>
              <th className="text-center py-3 px-4 text-[var(--primary-gold)] font-medium">Seeker {formatUsd(getLaunchPrice(PLAN_CONFIG.seeker.priceMonthly))}</th>
              <th className="text-center py-3 px-4 text-[var(--primary-gold)] font-medium">Adept {formatUsd(getLaunchPrice(PLAN_CONFIG.adept.priceMonthly))}</th>
              <th className="text-center py-3 px-4 text-[var(--primary-gold)] font-medium">Magister {formatUsd(getLaunchPrice(PLAN_CONFIG.full.priceMonthly))}</th>
            </tr>
          </thead>
          <tbody className="text-[var(--text-secondary)]">
            <tr className="border-b border-white/5"><td className="py-3 pr-4">Traditions</td><td className="text-center py-3 px-4">1</td><td className="text-center py-3 px-4">3</td><td className="text-center py-3 px-4">4</td><td className="text-center py-3 px-4">All</td></tr>
            <tr className="border-b border-white/5"><td className="py-3 pr-4">Daily Questions</td><td className="text-center py-3 px-4">12</td><td className="text-center py-3 px-4">60</td><td className="text-center py-3 px-4">Unlimited</td><td className="text-center py-3 px-4">Unlimited</td></tr>
            <tr className="border-b border-white/5"><td className="py-3 pr-4">Voice Oracle</td><td className="text-center py-3 px-4">—</td><td className="text-center py-3 px-4">✓</td><td className="text-center py-3 px-4">✓</td><td className="text-center py-3 px-4">✓</td></tr>
            <tr className="border-b border-white/5"><td className="py-3 pr-4">Correspondence Codex</td><td className="text-center py-3 px-4">✓</td><td className="text-center py-3 px-4">✓</td><td className="text-center py-3 px-4">✓</td><td className="text-center py-3 px-4">✓</td></tr>
            <tr className="border-b border-white/5"><td className="py-3 pr-4">Library Access</td><td className="text-center py-3 px-4">Basic</td><td className="text-center py-3 px-4">Extended</td><td className="text-center py-3 px-4">Full</td><td className="text-center py-3 px-4">Full</td></tr>
            <tr className="border-b border-white/5"><td className="py-3 pr-4">The Scroll (Essays)</td><td className="text-center py-3 px-4">✓</td><td className="text-center py-3 px-4">✓</td><td className="text-center py-3 px-4">✓</td><td className="text-center py-3 px-4">✓</td></tr>
            <tr className="border-b border-white/5"><td className="py-3 pr-4">Journal & Inquiry</td><td className="text-center py-3 px-4">—</td><td className="text-center py-3 px-4">✓</td><td className="text-center py-3 px-4">✓</td><td className="text-center py-3 px-4">✓</td></tr>
            <tr className="border-b border-white/5"><td className="py-3 pr-4">Priority Support</td><td className="text-center py-3 px-4">—</td><td className="text-center py-3 px-4">—</td><td className="text-center py-3 px-4">—</td><td className="text-center py-3 px-4">✓</td></tr>
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const cfg = PLAN_CONFIG[plan]
          const isCurrent = auth.plan === plan
          const isAdept = plan === 'adept'
          const label = planLabels[plan]
          return (
            <div key={plan} className={`glass-card p-6 flex flex-col gap-4 ${isAdept ? 'border-[var(--primary-gold)]/50 shadow-[0_0_30px_rgba(201,168,76,0.15)]' : ''}`}>
              {isAdept && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[var(--primary-gold)] text-black text-xs font-bold px-3 py-1 rounded-full">{t('plans.most_popular')}</span>
                </div>
              )}
              <div className="text-xs uppercase tracking-[0.25em] text-[var(--primary-gold)]">{label.name}</div>
              <div className="flex items-baseline gap-2 flex-wrap">
                {cfg.priceMonthly ? (
                  <>
                    <span className="font-serif text-3xl text-[var(--text-primary)]">{formatUsd(getLaunchPrice(cfg.priceMonthly))}</span>
                    <span className="text-[var(--text-secondary)] text-sm">/month</span>
                    <span className="text-xs text-[var(--text-secondary)] line-through opacity-70">{formatUsd(cfg.priceMonthly)}</span>
                  </>
                ) : (
                  <span className="font-serif text-3xl text-[var(--text-primary)]">{t('plans.free', 'Free')}</span>
                )}
              </div>
              {cfg.priceMonthly && (
                <div className="text-xs text-[var(--primary-gold)]">Launch price with code LAUNCH30 for the first 3 months.</div>
              )}
              <div className="text-[var(--text-secondary)] leading-7">{label.desc}</div>
              <div className="text-sm text-[var(--text-primary)]">
                {cfg.slots === 'all'
                  ? t('traditionsPicker.all', 'Study all traditions')
                  : `Study ${cfg.slots} tradition${Number(cfg.slots) > 1 ? 's' : ''}`
                }
              </div>
              <div className="text-sm text-[var(--text-primary)]">
                {t('chat.meter.daily', 'Daily')}: {cfg.dailyLimit === 'unlimited' ? t('chat.meter.unlimited', 'Unlimited') : cfg.dailyLimit}
              </div>
              {isCurrent ? (
                <div className="rounded-full border border-[var(--primary-gold)]/40 px-4 py-2 text-center text-[var(--primary-gold)]">{t('pricing.current', 'Current Plan')}</div>
              ) : (
                <button onClick={() => begin(plan)} className={`rounded-full px-4 py-3 font-medium ${isAdept ? 'bg-[var(--primary-gold)] text-black hover:opacity-90' : 'bg-[var(--primary-gold)] text-black hover:opacity-90'}`}>
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
