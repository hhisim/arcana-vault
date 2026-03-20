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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = getBrowserSupabase()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    router.push(params.get('returnTo') || '/account')
    router.refresh()
  }

  return (
    <section className="mx-auto max-w-xl px-6 py-20">
      <div className="glass-card p-8 space-y-6">
        <h1 className="font-serif text-4xl text-[var(--text-primary)]">{t('auth.login.title')}</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" placeholder={t('auth.email')} value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" type="password" placeholder={t('auth.password')} value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="text-[#E05C5C] text-sm">{error}</div>}
          <button disabled={loading} className="rounded-full bg-[var(--primary-gold)] px-5 py-3 text-black">{t('auth.submit')}</button>
        </form>
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
