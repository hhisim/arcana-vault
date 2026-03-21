import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserLite, ensureProfile } from '@/lib/account'
import { getAdminSupabase } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

/**
 * POST /api/billing/activate-trial
 * Body: { promo: "etsy", plan: "seeker", days: 30 }
 *
 * Activates a free trial — sets plan, trial_ends_at, and promo_source.
 * No Stripe involved. Trial expiry is checked in getEntitlement().
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserLite(req.headers.get('Authorization'))
    if (!user) {
      return NextResponse.json({ detail: 'Authentication required.' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const promo = String(body.promo || 'unknown')
    const plan = String(body.plan || 'seeker')
    const days = Math.min(Math.max(Number(body.days) || 30, 1), 90) // 1-90 days, default 30

    // Allowed trial plans (never give full/magister via trial)
    const allowedPlans = ['seeker', 'adept']
    if (!allowedPlans.includes(plan)) {
      return NextResponse.json({ detail: `Plan "${plan}" is not available for trial.` }, { status: 400 })
    }

    const profile = await ensureProfile(user)

    // Don't overwrite an active paid subscription
    if (profile.stripe_subscription_id && profile.subscription_status === 'active') {
      return NextResponse.json({ detail: 'You already have an active subscription.' }, { status: 400 })
    }

    // Don't allow re-activating if already on a trial
    if (profile.trial_ends_at) {
      const existing = new Date(profile.trial_ends_at)
      if (existing > new Date()) {
        const daysLeft = Math.ceil((existing.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        return NextResponse.json({
          detail: `You already have an active trial (${daysLeft} days remaining).`,
          trial_ends_at: profile.trial_ends_at,
        }, { status: 400 })
      }
    }

    // Activate
    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + days)

    const admin = getAdminSupabase()
    await admin.from('profiles').update({
      plan,
      subscription_status: 'trialing',
      trial_ends_at: trialEnd.toISOString(),
      promo_source: promo,
    }).eq('user_id', user.id)

    console.log(`[activate-trial] ${user.email}: ${plan} trial for ${days}d via ${promo}, ends ${trialEnd.toISOString()}`)

    return NextResponse.json({
      ok: true,
      plan,
      trial_ends_at: trialEnd.toISOString(),
      days_remaining: days,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[activate-trial]', message)
    return NextResponse.json({ detail: `Trial activation failed: ${message}` }, { status: 500 })
  }
}
