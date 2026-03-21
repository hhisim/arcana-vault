import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { planFromPriceId } from '@/lib/plans'
import { getStripe } from '@/lib/stripe'

export const runtime = 'nodejs'

// ── Helper: update profile from subscription object ──────────────────────────
async function updateProfileFromSubscription(
  admin: ReturnType<typeof getAdminSupabase>,
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

  // Priority: metadata.user_id > metadata.plan > price_id fallback
  let userId = sub.metadata?.user_id
  let planId = sub.metadata?.plan as string | undefined

  // Fallback: look up user_id from profile by customer_id
  if (!userId) {
    const { data: prof } = await admin
      .from('profiles')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .maybeSingle()
    userId = prof?.user_id
  }

  // Fallback plan from price_id
  if (!planId) {
    planId = planFromPriceId(sub.items?.data?.[0]?.price?.id) ?? 'seeker'
  }

  const updates: Record<string, unknown> = {
    subscription_status: sub.status ?? 'active',
    stripe_customer_id: customerId,
    stripe_subscription_id: sub.id ?? null,
    price_id: sub.items?.data?.[0]?.price?.id ?? null,
    current_period_end: sub.current_period_end
      ? new Date(sub.current_period_end * 1000).toISOString()
      : null,
  }

  // Only set plan if we have a valid mapping
  if (planId) {
    updates.plan = planId
  }

  if (userId) {
    await admin.from('profiles').update(updates).eq('user_id', userId)
  } else {
    // Fallback: update by customer_id
    await admin.from('profiles').update(updates).eq('stripe_customer_id', customerId)
  }
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

        if (userId) {
          await admin.from('profiles').update({
            plan: planId,
            subscription_status: 'active',
            stripe_customer_id: String(session.customer),
            stripe_subscription_id: String(session.subscription),
          }).eq('user_id', userId)
        }
      }
      break
    }

    // ── Subscription created or updated → sync plan/status ───────────────────
    case 'customer.subscription.updated':
    case 'customer.subscription.created': {
      const sub = event.data.object
      await updateProfileFromSubscription(admin, sub as Parameters<typeof updateProfileFromSubscription>[1])
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
