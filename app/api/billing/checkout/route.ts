import { NextRequest, NextResponse } from 'next/server'
import { ensureProfile, getCurrentUserLite } from '@/lib/account'
import { PLAN_CONFIG, PlanId } from '@/lib/plans'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe'

// Force Node.js runtime — Edge runtime can't reliably reach Stripe
export const runtime = 'nodejs'

function getSiteUrl(req: NextRequest) {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin
}

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  try {
    const authHeader = req.headers.get('Authorization')
    console.log(`[checkout] Auth header present: ${!!authHeader}, length: ${authHeader?.length ?? 0}`)

    const user = await getCurrentUserLite(authHeader)
    if (!user) {
      console.error('[checkout] No user found after getCurrentUserLite. Auth header:', authHeader?.substring(0, 30))
      return NextResponse.json(
        { detail: 'Authentication required — please log in again.', debug: { hasAuthHeader: !!authHeader } },
        { status: 401 }
      )
    }

    console.log(`[checkout] User authenticated: ${user.id}, email: ${user.email}`)

    const profile = await ensureProfile(user)
    const body = await req.json().catch(() => ({}))
    const plan = (body.plan || 'seeker') as PlanId
    const cfg = PLAN_CONFIG[plan]

    console.log(`[checkout] Plan: ${plan}, stripePriceId: ${cfg?.stripePriceId || 'UNDEFINED'}`)

    if (!cfg?.stripePriceId) {
      return NextResponse.json(
        {
          detail: `Plan "${plan}" is not a paid plan or Stripe price is not configured.`,
          debug: {
            plan,
            configExists: !!cfg,
            stripePriceId: cfg?.stripePriceId ?? 'undefined',
            hint: 'NEXT_PUBLIC_STRIPE_PRICE_*_MONTHLY env vars must be set at BUILD TIME on Vercel.',
          },
        },
        { status: 400 }
      )
    }

    const stripe = getStripe()
    let customerId = profile.stripe_customer_id as string | null

    if (!customerId) {
      console.log('[checkout] Creating Stripe customer...')
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: { user_id: user.id },
      })
      customerId = customer.id
      const admin = getAdminSupabase()
      await admin.from('profiles').update({ stripe_customer_id: customerId }).eq('user_id', user.id)
      console.log(`[checkout] Stripe customer created: ${customerId}`)
    }

    const site = getSiteUrl(req)
    console.log(`[checkout] Creating session: customer=${customerId}, price=${cfg.stripePriceId}, site=${site}`)

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: cfg.stripePriceId, quantity: 1 }],
      success_url: `${site}/membership?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/pricing?checkout=cancelled`,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: { user_id: user.id, plan },
      },
    })

    console.log(`[checkout] Session created in ${Date.now() - startTime}ms: ${session.id} → ${session.url?.substring(0, 60)}`)
    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack?.split('\n').slice(0, 3).join(' | ') : undefined
    console.error(`[checkout] ERROR (${Date.now() - startTime}ms):`, message)
    return NextResponse.json(
      { detail: `Checkout error: ${message}`, debug: { stack, elapsed: Date.now() - startTime } },
      { status: 500 }
    )
  }
}
