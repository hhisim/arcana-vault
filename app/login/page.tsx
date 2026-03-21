'use client'

import { FormEvent, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getBrowserSupabase } from '@/lib/supabase/client'
import { useSiteI18n } from '@/lib/site-i18n'

/* ─── Eye icon for password visibility ─── */
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

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const { t } = useSiteI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'forgot'>('login')
  const [success, setSuccess] = useState('')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    const supabase = getBrowserSupabase()
    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/account?reset=true` })
      setLoading(false)
      if (error) { setError(error.message); return }
      setSuccess(t('auth.forgot_sent'))
      return
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setError(error.message); return }
    router.push(params.get('returnTo') || '/account')
    router.refresh()
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-20">
      <div className="glass-card p-8 space-y-6">
        <h1 className="font-serif text-4xl text-[var(--text-primary)]">{mode === 'forgot' ? t('auth.forgot.title') : t('auth.login.title')}</h1>
        {success && <div className="text-[#5CAE5C] text-sm">{success}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            placeholder={t('auth.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
          />
          {mode === 'login' && (
            <div className="relative">
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 outline-none"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          )}
          {error && <div className="text-[#E05C5C] text-sm">{error}</div>}
          <button disabled={loading} className="rounded-full bg-[var(--primary-gold)] px-5 py-3 text-black">{t('auth.submit')}</button>
        </form>
        <div className="flex justify-between text-sm text-white/60">
          {mode === 'login' ? (
            <button onClick={() => setMode('forgot')} className="hover:text-white">{t('auth.forgot_password')}</button>
          ) : (
            <button onClick={() => { setMode('login'); setSuccess('') }} className="hover:text-white">{t('auth.back_login')}</button>
          )}
        </div>
      </div>
    </section>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
