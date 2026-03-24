'use client'

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getBrowserSupabase } from '@/lib/supabase/client'
import type { PlanId, TraditionId } from '@/lib/plans'

export type AuthState = {
  loading: boolean
  isAuthenticated: boolean
  user: { id: string; email: string | null; full_name?: string | null } | null
  plan: PlanId
  selectedTraditions: TraditionId[]
  usageUsed: number
  usageLimit: number | 'unlimited'
  usageRemaining: number | 'unlimited'
  guestTotalRemaining: number
  // Trial
  isTrial: boolean
  trialEndsAt: string | null
  trialDaysRemaining: number | null
  promoSource: string | null
  // Test mode
  isTestMode: boolean
}

type Ctx = AuthState & {
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const defaultState: Ctx = {
  loading: true,
  isAuthenticated: false,
  user: null,
  plan: 'guest',
  selectedTraditions: [],
  usageUsed: 0,
  usageLimit: 3,
  usageRemaining: 3,
  guestTotalRemaining: 3,
  isTrial: false,
  trialEndsAt: null,
  trialDaysRemaining: null,
  promoSource: null,
  isTestMode: false,
  refresh: async () => {},
  logout: async () => {},
}

const AuthCtx = createContext<Ctx>(defaultState)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Ctx>(defaultState)
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const refreshInFlight = useRef(false)

  const refresh = async () => {
    if (refreshInFlight.current) return
    refreshInFlight.current = true
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 6000)
      const res = await fetch('/api/account/me', { cache: 'no-store', signal: controller.signal })
      clearTimeout(timer)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setState((prev) => ({
        ...prev,
        loading: false,
        isAuthenticated: !!data.isAuthenticated,
        user: data.user ?? null,
        plan: data.plan ?? 'guest',
        selectedTraditions: data.selectedTraditions ?? [],
        usageUsed: data.usageUsed ?? 0,
        usageLimit: data.usageLimit ?? 3,
        usageRemaining: data.usageRemaining ?? 0,
        guestTotalRemaining: data.guestTotalRemaining ?? 0,
        isTrial: data.isTrial ?? false,
        trialEndsAt: data.trialEndsAt ?? null,
        trialDaysRemaining: data.trialDaysRemaining ?? null,
        promoSource: data.promoSource ?? null,
        isTestMode: data.isTestMode ?? false,
      }))
    } catch {
      setState((prev) => ({ ...prev, loading: false }))
    } finally {
      refreshInFlight.current = false
    }
  }

  const debouncedRefresh = () => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current)
    refreshTimer.current = setTimeout(() => void refresh(), 500)
  }

  useEffect(() => {
    let mounted = true
    const supabase = getBrowserSupabase()

    // ── Test mode: ?testmode=arcana sets cookie, ?testmode=off clears ──
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tm = params.get('testmode')
      if (tm === 'arcana') {
        document.cookie = 'voa_test_mode=arcana; path=/; max-age=86400; samesite=lax'
        // Clean the URL
        params.delete('testmode')
        const clean = params.toString()
        window.history.replaceState({}, '', window.location.pathname + (clean ? '?' + clean : ''))
      } else if (tm === 'off') {
        document.cookie = 'voa_test_mode=; path=/; max-age=0'
        params.delete('testmode')
        const clean = params.toString()
        window.history.replaceState({}, '', window.location.pathname + (clean ? '?' + clean : ''))
      }
    }

    void refresh()
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (!mounted) return
      debouncedRefresh()
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
      if (refreshTimer.current) clearTimeout(refreshTimer.current)
    }
  }, [])

  const logout = async () => {
    const supabase = getBrowserSupabase()
    await supabase.auth.signOut()
    try { localStorage.removeItem('arcana_auth_tokens') } catch {}
    await refresh()
  }

  const value = useMemo<Ctx>(() => ({ ...state, refresh, logout }), [state])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  return useContext(AuthCtx)
}
