'use client'

import { FormEvent, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getBrowserSupabase } from '@/lib/supabase/client'
import { useSiteI18n } from '@/lib/site-i18n'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const { t } = useSiteI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" placeholder={t('auth.email')} value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          {mode === 'login' && <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" type="password" placeholder={t('auth.password')} value={password} onChange={(e) => setPassword(e.target.value)} />}
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
