'use client'

import { FormEvent, useState, useRef, Suspense, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getBrowserSupabase } from '@/lib/supabase/client'
import { useSiteI18n } from '@/lib/site-i18n'
import TraditionPicker from '@/app/components/TraditionPicker'
import { PLAN_CONFIG, PlanId, TraditionId } from '@/lib/plans'

/* ─── Persistent debug log: survives re-renders ────────────────────── */
const debugLog: string[] = []
function addDebug(msg: string) {
  const ts = new Date().toISOString().slice(11, 23)
  const line = `[${ts}] ${msg}`
  debugLog.push(line)
  console.log('[signup-debug]', msg)
}

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
  const [debugLines, setDebugLines] = useState<string[]>([])

  // Ref guards prevent double-execution and track redirect state
  const inFlight = useRef(false)
  const redirecting = useRef(false)

  const cfg = PLAN_CONFIG[pendingPlan]
  const maxSlots = cfg?.slots === 'all' ? 99 : (cfg?.slots ?? 1)

  const pushDebug = useCallback((msg: string) => {
    addDebug(msg)
    // Only update state if we haven't started redirecting
    if (!redirecting.current) {
      setDebugLines([...debugLog])
    }
  }, [])

  /**
   * Calls the checkout API and redirects to Stripe.
   * Returns true if redirecting to Stripe, false if failed.
   */
  const doCheckout = async (accessToken: string, plan: PlanId): Promise<boolean> => {
    pushDebug(`doCheckout: plan=${plan}, token=${accessToken.substring(0, 20)}...`)

    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ plan }),
        redirect: 'manual', // DON'T follow redirects — we need to see them
      })

      pushDebug(`doCheckout response: status=${res.status}, type=${res.type}, redirected=${res.redirected}, url=${res.url}`)

      // If we got an opaqueredirect (3xx), that's a problem — the API shouldn't redirect
      if (res.type === 'opaqueredirect') {
        pushDebug('ERROR: API returned a redirect (3xx). This should not happen.')
        setError('Checkout API returned a redirect instead of JSON. Check Vercel middleware/config.')
        return false
      }

      const text = await res.text()
      pushDebug(`doCheckout body (first 500): ${text.substring(0, 500)}`)

      // Try to parse as JSON
      let data: Record<string, unknown> = {}
      try {
        data = JSON.parse(text)
      } catch {
        pushDebug('ERROR: Response is not JSON. Got HTML or something else.')
        data = { raw: text.substring(0, 200) }
      }

      if (data?.url && typeof data.url === 'string') {
        if (data.url.startsWith('https://checkout.stripe.com')) {
          pushDebug(`SUCCESS: Got Stripe URL, redirecting: ${(data.url as string).substring(0, 80)}...`)
          redirecting.current = true
          window.location.href = data.url as string
          return true
        } else {
          pushDebug(`WARNING: Got URL but not Stripe: ${data.url}`)
          // Still try to redirect
          redirecting.current = true
          window.location.href = data.url as string
          return true
        }
      }

      // No URL in response — show the error
      const detail = (data?.detail || data?.raw || 'No checkout URL in response') as string
      pushDebug(`FAIL: No URL. detail=${detail}`)
      setError(`Checkout failed: ${detail}`)
      return false
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      pushDebug(`doCheckout EXCEPTION: ${msg}`)
      setError(`Network error during checkout: ${msg}`)
      return false
    }
  }

  const onSignup = async (e: FormEvent) => {
    e.preventDefault()

    // Prevent double-submission
    if (inFlight.current || loading) {
      pushDebug('onSignup blocked: already in flight')
      return
    }
    inFlight.current = true
    setLoading(true) // stays true until the ENTIRE flow completes
    setError('')
    debugLog.length = 0 // clear previous log
    setDebugLines([])

    pushDebug(`onSignup start: plan=${pendingPlan}, email=${email}`)

    try {
      // ── Step 1: Sign up ──
      pushDebug('Step 1: signUp...')
      const supabase = getBrowserSupabase()
      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        pushDebug(`signUp error: ${signUpError.message}`)
        setError(signUpError.message)
        return // finally block handles cleanup
      }

      pushDebug(`signUp OK: user=${signUpData.user?.id?.substring(0, 8)}..., session=${signUpData.session ? 'yes' : 'NO'}`)

      // ── Step 2: Get session ──
      pushDebug('Step 2: getSession...')
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        pushDebug(`getSession error: ${sessionError.message}`)
      }

      const accessToken = sessionData?.session?.access_token
      const refreshToken = sessionData?.session?.refresh_token

      pushDebug(`session: accessToken=${accessToken ? accessToken.substring(0, 20) + '...' : 'NULL'}, refreshToken=${refreshToken ? 'yes' : 'NULL'}`)

      if (!accessToken || !refreshToken) {
        pushDebug('NO SESSION — likely email confirmation required')
        setError(
          'No session available after signup. This usually means email confirmation is required. ' +
          'Check your inbox, confirm your email, then log in at /login. ' +
          'To fix: disable "Confirm email" in Supabase → Authentication → Providers → Email.'
        )
        return
      }

      // ── Step 3: Sync session cookies for server-side ──
      pushDebug('Step 3: sync-session...')
      try {
        const syncRes = await fetch('/api/auth/sync-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
        })
        pushDebug(`sync-session: status=${syncRes.status}`)
      } catch (syncErr) {
        pushDebug(`sync-session failed (non-fatal): ${syncErr instanceof Error ? syncErr.message : String(syncErr)}`)
      }

      // Small delay to let cookies settle (browsers can be async with Set-Cookie processing)
      await new Promise(r => setTimeout(r, 100))

      // ── Step 4: Route based on plan ──
      if (pendingPlan !== 'free') {
        pushDebug(`Step 4: checkout for plan=${pendingPlan}`)
        const redirected = await doCheckout(accessToken, pendingPlan)
        if (redirected) {
          pushDebug('Redirect initiated — waiting...')
          return // page is navigating to Stripe
        }
        // Checkout failed — error is already set, debug is already shown
        pushDebug('Checkout did NOT redirect. Error should be visible above.')
        return
      }

      // ── Free plan ──
      pushDebug('Free plan — navigating to /account')
      redirecting.current = true
      router.push('/account')
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      pushDebug(`UNHANDLED ERROR: ${msg}`)
      setError(`Something went wrong: ${msg}`)
    } finally {
      // Only clear loading if we're NOT navigating away
      if (!redirecting.current) {
        setLoading(false)
      }
      inFlight.current = false
    }
  }

  const onSaveAndCheckout = async () => {
    if (inFlight.current || loading) return
    inFlight.current = true
    setLoading(true)
    setError('')
    debugLog.length = 0
    setDebugLines([])

    pushDebug(`onSaveAndCheckout: plan=${pendingPlan}, traditions=${selectedTraditions.join(',')}`)

    try {
      const supabase = getBrowserSupabase()
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData?.session?.access_token

      pushDebug(`session: token=${accessToken ? 'yes' : 'NO'}`)

      // Save traditions
      pushDebug('saving traditions...')
      await fetch('/api/account/traditions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ traditions: selectedTraditions }),
      })

      if (pendingPlan !== 'free' && accessToken) {
        const redirected = await doCheckout(accessToken, pendingPlan)
        if (redirected) return
        return
      }

      pushDebug('Free plan — going to /account')
      redirecting.current = true
      window.location.href = '/account'
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      pushDebug(`ERROR: ${msg}`)
      setError(msg)
    } finally {
      if (!redirecting.current) setLoading(false)
      inFlight.current = false
    }
  }

  // ── Debug panel ──
  const debugPanel = debugLines.length > 0 ? (
    <div className="rounded-xl bg-black/80 border border-yellow-500/50 p-4 text-yellow-200 text-xs font-mono whitespace-pre-wrap break-all max-h-60 overflow-y-auto">
      <div className="text-[10px] uppercase tracking-widest text-yellow-400 mb-2">
        Debug Log ({debugLines.length} entries)
      </div>
      {debugLines.map((line, i) => (
        <div key={i} className={line.includes('ERROR') || line.includes('FAIL') ? 'text-red-400' : line.includes('SUCCESS') ? 'text-green-400' : ''}>{line}</div>
      ))}
    </div>
  ) : null

  // ── Traditions step ──
  if (step === 'traditions') {
    return (
      <section className="mx-auto max-w-xl px-6 py-20">
        <div className="glass-card p-8 space-y-6">
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--primary-gold)]">{t('plans.' + pendingPlan)}</div>
          <h1 className="font-serif text-4xl text-[var(--text-primary)]">{t('traditionsPicker.title')}</h1>
          <p className="text-[var(--text-secondary)] text-sm">
            Choose up to {maxSlots} tradition{maxSlots > 1 ? 's' : ''} for your {t('plans.' + pendingPlan)} plan.
          </p>
          <TraditionPicker selected={selectedTraditions} onChange={setSelectedTraditions} max={maxSlots} />
          {error && <div className="rounded-xl bg-red-900/50 border border-red-500 p-4 text-red-200 text-sm">{error}</div>}
          {debugPanel}
          <button onClick={onSaveAndCheckout} disabled={loading}
            className="w-full rounded-full bg-[var(--primary-gold)] px-5 py-3 text-black font-medium disabled:opacity-50">
            {loading ? 'Processing…' : pendingPlan !== 'free' ? t('pricing.checkout') : t('account.save')}
          </button>
        </div>
      </section>
    )
  }

  // ── Signup step ──
  return (
    <section className="mx-auto max-w-xl px-6 py-20">
      <div className="glass-card p-8 space-y-6">
        <h1 className="font-serif text-4xl text-[var(--text-primary)]">{t('auth.signup.title')}</h1>
        {pendingPlan !== 'free' && (
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--primary-gold)]">
            Signing up for {PLAN_CONFIG[pendingPlan]?.name || pendingPlan} (${PLAN_CONFIG[pendingPlan]?.priceMonthly}/mo)
          </div>
        )}
        <form onSubmit={onSignup} className="space-y-4">
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            placeholder={t('auth.name')} value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            placeholder={t('auth.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            type="password" placeholder={t('auth.password')} value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="rounded-xl bg-red-900/50 border border-red-500 p-4 text-red-200 text-sm">{error}</div>}
          {debugPanel}
          <button disabled={loading}
            className="w-full rounded-full bg-[var(--primary-gold)] px-5 py-3 text-black font-medium disabled:opacity-50">
            {loading ? 'Processing — do not close this page…' : t('auth.submit')}
          </button>
        </form>
      </div>
    </section>
  )
}

export default function SignupPage() {
  return <Suspense><SignupForm /></Suspense>
}
