'use client'

import { FormEvent, useState, useRef, Suspense, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getBrowserSupabase } from '@/lib/supabase/client'
import { useSiteI18n } from '@/lib/site-i18n'
import TraditionPicker from '@/app/components/TraditionPicker'
import { PLAN_CONFIG, PlanId, TraditionId, getLaunchPrice, formatUsd } from '@/lib/plans'
import { normalizePendingPlan } from '@/lib/billing-flow'

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
  const { t } = useSiteI18n()
  return (
    <section className="mx-auto max-w-xl px-6 py-20">
      <div className="glass-card p-8 space-y-6 text-center">
        <div className="text-5xl">✉</div>
        <h1 className="font-serif text-3xl text-[var(--text-primary)]">{t({ en: 'Check Your Email', tr: 'E-postanı kontrol et', ru: 'Проверьте свою почту' })}</h1>
        <p className="text-[var(--text-secondary)] leading-7">
          {t({ en: 'We sent a verification link to', tr: 'Doğrulama bağlantısını şu adrese gönderdik:', ru: 'Мы отправили ссылку для подтверждения на адрес' })} <span className="text-[var(--text-primary)] font-medium">{email}</span>.
          {t({ en: 'Click the link in the email to activate your account, then come back and log in.', tr: 'Hesabını etkinleştirmek için e-postadaki bağlantıya tıkla, sonra geri dönüp giriş yap.', ru: 'Нажмите ссылку в письме, чтобы активировать аккаунт, затем вернитесь и войдите.' })}
        </p>
        <div className="text-[var(--text-secondary)] text-sm space-y-2">
          <p>{t({ en: 'The link will expire in 24 hours.', tr: 'Bağlantı 24 saat içinde sona erecek.', ru: 'Ссылка истечёт через 24 часа.' })}</p>
          <p>{t({ en: "If you don't see it, check your spam folder.", tr: 'Görmüyorsan spam klasörünü kontrol et.', ru: 'Если письмо не видно, проверьте папку спам.' })}</p>
        </div>
        <a
          href="/login"
          className="inline-block rounded-full bg-[var(--primary-gold)] px-6 py-3 text-black font-medium"
        >{t({ en: 'Go to Login', tr: 'Girişe git', ru: 'Перейти ко входу' })}</a>
      </div>
    </section>
  )
}

