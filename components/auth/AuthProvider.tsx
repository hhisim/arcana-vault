'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
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
  refresh: async () => {},
  logout: async () => {},
}

const AuthCtx = createContext<Ctx>(defaultState)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Ctx>(defaultState)

  const refresh = async () => {
    try {
      const res = await fetch('/api/account/me', { cache: 'no-store' })
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
      }))
    } catch {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }

  useEffect(() => {
    let mounted = true
    const supabase = getBrowserSupabase()
    void refresh()
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      if (!mounted) return
      void refresh()
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    const supabase = getBrowserSupabase()
    await supabase.auth.signOut()
    await refresh()
  }

  const value = useMemo<Ctx>(() => ({ ...state, refresh, logout }), [state])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  return useContext(AuthCtx)
}
