'use client'

import { FormEvent, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getBrowserSupabase } from '@/lib/supabase/client'
import { useSiteI18n } from '@/lib/site-i18n'
import TraditionPicker from '@/app/components/TraditionPicker'
import { PLAN_CONFIG, PlanId, TraditionId } from '@/lib/plans'

function SignupForm() {
  const router = useRouter()
  const params = useSearchParams()
  const { t } = useSiteI18n()

  const planParam = params.get('plan') as PlanId | null
  const pendingPlan: PlanId = (planParam && planParam in PLAN_CONFIG) ? planParam : 'free'

  const [step, setStep] = useState<'signup' | 'traditions'>(
    params.get('step') === 'traditions' ? 'traditions' : 'signup'
  )
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedTraditions, setSelectedTraditions] = useState<TraditionId[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const cfg = PLAN_CONFIG[pendingPlan]
  const maxSlots = cfg?.slots === 'all' ? 99 : (cfg?.slots ?? 1)

  const onSignup = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = getBrowserSupabase()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    // Go to traditions step if it's a paid plan, otherwise skip to account
    if (pendingPlan !== 'free') {
      setStep('traditions')
    } else {
      router.push('/account')
    }
  }

  const onSaveAndCheckout = async () => {
    setLoading(true)
    const supabase = getBrowserSupabase()
    await fetch('/api/account/traditions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ traditions: selectedTraditions }),
    })
    // For paid plans, call Stripe checkout
    if (pendingPlan !== 'free') {
      const data = await (await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: pendingPlan }),
      })).json()
      if (data?.url) { window.location.href = data.url; return }
    }
    router.push('/account')
  }

  if (step === 'traditions') {
    return (
      <section className="mx-auto max-w-xl px-6 py-20">
        <div className="glass-card p-8 space-y-6">
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--primary-gold)]">{t('plans.' + pendingPlan)}</div>
          <h1 className="font-serif text-4xl text-[var(--text-primary)]">{t('traditionsPicker.title')}</h1>
          <p className="text-[var(--text-secondary)] text-sm">
            Choose up to {maxSlots} tradition{maxSlots > 1 ? 's' : ''} for your {t('plans.' + pendingPlan)} plan.
          </p>
          <TraditionPicker
            selected={selectedTraditions}
            onChange={setSelectedTraditions}
            max={maxSlots}
          />
          <button
            onClick={onSaveAndCheckout}
            disabled={loading}
            className="w-full rounded-full bg-[var(--primary-gold)] px-5 py-3 text-black font-medium"
          >
            {pendingPlan !== 'free' ? t('pricing.checkout') : t('account.save')}
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-20">
      <div className="glass-card p-8 space-y-6">
        <h1 className="font-serif text-4xl text-[var(--text-primary)]">{t('auth.signup.title')}</h1>
        <form onSubmit={onSignup} className="space-y-4">
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" placeholder={t('auth.name')} value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" placeholder={t('auth.email')} value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" type="password" placeholder={t('auth.password')} value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="text-[#E05C5C] text-sm">{error}</div>}
          <button disabled={loading} className="w-full rounded-full bg-[var(--primary-gold)] px-5 py-3 text-black font-medium">{t('auth.submit')}</button>
        </form>
      </div>
    </section>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
