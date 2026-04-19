import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { planFromPriceId, PlanId } from '@/lib/plans'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
  httpClient: Stripe.createFetchHttpClient(),
})

function resolvePlan(subscription: Stripe.Subscription): PlanId {
  const metadataPlan = subscription.metadata?.plan
  if (metadataPlan === 'seeker' || metadataPlan === 'adept' || metadataPlan === 'full') {
    return metadataPlan
  }

  const firstPriceId = subscription.items.data[0]?.price?.id
  return planFromPriceId(firstPriceId) ?? 'free'
}

async function syncSubscriptionToProfile(subscription: Stripe.Subscription) {
  const admin = getAdminSupabase()
  const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id
  const plan = subscription.status === 'active' || subscription.status === 'trialing'
    ? resolvePlan(subscription)
    : 'free'

  const update = {
    plan,
    subscription_status: subscription.status,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    trial_ends_at: null,
  }

  const userId = subscription.metadata?.user_id
  if (userId) {
    const { error } = await admin.from('profiles').update(update).eq('user_id', userId)
    if (!error) return
    console.error('Webhook profile update by user_id failed:', error.message)
  }

  const { error } = await admin.from('profiles').update(update).eq('stripe_customer_id', customerId)
  if (error) {
    throw new Error(`Webhook profile sync failed: ${error.message}`)
  }
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const type = event.type

  try {
    if (type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode === 'subscription' && typeof session.subscription === 'string') {
        const subscription = await stripe.subscriptions.retrieve(session.subscription)
        await syncSubscriptionToProfile(subscription)
      }
    }

    if (type === 'customer.subscription.created' ||
        type === 'customer.subscription.updated' ||
        type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription
      await syncSubscriptionToProfile(subscription)
    }

    if (type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice
      console.error('Invoice payment failed:', invoice.id, invoice.hosted_invoice_url)
    }

    if (type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice
      console.log('Invoice paid:', invoice.id, 'amount:', invoice.amount_paid)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook processing failed:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
