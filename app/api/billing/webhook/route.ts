import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { planFromPriceId } from '@/lib/plans'
import { getStripe } from '@/lib/stripe'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const stripe = getStripe()
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!signature || !secret) return NextResponse.json({ detail: 'Webhook not configured' }, { status: 400 })

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret)
  } catch (error) {
    return NextResponse.json({ detail: error instanceof Error ? error.message : 'Invalid signature' }, { status: 400 })
  }

  const admin = getAdminSupabase()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    if (session.mode === 'subscription' && session.customer && session.subscription) {
      const userId = session.metadata?.user_id
      const plan = session.metadata?.plan || 'seeker'
      if (userId) {
        await admin.from('profiles').update({
          plan,
          subscription_status: 'active',
          stripe_customer_id: String(session.customer),
          stripe_subscription_id: String(session.subscription),
        }).eq('user_id', userId)
      }
    }
  }

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
    const sub = event.data.object as unknown as {
      current_period_end?: number;
      status?: string;
      customer?: string | null;
      id?: string;
      items: { data: Array<{ price?: { id?: string } }> };
      [key: string]: unknown;
    }
    const item = sub.items.data[0]
    const plan = planFromPriceId(item?.price?.id) || 'seeker'
    await admin.from('profiles').update({
      plan,
      subscription_status: sub.status,
      stripe_customer_id: String(sub.customer),
      stripe_subscription_id: sub.id,
      price_id: item?.price?.id || null,
      current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
    }).eq('stripe_customer_id', String(sub.customer))
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object
    await admin.from('profiles').update({
      plan: 'free',
      subscription_status: 'canceled',
      stripe_subscription_id: null,
      price_id: null,
    }).eq('stripe_customer_id', String(sub.customer))
  }

  return NextResponse.json({ received: true })
}
