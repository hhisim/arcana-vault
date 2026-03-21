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
  const [debugInfo, setDebugInfo] = useState('')

  const cfg = PLAN_CONFIG[pendingPlan]
  const maxSlots = cfg?.slots === 'all' ? 99 : (cfg?.slots ?? 1)

  // BATTLE DEBUG
  console.log('[signup] pendingPlan:', pendingPlan, '| step:', step)

  const onSignup = async (e: FormEvent) => {
    e.preventDefault()
    if (loading) return  // re-entrance guard
    setLoading(true)
    setError('')
    setDebugInfo('')

    try {
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

      // CRITICAL: sync Supabase session to server-side cookies before calling billing APIs
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData?.session?.access_token
      const refreshToken = sessionData?.session?.refresh_token
      if (!accessToken || !refreshToken) {
        setError('Session error — please refresh the page and try again.')
        setLoading(false)
        return
      }

      try {
        await fetch('/api/auth/sync-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
        })
      } catch (syncErr) {
        setDebugInfo(`sync-session failed: ${syncErr instanceof Error ? syncErr.message : String(syncErr)}`)
      }

      if (pendingPlan !== 'free') {
        setDebugInfo('initiating checkout...')
        const res = await fetch('/api/billing/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ plan: pendingPlan }),
        })
        const text = await res.text()
        setDebugInfo(`checkout status: ${res.status}\nbody: ${text.substring(0, 800)}`)
        let data: Record<string, unknown> = {}
        try { data = JSON.parse(text) } catch { data = { raw: text } }
        if (data?.url) { window.location.href = data.url as string; return }
        if (!data.url) {
          setError(`Checkout failed: ${data.detail || text.substring(0, 200)}`)
        }
        setLoading(false)
        return
      }
      router.push('/account')
    } catch (err) {
      setLoading(false)
      const msg = err instanceof Error ? err.message : String(err)
      setError(msg)
      setDebugInfo(`Unhandled error: ${msg}`)
    }
  }

  const onSaveAndCheckout = async () => {
    setLoading(true)
    const supabase = getBrowserSupabase()
    const { data: sessionData } = await supabase.auth.getSession()
    const accessToken = sessionData?.session?.access_token

    await fetch('/api/account/traditions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ traditions: selectedTraditions }),
    })
    // For paid plans, call Stripe checkout
    if (pendingPlan !== 'free') {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ plan: pendingPlan }),
      })
      const text = await res.text()
      setDebugInfo(`checkout status: ${res.status}\nbody: ${text.substring(0, 500)}`)
      let data: Record<string, unknown> = {}
      try { data = JSON.parse(text) } catch { data = { raw: text } }
      if (data?.url) { window.location.href = data.url as string; return }
      setLoading(false)
      return
    }
    window.location.href = '/account'
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
          {debugInfo && (
            <div className="rounded-xl bg-red-900/50 border border-red-500 p-4 text-red-200 text-sm font-mono whitespace-pre-wrap">{debugInfo}</div>
          )}
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
          {debugInfo && (
            <div className="rounded-xl bg-red-900/50 border border-red-500 p-4 text-red-200 text-sm font-mono whitespace-pre-wrap">{debugInfo}</div>
          )}
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
