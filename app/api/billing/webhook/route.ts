import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { planFromPriceId } from '@/lib/plans'
import { getStripe } from '@/lib/stripe'

export const runtime = 'nodejs'

// ── Helper: resolve plan from subscription ───────────────────────────────────
function resolvePlan(sub: {
  metadata?: { user_id?: string | null; plan?: string } | null
  items?: { data?: Array<{ price?: { id?: string | null } }> }
}): { userId?: string; planId: string } {
  let userId = sub.metadata?.user_id
  let planId = sub.metadata?.plan ?? 'seeker'
  if (!planId || planId === 'seeker') {
    const fromPrice = planFromPriceId(sub.items?.data?.[0]?.price?.id)
    if (fromPrice) planId = fromPrice
  }
  return { userId, planId }
}

// ── Helper: ensure profile exists, create if missing ─────────────────────────
async function ensureProfileForCustomer(
  admin: ReturnType<typeof getAdminSupabase>,
  customerId: string,
  userId?: string,
  planId?: string,
  email?: string,
) {
  // Check existing
  const { data: existing } = await admin
    .from('profiles')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle()

  if (existing) {
    // Update existing
    const updates: Record<string, unknown> = { stripe_customer_id: customerId }
    if (userId) updates.user_id = userId
    if (planId) updates.plan = planId
    await admin.from('profiles').update(updates).eq('stripe_customer_id', customerId)
  } else if (userId) {
    // Create new with user_id
    await admin.from('profiles').upsert({
      user_id: userId,
      email: email ?? null,
      plan: planId ?? 'guest',
      subscription_status: 'active',
      stripe_customer_id: customerId,
    }).eq('user_id', userId)
  }
  // Note: if no userId and no profile exists, we can't create one without knowing the user.
  // This case requires the user to go through website signup first.
}

// ── Helper: update profile from subscription object ──────────────────────────
async function updateProfileFromSubscription(
  admin: ReturnType<typeof getAdminSupabase>,
  stripe: ReturnType<typeof getStripe>,
  sub: {
    id?: string
    customer?: string | null
    status?: string
    metadata?: { user_id?: string | null; plan?: string } | null
    items?: { data?: Array<{ price?: { id?: string | null } }> }
    current_period_end?: number
  },
) {
  const customerId = String(sub.customer ?? '')
  if (!customerId) return

  const { userId, planId } = resolvePlan(sub)

  const updates: Record<string, unknown> = {
    subscription_status: sub.status ?? 'active',
    stripe_customer_id: customerId,
    stripe_subscription_id: sub.id ?? null,
    price_id: sub.items?.data?.[0]?.price?.id ?? null,
    current_period_end: sub.current_period_end
      ? new Date(sub.current_period_end * 1000).toISOString()
      : null,
  }
  if (planId) updates.plan = planId

  // Try update by user_id first
  if (userId) {
    const { data: profile } = await admin
      .from('profiles')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle()

    if (profile) {
      await admin.from('profiles').update(updates).eq('user_id', userId)
      return
    }
  }

  // Try update by customer_id
  const { data: byCustomer } = await admin
    .from('profiles')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle()

  if (byCustomer) {
    await admin.from('profiles').update(updates).eq('stripe_customer_id', customerId)
    return
  }

  // No profile exists — try to create one
  // First get customer email from Stripe
  let email: string | undefined
  try {
    const customer = await stripe.customers.retrieve(customerId)
    if (!customer.deleted) {
      email = customer.email
    }
  } catch {
    // Stripe customer fetch failed — proceed without email
  }

  if (userId) {
    await admin.from('profiles').upsert({
      user_id: userId,
      email: email ?? null,
      plan: planId ?? 'guest',
      subscription_status: sub.status ?? 'active',
      stripe_customer_id: customerId,
      stripe_subscription_id: sub.id ?? null,
      price_id: sub.items?.data?.[0]?.price?.id ?? null,
      current_period_end: sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null,
    })
  }
  // If no userId, we can't create a profile — user must sign up through website first
}

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const stripe = getStripe()
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !secret) {
    console.error('[webhook] Missing signature or webhook secret')
    return NextResponse.json({ detail: 'Webhook not configured' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret)
  } catch (error) {
    console.error('[webhook] Signature verification failed:', error instanceof Error ? error.message : error)
    return NextResponse.json({ detail: 'Invalid signature' }, { status: 400 })
  }

  const admin = getAdminSupabase()

  switch (event.type) {
    // ── New checkout completed → set plan immediately ──────────────────────────
    case 'checkout.session.completed': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const session = event.data.object as any
      if (session.mode === 'subscription' && session.customer && session.subscription) {
        const userId = session.metadata?.user_id
        const planId = session.metadata?.plan ?? 'seeker'
        const email = session.customer_details?.email ?? undefined

        await ensureProfileForCustomer(
          admin,
          String(session.customer),
          userId,
          planId,
          email,
        )

        await admin.from('profiles').update({
          plan: planId,
          subscription_status: 'active',
          stripe_customer_id: String(session.customer),
          stripe_subscription_id: String(session.subscription),
        }).eq('stripe_customer_id', String(session.customer))
      }
      break
    }

    // ── Subscription created or updated → sync plan/status ───────────────────
    case 'customer.subscription.updated':
    case 'customer.subscription.created': {
      const sub = event.data.object
      await updateProfileFromSubscription(admin, stripe, sub as Parameters<typeof updateProfileFromSubscription>[1])
      break
    }

    // ── Subscription deleted → downgrade to free ──────────────────────────────
    case 'customer.subscription.deleted': {
      const sub = event.data.object
      const customerId = String(sub.customer ?? '')
      if (customerId) {
        await admin.from('profiles').update({
          plan: 'free',
          subscription_status: 'canceled',
          stripe_subscription_id: null,
          price_id: null,
          current_period_end: null,
        }).eq('stripe_customer_id', customerId)
      }
      break
    }

    // ── Payment failed → mark as past_due ───────────────────────────────────
    case 'invoice.payment_failed': {
      const invoice = event.data.object as { customer?: string | null }
      const customerId = String(invoice.customer ?? '')
      if (customerId) {
        await admin.from('profiles').update({
          subscription_status: 'past_due',
        }).eq('stripe_customer_id', customerId)
      }
      break
    }

    default:
      // Unhandled event type — ignore
      break
  }

  return NextResponse.json({ received: true })
}
