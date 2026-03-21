'use client'

import { FormEvent, useState, useRef, Suspense, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getBrowserSupabase } from '@/lib/supabase/client'
import { useSiteI18n } from '@/lib/site-i18n'
import TraditionPicker from '@/app/components/TraditionPicker'
import { PLAN_CONFIG, PlanId, TraditionId } from '@/lib/plans'

/* ─── Password visibility toggle ─────────────────────────── */
function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function PasswordInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string
  value: string
  onChange: (v: string) => void
}) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <input
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 outline-none"
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="new-password"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
        tabIndex={-1}
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        <EyeIcon open={visible} />
      </button>
    </div>
  )
}

/* ─── Persistent debug log ────────────────────────────────── */
const debugLog: string[] = []
function addDebug(msg: string) {
  const ts = new Date().toISOString().slice(11, 23)
  debugLog.push(`[${ts}] ${msg}`)
  console.log('[signup-debug]', msg)
}

/* ─── Email verification banner ──────────────────────────── */
function VerifyEmailBanner({ email }: { email: string }) {
  return (
    <section className="mx-auto max-w-xl px-6 py-20">
      <div className="glass-card p-8 space-y-6 text-center">
        <div className="text-5xl">✉</div>
        <h1 className="font-serif text-3xl text-[var(--text-primary)]">Check Your Email</h1>
        <p className="text-[var(--text-secondary)] leading-7">
          We sent a verification link to <span className="text-[var(--text-primary)] font-medium">{email}</span>.
          Click the link in the email to activate your account, then come back and log in.
        </p>
        <div className="text-[var(--text-secondary)] text-sm space-y-2">
          <p>The link will expire in 24 hours.</p>
          <p>If you don't see it, check your spam folder.</p>
        </div>
        <a
          href="/login"
          className="inline-block rounded-full bg-[var(--primary-gold)] px-6 py-3 text-black font-medium"
        >
          Go to Login
        </a>
      </div>
    </section>
  )
}