/* ─── Main form ──────────────────────────────────────────── */
function SignupForm() {
  const router = useRouter()
  const params = useSearchParams()
  const { t } = useSiteI18n()

  const [mode, setMode] = useState<'login' | 'signup'>(
    params.get('mode') === 'login' ? 'login' : 'signup'
  )
  const planParam = params.get('plan')
  const pendingPlan: PlanId = normalizePendingPlan(planParam)
  const source = params.get('source') || ''

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
  const isFreePlan = pendingPlan === 'free'
  const sourceLabel = source === 'oracle-reading' ? t({ en: 'Save this reading and keep the thread alive.', tr: 'Bu okumayı kaydet ve izi canlı tut.', ru: 'Сохраните это чтение и удерживайте нить живой.' }) : source === 'daily-questions' ? t({ en: 'Start the free daily-practice path.', tr: 'Ücretsiz günlük pratik yoluna başla.', ru: 'Начните бесплатный путь ежедневной практики.' }) : source === 'arcana-initiation' ? t({ en: 'Turn the initiation into an ongoing practice.', tr: 'İnisiyasyonu sürekli bir pratiğe dönüştür.', ru: 'Превратите инициацию в постоянную практику.' }) : t({ en: 'Create your free Vault and continue daily.', tr: 'Ücretsiz Vault’unu oluştur ve günlük devam et.', ru: 'Создайте своё бесплатное Хранилище и продолжайте ежедневно.' })

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

  /* ─── Login handler ─── */
  const onLogin = async (e: FormEvent) => {
    e.preventDefault()
    if (inFlight.current || loading) return
    inFlight.current = true
    setLoading(true)
    setError('')
    debugLog.length = 0
    setDebugLines([])

    if (!email.trim()) { setError(t({ en: 'Please enter your email.', tr: 'Lütfen e-postanı gir.', ru: 'Пожалуйста, введите email.' })); setLoading(false); inFlight.current = false; return }
    if (!password) { setError(t({ en: 'Please enter your password.', tr: 'Lütfen şifreni gir.', ru: 'Пожалуйста, введите пароль.' })); setLoading(false); inFlight.current = false; return }

    pushDebug(`signIn: email=${email}`)
    try {
      const supabase = getBrowserSupabase()
      const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({ email, password })

      if (signInError) {
        pushDebug(`signIn error: ${signInError.message}`)
        setError(signInError.message)
        return
      }

      pushDebug(`signIn OK: user=${signInData.user?.id?.substring(0, 8)}`)

      const accessToken = signInData.session?.access_token
      const refreshToken = signInData.session?.refresh_token

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

      redirecting.current = true
      router.push('/inquiry')
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      pushDebug(`UNHANDLED: ${msg}`)
      setError(`Something went wrong: ${msg}`)
    } finally {
      if (!redirecting.current) setLoading(false)
      inFlight.current = false
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
    if (!name.trim()) { setError(t({ en: 'Please enter your name.', tr: 'Lütfen adını gir.', ru: 'Пожалуйста, введите имя.' })); setLoading(false); inFlight.current = false; return }
    if (!email.trim()) { setError(t({ en: 'Please enter your email.', tr: 'Lütfen e-postanı gir.', ru: 'Пожалуйста, введите email.' })); setLoading(false); inFlight.current = false; return }
    if (password.length < 6) { setError(t({ en: 'Password must be at least 6 characters.', tr: 'Şifre en az 6 karakter olmalı.', ru: 'Пароль должен содержать не менее 6 символов.' })); setLoading(false); inFlight.current = false; return }
    if (password !== confirmPassword) { setError(t({ en: 'Passwords do not match.', tr: 'Şifreler eşleşmiyor.', ru: 'Пароли не совпадают.' })); setLoading(false); inFlight.current = false; return }

    pushDebug(`signUp: plan=${pendingPlan}, email=${email}`)

    try {
      const supabase = getBrowserSupabase()
      const confirmationRedirect = `${window.location.origin}/api/auth/callback?plan=${encodeURIComponent(pendingPlan)}`
      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: confirmationRedirect,
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

      // Session exists — sync cookies, then let every new member choose traditions before activation or checkout.
      const accessToken = signUpData.session?.access_token
      const refreshToken = signUpData.session?.refresh_token

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
      setStep('traditions')
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
    if (maxSlots !== 99 && selectedTraditions.length === 0) {
      setError(t({ en: 'Choose at least one tradition before continuing.', tr: 'Devam etmeden önce en az bir gelenek seç.', ru: 'Выберите хотя бы одну традицию, чтобы продолжить.' }))
      return
    }
    inFlight.current = true
    setLoading(true)
    setError('')

    try {
      const supabase = getBrowserSupabase()
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData?.session?.access_token
      if (!accessToken) {
        setError(t({ en: 'Your session has expired. Please sign in again.', tr: 'Oturumun sona erdi. Lütfen tekrar giriş yap.', ru: 'Сеанс истёк. Пожалуйста, войдите снова.' }))
        return
      }

      const traditionsResponse = await fetch('/api/account/traditions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ traditions: selectedTraditions, pendingPlan }),
      })
      if (!traditionsResponse.ok) {
        const data = await traditionsResponse.json().catch(() => ({}))
        setError((data as { detail?: string }).detail || 'Could not save your traditions. Please try again.')
        return
      }

      if (pendingPlan !== 'free') {
        const redirected = await doCheckout(accessToken, pendingPlan)
        if (redirected) return
        return
      }

      const freeResponse = await fetch('/api/billing/activate-free', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      })
      if (!freeResponse.ok) {
        const data = await freeResponse.json().catch(() => ({}))
        setError((data as { detail?: string }).detail || 'Could not activate your free plan. Please try again.')
        return
      }

      redirecting.current = true
      window.location.href = '/inquiry'
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
            {t({ en: `Choose up to ${maxSlots} tradition${maxSlots > 1 ? 's' : ''} for your ${t('plans.' + pendingPlan)} plan.`, tr: `${t('plans.' + pendingPlan)} planın için en fazla ${maxSlots} gelenek seç.`, ru: `Выберите до ${maxSlots} традиций для плана ${t('plans.' + pendingPlan)}.` })}
          </p>
          <TraditionPicker selected={selectedTraditions} onChange={setSelectedTraditions} max={maxSlots} />
          {error && <div className="rounded-xl bg-red-900/50 border border-red-500 p-4 text-red-200 text-sm">{error}</div>}
          {debugPanel}
          <button onClick={onSaveAndCheckout} disabled={loading}
            className="w-full rounded-full bg-[var(--primary-gold)] px-5 py-3 text-black font-medium disabled:opacity-50">
            {loading ? t({ en: 'Processing…', tr: 'İşleniyor…', ru: 'Обрабатывается…' }) : pendingPlan !== 'free' ? t('pricing.checkout') : t('account.save')}
          </button>
        </div>
      </section>
    )
  }

  // ── Login step ──
  if (mode === 'login') {
    return (
      <section className="mx-auto max-w-xl px-6 py-20">
        <div className="glass-card p-8 space-y-6">
          <div>
            <h1 className="font-serif text-4xl text-[var(--text-primary)]">{t({ en: 'Welcome back', tr: 'Tekrar hoş geldin', ru: 'С возвращением' })}</h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{t({ en: 'Sign in to reopen your Vault, recover saved transmissions, and continue your daily questions.', tr: 'Vault’unu yeniden açmak, kayıtlı aktarımları geri almak ve günlük sorularına devam etmek için giriş yap.', ru: 'Войдите, чтобы снова открыть своё Хранилище, вернуть сохранённые передачи и продолжить ежедневные вопросы.' })}</p>
          </div>
          <form onSubmit={onLogin} className="space-y-4">
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
            {error && <div className="rounded-xl bg-red-900/50 border border-red-500 p-4 text-red-200 text-sm">{error}</div>}
            {debugPanel}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[var(--primary-gold)] px-5 py-3 text-black font-medium disabled:opacity-50"
            >
              {loading ? t({ en: 'Signing in…', tr: 'Giriş yapılıyor…', ru: 'Выполняется вход…' }) : t({ en: 'Sign in', tr: 'Giriş yap', ru: 'Войти' })}
            </button>
          </form>
          <div className="text-center space-y-2">
            <p className="text-sm text-[var(--text-secondary)]">
              {t({ en: 'New to the Vault?', tr: 'Vault’ta yeni misin?', ru: 'Вы впервые в Vault?' })}{' '}
              <button onClick={() => { setMode('signup'); setError(''); }} className="text-[var(--primary-gold)] underline underline-offset-2 hover:text-white transition-colors">
                {t({ en: 'Create an account', tr: 'Hesap oluştur', ru: 'Создать аккаунт' })}
              </button>
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              {t({ en: 'Not sure what to ask?', tr: 'Ne soracağını bilmiyor musun?', ru: 'Не уверены, что спросить?' })}{' '}
              <a href="/inquiry" className="text-[var(--primary-gold)] underline underline-offset-2 hover:text-white transition-colors">
                {t({ en: 'See example prompts', tr: 'Örnek soruları gör', ru: 'Посмотреть примеры prompts' })}
              </a>
            </p>
          </div>
        </div>
      </section>
    )
  }

  // ── Signup step ──
  return (
    <section className="mx-auto max-w-xl px-6 py-20">
      <div className="glass-card p-8 space-y-6">
        <div>
          <h1 className="font-serif text-4xl text-[var(--text-primary)]">
            {isFreePlan
              ? t({ en: 'Create your free Vault', tr: 'Ücretsiz Vault’unu oluştur', ru: 'Создайте своё бесплатное Хранилище' })
              : t({ en: `Create your ${PLAN_CONFIG[pendingPlan].name} account`, tr: `${PLAN_CONFIG[pendingPlan].name} hesabını oluştur`, ru: `Создайте аккаунт ${PLAN_CONFIG[pendingPlan].name}` })}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{sourceLabel}</p>
        </div>
        {isFreePlan && (
          <div className="rounded-2xl border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.06)] p-4 text-sm leading-7 text-[#D7CEE8]">
            <p className="font-medium text-[#E8E0F0]">{t({ en: 'Free account unlocks the real path:', tr: 'Ücretsiz hesap asıl yolu açar:', ru: 'Бесплатный аккаунт открывает настоящий путь:' })}</p>
            <ul className="mt-2 space-y-1">
              <li>• {t({ en: 'save this transmission to your Vault', tr: 'bu aktarımı Vault’una kaydet', ru: 'сохраните эту передачу в своё Хранилище' })}</li>
              <li>• {t({ en: 'receive 12 daily questions in your chosen tradition', tr: 'seçtiğin gelenekte 12 günlük soru al', ru: 'получайте 12 ежедневных вопросов в выбранной традиции' })}</li>
              <li>• {t({ en: 'return to Tarot, Tao, Tantra, dreams, symbols, names, and the Correspondence Codex without starting from zero', tr: 'Tarot, Tao, Tantra, rüyalar, semboller, isimler ve Correspondence Codex’e sıfırdan başlamadan geri dön', ru: 'возвращайтесь к Таро, Дао, Тантре, снам, символам, именам и Кодексу Соответствий без старта с нуля' })}</li>
            </ul>
          </div>
        )}
        {pendingPlan !== 'free' && (
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--primary-gold)]">
            {t({ en: `Signing up for ${PLAN_CONFIG[pendingPlan]?.name || pendingPlan} (${formatUsd(getLaunchPrice(PLAN_CONFIG[pendingPlan]?.priceMonthly))}/mo with LAUNCH30)`, tr: `${PLAN_CONFIG[pendingPlan]?.name || pendingPlan} için kayıt oluyorsun (${formatUsd(getLaunchPrice(PLAN_CONFIG[pendingPlan]?.priceMonthly))}/ay, LAUNCH30 ile)`, ru: `Регистрация на план ${PLAN_CONFIG[pendingPlan]?.name || pendingPlan} (${formatUsd(getLaunchPrice(PLAN_CONFIG[pendingPlan]?.priceMonthly))}/мес с LAUNCH30)` })}
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
            placeholder={t({ en: 'Confirm password', tr: 'Şifreyi onayla', ru: 'Подтвердите пароль' })}
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
          {password && confirmPassword && password !== confirmPassword && (
            <div className="text-[#E05C5C] text-sm">{t({ en: 'Passwords do not match', tr: 'Şifreler eşleşmiyor', ru: 'Пароли не совпадают' })}</div>
          )}
          {error && <div className="rounded-xl bg-red-900/50 border border-red-500 p-4 text-red-200 text-sm">{error}</div>}
          {debugPanel}
          <button
            disabled={loading || (!!confirmPassword && password !== confirmPassword)}
            className="w-full rounded-full bg-[var(--primary-gold)] px-5 py-3 text-black font-medium disabled:opacity-50"
          >
            {loading
              ? t({ en: 'Opening your Vault — do not close this page…', tr: 'Vault’un açılıyor — bu sayfayı kapatma…', ru: 'Ваше Хранилище открывается — не закрывайте эту страницу…' })
              : isFreePlan
                ? t({ en: 'Create free account', tr: 'Ücretsiz hesap oluştur', ru: 'Создать бесплатный аккаунт' })
                : t({ en: 'Continue to choose traditions', tr: 'Gelenekleri seçmeye devam et', ru: 'Продолжить к выбору традиций' })}
          </button>
        </form>
        <div className="text-center space-y-2">
          <p className="text-sm text-[var(--text-secondary)]">
            {t({ en: 'Already have an account?', tr: 'Zaten hesabın var mı?', ru: 'Уже есть аккаунт?' })}{' '}
            <button onClick={() => { setMode('login'); setError(''); }} className="text-[var(--primary-gold)] underline underline-offset-2 hover:text-white transition-colors">
              {t({ en: 'Sign in', tr: 'Giriş yap', ru: 'Войти' })}
            </button>
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            {t({ en: 'Not sure what to ask?', tr: 'Ne soracağını bilmiyor musun?', ru: 'Не уверены, что спросить?' })}{' '}
            <a href="/inquiry" className="text-[var(--primary-gold)] underline underline-offset-2 hover:text-white transition-colors">
              {t({ en: 'See example prompts', tr: 'Örnek soruları gör', ru: 'Посмотреть примеры prompts' })}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

export default function SignupPage() {
  return <Suspense><SignupForm /></Suspense>
}
