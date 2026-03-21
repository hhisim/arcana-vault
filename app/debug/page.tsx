'use client'

import { useState } from 'react'
import { getBrowserSupabase } from '@/lib/supabase/client'
import { PLAN_CONFIG } from '@/lib/plans'

/**
 * Visit /debug to test each step of the signup → checkout flow independently.
 * Remove this page before going live.
 */
export default function DebugPage() {
  const [log, setLog] = useState<string[]>([])
  const [token, setToken] = useState('')

  const add = (msg: string) => {
    const ts = new Date().toISOString().slice(11, 23)
    setLog(prev => [...prev, `[${ts}] ${msg}`])
    console.log('[debug]', msg)
  }

  const clear = () => setLog([])

  const testServerConfig = async () => {
    add('── Testing server config ──')
    try {
      const res = await fetch('/api/debug/checkout-test?plan=seeker')
      const data = await res.json()
      add(`Status: ${res.status}`)
      add(`Plan config: ${JSON.stringify(data.planConfig, null, 2)}`)
      add(`Env vars: ${JSON.stringify(data.envVars, null, 2)}`)
      add(`Stripe: ${JSON.stringify(data.stripe, null, 2)}`)
      add(`Stripe price valid: ${JSON.stringify(data.stripePriceValid, null, 2)}`)
      add(`Supabase: ${JSON.stringify(data.supabase, null, 2)}`)
      add(`Issues: ${JSON.stringify(data.issues)}`)
    } catch (err) {
      add(`FAILED: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const testClientPlanConfig = () => {
    add('── Testing client-side PLAN_CONFIG ──')
    for (const [id, cfg] of Object.entries(PLAN_CONFIG)) {
      if (cfg.stripePriceId !== undefined) {
        add(`${id}: stripePriceId = "${cfg.stripePriceId}" (starts with price_: ${cfg.stripePriceId?.startsWith('price_')})`)
      } else {
        add(`${id}: stripePriceId = UNDEFINED (no paid checkout possible)`)
      }
    }
    add(`NEXT_PUBLIC_SITE_URL = "${process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET'}"`)
  }

  const testSignup = async () => {
    add('── Testing Supabase signUp ──')
    const testEmail = `test-${Date.now()}@debug-test.local`
    try {
      const supabase = getBrowserSupabase()
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'TestPassword123!',
        options: { data: { full_name: 'Debug Test' } },
      })
      if (error) {
        add(`signUp error: ${error.message}`)
        return
      }
      add(`signUp OK: user=${data.user?.id}`)
      add(`session present: ${!!data.session}`)
      if (data.session) {
        add(`access_token: ${data.session.access_token.substring(0, 30)}...`)
        setToken(data.session.access_token)
        add('Token saved — you can now test checkout')
      } else {
        add('NO SESSION — email confirmation is probably required.')
        add('Fix: Supabase → Authentication → Providers → Email → disable "Confirm email"')
      }
      // Clean up: sign out
      await supabase.auth.signOut()
      add('Signed out test user')
    } catch (err) {
      add(`EXCEPTION: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const testCheckoutDirect = async () => {
    add('── Testing checkout API directly ──')
    if (!token) {
      add('No token — run "Test Signup" first, or paste a token below')
      return
    }
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: 'seeker' }),
        redirect: 'manual',
      })
      add(`Status: ${res.status}, type: ${res.type}, redirected: ${res.redirected}`)
      if (res.type === 'opaqueredirect') {
        add('GOT REDIRECT (3xx) — this is the bug. API should return JSON, not redirect.')
        add(`Redirect URL: ${res.url}`)
        return
      }
      const text = await res.text()
      add(`Body: ${text.substring(0, 800)}`)
      try {
        const data = JSON.parse(text)
        if (data.url) {
          add(`SUCCESS: Stripe URL = ${data.url.substring(0, 80)}...`)
          add('The checkout API is working. The bug is client-side.')
        } else {
          add(`FAIL: No URL in response. Detail: ${data.detail || 'none'}`)
        }
      } catch {
        add('Response is not JSON. Got HTML or error page.')
      }
    } catch (err) {
      add(`EXCEPTION: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const testAuthWithBearer = async () => {
    add('── Testing Bearer auth on server ──')
    if (!token) {
      add('No token — run "Test Signup" first')
      return
    }
    try {
      const res = await fetch(`/api/debug/checkout-test?plan=seeker`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      const data = await res.json()
      add(`Bearer auth result: ${JSON.stringify(data.bearerAuth)}`)
    } catch (err) {
      add(`EXCEPTION: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const testSyncSession = async () => {
    add('── Testing sync-session ──')
    try {
      const supabase = getBrowserSupabase()
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        add('No active session. Log in or sign up first.')
        return
      }
      add(`Current session: token=${data.session.access_token.substring(0, 20)}...`)
      const res = await fetch('/api/auth/sync-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        }),
      })
      const text = await res.text()
      add(`sync-session status: ${res.status}, body: ${text}`)

      // Check response cookies
      add(`Response headers:`)
      res.headers.forEach((value, key) => {
        if (key.toLowerCase() === 'set-cookie') {
          add(`  Set-Cookie: ${value.substring(0, 100)}...`)
        }
      })
    } catch (err) {
      add(`EXCEPTION: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-12 space-y-6">
      <h1 className="font-serif text-3xl text-[var(--text-primary)]">Checkout Debug Panel</h1>
      <p className="text-[var(--text-secondary)] text-sm">
        Tests each component of the signup → checkout flow independently.
        Run these in order to find the broken step.
      </p>

      <div className="flex flex-wrap gap-3">
        <button onClick={testClientPlanConfig} className="rounded-full bg-purple-700 px-4 py-2 text-white text-sm">
          1. Client Plan Config
        </button>
        <button onClick={testServerConfig} className="rounded-full bg-purple-700 px-4 py-2 text-white text-sm">
          2. Server Config
        </button>
        <button onClick={testSignup} className="rounded-full bg-purple-700 px-4 py-2 text-white text-sm">
          3. Test Signup
        </button>
        <button onClick={testSyncSession} className="rounded-full bg-purple-700 px-4 py-2 text-white text-sm">
          4. Test Sync Session
        </button>
        <button onClick={testAuthWithBearer} className="rounded-full bg-purple-700 px-4 py-2 text-white text-sm">
          5. Test Bearer Auth
        </button>
        <button onClick={testCheckoutDirect} className="rounded-full bg-orange-700 px-4 py-2 text-white text-sm">
          6. Test Checkout API
        </button>
        <button onClick={clear} className="rounded-full border border-white/20 px-4 py-2 text-white/60 text-sm">
          Clear Log
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-white/50">Manual Bearer Token (optional):</label>
        <input
          value={token}
          onChange={e => setToken(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-white/70"
          placeholder="paste access_token here if you have one"
        />
      </div>

      <div className="rounded-xl bg-black/80 border border-white/10 p-4 min-h-[200px] max-h-[600px] overflow-y-auto">
        <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Output</div>
        {log.length === 0 ? (
          <div className="text-white/20 text-sm">Run a test above...</div>
        ) : (
          log.map((line, i) => (
            <div key={i} className={`text-xs font-mono ${
              line.includes('FAIL') || line.includes('ERROR') || line.includes('MISSING') || line.includes('EXCEPTION')
                ? 'text-red-400'
                : line.includes('SUCCESS') || line.includes('OK')
                ? 'text-green-400'
                : line.includes('──')
                ? 'text-yellow-400 mt-2'
                : 'text-white/60'
            }`}>
              {line}
            </div>
          ))
        )}
      </div>
    </section>
  )
}
