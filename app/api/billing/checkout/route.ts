import { NextRequest, NextResponse } from 'next/server'
import { ensureProfile, getCurrentUserLite } from '@/lib/account'
import { PLAN_CONFIG, PlanId } from '@/lib/plans'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe'

function getSiteUrl(req: NextRequest) {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserLite(req.headers.get('Authorization'))
    if (!user) return NextResponse.json({ detail: 'Authentication required — please log in again.' }, { status: 401 })

    const profile = await ensureProfile(user)
    const body = await req.json().catch(() => ({}))
    const plan = (body.plan || 'seeker') as PlanId
    const cfg = PLAN_CONFIG[plan]

    if (!cfg?.stripePriceId) {
      return NextResponse.json({ detail: `Plan "${plan}" is not a paid plan or Stripe price is not configured.` }, { status: 400 })
    }

    const stripe = getStripe()
    let customerId = profile.stripe_customer_id as string | null

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: { user_id: user.id },
      })
      customerId = customer.id
      const admin = getAdminSupabase()
      await admin.from('profiles').update({ stripe_customer_id: customerId }).eq('user_id', user.id)
    }

    const site = getSiteUrl(req)

    // Use expand to get subscription object so we can read metadata on it
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
      // expand lets us get subscription in the response object
      expand: ['subscription'],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[/billing/checkout]', message)
    return NextResponse.json({ detail: `Checkout error: ${message}` }, { status: 500 })
  }
}
