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
  // Trial info
  isTrial: boolean
  trialEndsAt: string | null
  trialDaysRemaining: number | null
  promoSource: string | null
  // Test mode
  isTestMode: boolean
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
  if (bearerToken) {
    const token = bearerToken.replace(/^Bearer\s+/i, '').trim()
    if (token) {
      try {
        const supabase = await getServerSupabase()
        const { data, error } = await supabase.auth.getUser(token)
        if (error) console.warn('[getCurrentUserLite] Bearer rejected:', error.message)
        if (data?.user) return data.user
      } catch (err) {
        console.error('[getCurrentUserLite] Bearer exception:', err instanceof Error ? err.message : String(err))
      }
    }
  }
  try {
    const supabase = await getServerSupabase()
    const { data, error } = await supabase.auth.getUser()
    if (error && !error.message.includes('not authenticated')) {
      console.warn('[getCurrentUserLite] Cookie auth error:', error.message)
    }
    return data?.user ?? null
  } catch (err) {
    console.error('[getCurrentUserLite] Cookie exception:', err instanceof Error ? err.message : String(err))
    return null
  }
}

export async function ensureProfile(user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }) {
  const admin = getAdminSupabase()
  const { data: existing } = await admin.from('profiles').select('*').eq('user_id', user.id).maybeSingle()
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
  const cookieStore = await cookies()

  /* ═══════════════════════════════════════════════════════════
   * TEST MODE: ?testmode=arcana sets cookie, returns full access
   * ═══════════════════════════════════════════════════════════ */
  const isTestMode = cookieStore.get('voa_test_mode')?.value === 'arcana'
  if (isTestMode) {
    const user = await getCurrentUserLite()
    return {
      isAuthenticated: !!user,
      userId: user?.id ?? null,
      email: user?.email ?? null,
      displayName: null,
      plan: 'full',
      selectedTraditions: TRADITIONS,
      usageUsed: 0,
      usageLimit: 'unlimited',
      usageRemaining: 'unlimited',
      guestTotalUsed: 0,
      guestTotalRemaining: 999,
      isTrial: false,
      trialEndsAt: null,
      trialDaysRemaining: null,
      promoSource: null,
      isTestMode: true,
    }
  }

  const user = await getCurrentUserLite()
  const admin = getAdminSupabase()
  const guestUsed = Number(cookieStore.get('voa_guest_questions_total')?.value || 0)

  if (!user) {
    return {
      isAuthenticated: false, userId: null, email: null, displayName: null, plan: 'guest',
      selectedTraditions: TRADITIONS, usageUsed: guestUsed, usageLimit: 3,
      usageRemaining: Math.max(0, 3 - guestUsed), guestTotalUsed: guestUsed,
      guestTotalRemaining: Math.max(0, 3 - guestUsed),
      isTrial: false, trialEndsAt: null, trialDaysRemaining: null, promoSource: null,
      isTestMode: false,
    }
  }

  const profile = await ensureProfile(user)

  /* ═══════════════════════════════════════════════════════════
   * TRIAL EXPIRY: auto-downgrade if trial has ended
   * ═══════════════════════════════════════════════════════════ */
  let plan = (profile.plan || 'guest') as PlanId
  let isTrial = false
  let trialEndsAt: string | null = profile.trial_ends_at ?? null
  let trialDaysRemaining: number | null = null
  const promoSource: string | null = profile.promo_source ?? null

  if (trialEndsAt) {
    const trialEnd = new Date(trialEndsAt)
    const now = new Date()

    if (trialEnd > now) {
      // Trial is still active
      isTrial = true
      trialDaysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    } else {
      // Trial has expired — downgrade to free if no active subscription
      const hasActiveSubscription = profile.stripe_subscription_id && profile.subscription_status === 'active'
      if (!hasActiveSubscription) {
        console.log(`[getEntitlement] Trial expired for ${user.id}, downgrading to free`)
        plan = 'free'
        isTrial = false
        trialDaysRemaining = 0
        // Persist the downgrade so we don't check every request
        await admin.from('profiles').update({
          plan: 'free',
          subscription_status: 'inactive',
        }).eq('user_id', user.id)
      }
    }
  }

  const { data: traditionRows } = await admin.from('user_traditions').select('tradition').eq('user_id', user.id)
  const selected = normalizeSelectedTraditions(plan, (traditionRows || []).map((row) => row.tradition as TraditionId))
  const { start, end } = todayRange()
  const { count } = await admin.from('usage_events').select('*', { head: true, count: 'exact' }).eq('user_id', user.id).gte('created_at', start).lt('created_at', end)
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
    isTrial,
    trialEndsAt,
    trialDaysRemaining,
    promoSource,
    isTestMode: false,
  }
}

export async function recordUsage({ tradition, userId, guestId }: { tradition: TraditionId; userId?: string | null; guestId?: string | null }) {
  const admin = getAdminSupabase()
  await admin.from('usage_events').insert({ tradition, user_id: userId ?? null, guest_id: guestId ?? null })
}

export function buildGateMessage(code: 'guest_limit' | 'auth_required' | 'tradition_locked' | 'daily_limit', plan?: PlanId) {
  switch (code) {
    case 'guest_limit': return 'Your first 3 guest questions are complete. Create an account and choose a free or paid plan to continue.'
    case 'auth_required': return 'Please create an account or log in to continue with this tradition.'
    case 'tradition_locked': return `This tradition is locked on your ${plan || 'current'} plan. Choose it in your account or upgrade to continue.`
    case 'daily_limit': return "You have reached today's question allowance for your current plan. Upgrade or return tomorrow."
  }
}

export function canUseTradition(entitlement: Entitlement, tradition: TraditionId) {
  return canAccessTradition(entitlement.plan, entitlement.selectedTraditions, tradition)
}
