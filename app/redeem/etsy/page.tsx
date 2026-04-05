'use client'

import { FormEvent, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getBrowserSupabase } from '@/lib/supabase/client'

/* ─── Eye icon ─── */
function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
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

export default function RedeemEtsyPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'verify' | 'done'>('form')
  const inFlight = useRef(false)

  const onRedeem = async (e: FormEvent) => {
    e.preventDefault()
    if (inFlight.current || loading) return
    inFlight.current = true
    setLoading(true)
    setError('')

    // Validation
    if (!name.trim()) { setError('Please enter your name.'); setLoading(false); inFlight.current = false; return }
    if (!email.trim()) { setError('Please enter your email.'); setLoading(false); inFlight.current = false; return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); inFlight.current = false; return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); setLoading(false); inFlight.current = false; return }

    try {
      const supabase = getBrowserSupabase()

      // 1. Sign up
      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback?promo=etsy&plan=seeker&days=30`,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      // If no session → email confirmation required
      if (!signUpData.session) {
        setStep('verify')
        return
      }

      // 2. Sync session
      const accessToken = signUpData.session.access_token
      const refreshToken = signUpData.session.refresh_token

      await fetch('/api/auth/sync-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
      }).catch(() => {})

      // 3. Activate trial
      const res = await fetch('/api/billing/activate-trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ promo: 'etsy', plan: 'seeker', days: 30 }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError((data as any)?.detail || 'Failed to activate your trial. Please contact support.')
        return
      }

      setStep('done')

      // Redirect to account after a brief celebration
      setTimeout(() => router.push('/account'), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
      inFlight.current = false
    }
  }

  // ── Email verification screen ──
  if (step === 'verify') {
    return (
      <section className="mx-auto max-w-xl px-6 py-20">
        <div className="glass-card p-8 space-y-6 text-center">
          <div className="text-5xl">✉</div>
          <h1 className="font-serif text-3xl text-[var(--text-primary)]">Check Your Email</h1>
          <p className="text-[var(--text-secondary)] leading-7">
            We sent a verification link to <span className="text-[var(--text-primary)] font-medium">{email}</span>.
            Confirm your email, then log in — your 30-day Seeker trial will activate automatically.
          </p>
          <a href="/login" className="inline-block rounded-full bg-[var(--primary-gold)] px-6 py-3 text-black font-medium">
            Go to Login
          </a>
        </div>
      </section>
    )
  }

  // ── Success screen ──
  if (step === 'done') {
    return (
      <section className="mx-auto max-w-xl px-6 py-20">
        <div className="glass-card p-8 space-y-6 text-center">
          <div className="text-5xl">✦</div>
          <h1 className="font-serif text-3xl text-[var(--text-primary)]">Welcome, Seeker</h1>
          <p className="text-[var(--text-secondary)] leading-7">
            Your 30-day Seeker trial is active. You have full access to 3 traditions,
            60 daily questions, and the complete oracle system.
          </p>
          <div className="rounded-2xl border border-[var(--primary-gold)]/30 bg-[var(--primary-gold)]/5 px-6 py-4">
            <div className="text-[var(--primary-gold)] font-medium">30 days remaining</div>
            <div className="text-[var(--text-secondary)] text-sm mt-1">No card required. Subscribe anytime to continue after the trial.</div>
          </div>
          <p className="text-[var(--text-secondary)] text-sm">Redirecting to your account…</p>
        </div>
      </section>
    )
  }

  // ── Signup form ──
  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <div className="glass-card p-8 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--primary-gold)]">Etsy Exclusive</div>
          <h1 className="font-serif text-4xl text-[var(--text-primary)]">Claim Your Free Month</h1>
          <p className="text-[var(--text-secondary)] leading-7 max-w-md mx-auto">
            Thank you for your Etsy purchase. Create your account below to unlock
            <span className="text-[var(--text-primary)] font-medium"> 30 days of Seeker access</span> —
            3 oracle traditions, 60 daily questions, and the full correspondence engine.
          </p>
        </div>

        {/* What you get */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '◎', label: '3 Traditions' },
            { icon: '✦', label: '60 Questions/Day' },
            { icon: '⚗', label: 'Correspondence Codex' },
          ].map((item) => (
            <div key={item.label} className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="text-lg mb-1">{item.icon}</div>
              <div className="text-[var(--text-secondary)] text-xs">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={onRedeem} className="space-y-4">
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <div className="relative">
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 outline-none"
              type={showPw ? 'text' : 'password'}
              placeholder="Password (6+ characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors" tabIndex={-1}>
              <EyeIcon open={showPw} />
            </button>
          </div>
          <div className="relative">
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 outline-none"
              type={showPw ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          {password && confirmPassword && password !== confirmPassword && (
            <div className="text-[#E05C5C] text-sm">Passwords do not match</div>
          )}
          {error && <div className="rounded-xl bg-red-900/50 border border-red-500 p-4 text-red-200 text-sm">{error}</div>}
          <button
            disabled={loading || (!!confirmPassword && password !== confirmPassword)}
            className="w-full rounded-full bg-[var(--primary-gold)] px-5 py-3 text-black font-medium disabled:opacity-50"
          >
            {loading ? 'Activating…' : 'Claim Your Free Month'}
          </button>
        </form>

        <div className="text-center text-[var(--text-secondary)] text-xs leading-5">
          No credit card required. After 30 days you can subscribe to continue or your account
          will switch to the free plan automatically. Already have an account? <a href="/login" className="text-[var(--primary-gold)] hover:underline">Log in</a>
        </div>
      </div>
    </section>
  )
}