/* ─── Main form ──────────────────────────────────────────── */
function SignupForm() {
  const router = useRouter()
  const params = useSearchParams()
  const { t } = useSiteI18n()

  const planParam = params.get('plan') as PlanId | null
  const pendingPlan: PlanId = (planParam && planParam in PLAN_CONFIG) ? planParam : 'free'

  const [step, setStep] = useState<'signup' | 'traditions' | 'verify'>(
    params.get('step') === 'traditions' ? 'traditions' : 'signup'
  )
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedTraditions, setSelectedTraditions] = useState<TraditionId[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [debugLines, setDebugLines] = useState<string[]>([])

  const inFlight = useRef(false)
  const redirecting = useRef(false)

  const cfg = PLAN_CONFIG[pendingPlan]
  const maxSlots = cfg?.slots === 'all' ? 99 : (cfg?.slots ?? 1)

  const pushDebug = useCallback((msg: string) => {
    addDebug(msg)
    if (!redirecting.current) setDebugLines([...debugLog])
  }, [])

  /* ─── Checkout helper ─── */
  const doCheckout = async (accessToken: string, plan: PlanId): Promise<boolean> => {
    pushDebug(`doCheckout: plan=${plan}`)
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ plan }),
        redirect: 'manual',
      })
      pushDebug(`response: status=${res.status}, type=${res.type}`)
      if (res.type === 'opaqueredirect') {
        setError('Checkout API returned a redirect instead of JSON.')
        return false
      }
      const text = await res.text()
      pushDebug(`body: ${text.substring(0, 500)}`)
      let data: Record<string, unknown> = {}
      try { data = JSON.parse(text) } catch { data = { raw: text.substring(0, 200) } }
      if (data?.url && typeof data.url === 'string') {
        pushDebug(`Redirecting to Stripe`)
        redirecting.current = true
        window.location.href = data.url as string
        return true
      }
      setError(`Checkout failed: ${(data?.detail as string) || 'No checkout URL returned'}`)
      return false
    } catch (err) {
      setError(`Network error: ${err instanceof Error ? err.message : String(err)}`)
      return false
    }
  }

  /* ─── Signup handler ─── */
  const onSignup = async (e: FormEvent) => {
    e.preventDefault()
    if (inFlight.current || loading) return
    inFlight.current = true
    setLoading(true)
    setError('')
    debugLog.length = 0
    setDebugLines([])

    // Client-side validation
    if (!name.trim()) { setError('Please enter your name.'); setLoading(false); inFlight.current = false; return }
    if (!email.trim()) { setError('Please enter your email.'); setLoading(false); inFlight.current = false; return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); inFlight.current = false; return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); setLoading(false); inFlight.current = false; return }

    pushDebug(`signUp: plan=${pendingPlan}, email=${email}`)

    try {
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
        return
      }

      pushDebug(`signUp OK: user=${signUpData.user?.id?.substring(0, 8)}, session=${signUpData.session ? 'yes' : 'no'}`)

      // If Supabase requires email confirmation, there's no session
      if (!signUpData.session) {
        pushDebug('No session — email confirmation required. Showing verification screen.')
        setStep('verify')
        return
      }

      // Session exists — sync cookies and proceed
      const accessToken = signUpData.session.access_token
      const refreshToken = signUpData.session.refresh_token

      pushDebug('Syncing session cookies...')
      try {
        await fetch('/api/auth/sync-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
        })
      } catch (syncErr) {
        pushDebug(`sync-session failed (non-fatal): ${syncErr instanceof Error ? syncErr.message : String(syncErr)}`)
      }

      await new Promise(r => setTimeout(r, 100))

      if (pendingPlan !== 'free') {
        pushDebug(`Checkout for plan=${pendingPlan}`)
        const redirected = await doCheckout(accessToken, pendingPlan)
        if (redirected) return
        return
      }

      pushDebug('Free plan — going to /account')
      redirecting.current = true
      router.push('/account')
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      pushDebug(`UNHANDLED: ${msg}`)
      setError(`Something went wrong: ${msg}`)
    } finally {
      if (!redirecting.current) setLoading(false)
      inFlight.current = false
    }
  }

  /* ─── Save traditions + checkout ─── */
  const onSaveAndCheckout = async () => {
    if (inFlight.current || loading) return
    inFlight.current = true
    setLoading(true)
    setError('')

    try {
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

      if (pendingPlan !== 'free' && accessToken) {
        const redirected = await doCheckout(accessToken, pendingPlan)
        if (redirected) return
        return
      }

      redirecting.current = true
      window.location.href = '/account'
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      if (!redirecting.current) setLoading(false)
      inFlight.current = false
    }
  }

  // ── Debug panel ──
  const debugPanel = debugLines.length > 0 ? (
    <div className="rounded-xl bg-black/80 border border-yellow-500/50 p-4 text-yellow-200 text-xs font-mono whitespace-pre-wrap break-all max-h-48 overflow-y-auto">
      <div className="text-[10px] uppercase tracking-widest text-yellow-400 mb-2">Debug ({debugLines.length})</div>
      {debugLines.map((line, i) => (
        <div key={i} className={line.includes('ERROR') || line.includes('FAIL') ? 'text-red-400' : line.includes('SUCCESS') ? 'text-green-400' : ''}>{line}</div>
      ))}
    </div>
  ) : null

  // ── Email verification step ──
  if (step === 'verify') {
    return <VerifyEmailBanner email={email} />
  }

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
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            placeholder={t('auth.name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            placeholder={t('auth.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <PasswordInput
            placeholder={t('auth.password')}
            value={password}
            onChange={setPassword}
          />
          <PasswordInput
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
          {password && confirmPassword && password !== confirmPassword && (
            <div className="text-[#E05C5C] text-sm">Passwords do not match</div>
          )}
          {error && <div className="rounded-xl bg-red-900/50 border border-red-500 p-4 text-red-200 text-sm">{error}</div>}
          {debugPanel}
          <button
            disabled={loading || (!!confirmPassword && password !== confirmPassword)}
            className="w-full rounded-full bg-[var(--primary-gold)] px-5 py-3 text-black font-medium disabled:opacity-50"
          >
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
