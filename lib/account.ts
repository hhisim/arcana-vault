import { cookies } from 'next/headers'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { getServerSupabase } from '@/lib/supabase/server'
import { canAccessTradition, getDailyLimit, normalizeSelectedTraditions, PlanId, TraditionId, TRADITIONS } from '@/lib/plans'

export type Entitlement = {
  isAuthenticated: boolean
  userId: string | null
  email: string | null
  displayName: string | null
  plan: PlanId
  selectedTraditions: TraditionId[]
  usageUsed: number
  usageLimit: number | 'unlimited'
  usageRemaining: number | 'unlimited'
  guestTotalUsed: number
  guestTotalRemaining: number
}

function todayRange() {
  const now = new Date()
  const start = new Date(now)
  start.setHours(0,0,0,0)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return { start: start.toISOString(), end: end.toISOString() }
}

export async function getCurrentUserLite(bearerToken?: string | null) {
  // 1. Try bearer token first (used during signup when cookies aren't set yet)
  if (bearerToken) {
    const token = bearerToken.replace(/^Bearer\s+/i, '').trim()
    if (token) {
      try {
        const supabase = await getServerSupabase()
        const { data, error } = await supabase.auth.getUser(token)
        if (error) {
          console.warn('[getCurrentUserLite] Bearer token rejected:', error.message)
        }
        if (data?.user) {
          console.log('[getCurrentUserLite] Bearer auth OK:', data.user.id)
          return data.user
        }
      } catch (err) {
        console.error('[getCurrentUserLite] Bearer auth exception:', err instanceof Error ? err.message : String(err))
      }
    }
  }

  // 2. Fall back to cookie-based auth
  try {
    const supabase = await getServerSupabase()
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      // This is normal for unauthenticated requests — don't log as error
      if (!error.message.includes('not authenticated')) {
        console.warn('[getCurrentUserLite] Cookie auth error:', error.message)
      }
    }
    return data?.user ?? null
  } catch (err) {
    console.error('[getCurrentUserLite] Cookie auth exception:', err instanceof Error ? err.message : String(err))
    return null
  }
}

export async function ensureProfile(user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }) {
  const admin = getAdminSupabase()
  const { data: existing } = await admin
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) return existing

  const payload = {
    user_id: user.id,
    email: user.email,
    display_name: typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : null,
    plan: 'guest',
    subscription_status: 'inactive',
  }
  const { data } = await admin.from('profiles').upsert(payload).select('*').single()
  return data
}

export async function getEntitlement(): Promise<Entitlement> {
  const user = await getCurrentUserLite()
  const admin = getAdminSupabase()
  const cookieStore = await cookies()
  const guestUsed = Number(cookieStore.get('voa_guest_questions_total')?.value || 0)

  if (!user) {
    return {
      isAuthenticated: false,
      userId: null,
      email: null,
      displayName: null,
      plan: 'guest',
      selectedTraditions: TRADITIONS,
      usageUsed: guestUsed,
      usageLimit: 3,
      usageRemaining: Math.max(0, 3 - guestUsed),
      guestTotalUsed: guestUsed,
      guestTotalRemaining: Math.max(0, 3 - guestUsed),
    }
  }

  const profile = await ensureProfile(user)
  const { data: traditionRows } = await admin
    .from('user_traditions')
    .select('tradition')
    .eq('user_id', user.id)

  const selected = normalizeSelectedTraditions(
    (profile.plan || 'guest') as PlanId,
    (traditionRows || []).map((row) => row.tradition as TraditionId),
  )

  const { start, end } = todayRange()
  const { count } = await admin
    .from('usage_events')
    .select('*', { head: true, count: 'exact' })
    .eq('user_id', user.id)
    .gte('created_at', start)
    .lt('created_at', end)

  const plan = (profile.plan || 'guest') as PlanId
  const limit = getDailyLimit(plan)
  const used = count || 0
  const remaining = limit === 'unlimited' ? 'unlimited' : Math.max(0, limit - used)

  return {
    isAuthenticated: true,
    userId: user.id,
    email: user.email || profile.email || null,
    displayName: profile.display_name || null,
    plan,
    selectedTraditions: selected,
    usageUsed: used,
    usageLimit: limit,
    usageRemaining: remaining,
    guestTotalUsed: guestUsed,
    guestTotalRemaining: Math.max(0, 3 - guestUsed),
  }
}

export async function recordUsage({ tradition, userId, guestId }: { tradition: TraditionId; userId?: string | null; guestId?: string | null }) {
  const admin = getAdminSupabase()
  await admin.from('usage_events').insert({ tradition, user_id: userId ?? null, guest_id: guestId ?? null })
}

export function buildGateMessage(code: 'guest_limit' | 'auth_required' | 'tradition_locked' | 'daily_limit', plan?: PlanId) {
  switch (code) {
    case 'guest_limit':
      return 'Your first 3 guest questions are complete. Create an account and choose a free or paid plan to continue.'
    case 'auth_required':
      return 'Please create an account or log in to continue with this tradition.'
    case 'tradition_locked':
      return `This tradition is locked on your ${plan || 'current'} plan. Choose it in your account or upgrade to continue.`
    case 'daily_limit':
      return "You have reached today's question allowance for your current plan. Upgrade or return tomorrow."
  }
}

export function canUseTradition(entitlement: Entitlement, tradition: TraditionId) {
  return canAccessTradition(entitlement.plan, entitlement.selectedTraditions, tradition)
}
