import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { planFromPriceId, PlanId } from '@/lib/plans'
import { packFromSku, buildAccessTxt } from '@/lib/shop'
import { sendAccessEmail } from '@/lib/brevo'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
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

async function handleOneTimePurchase(session: Stripe.Checkout.Session) {
  const sku = session.metadata?.sku
  const pack = packFromSku(sku)
  if (!pack) {
    console.warn('[webhook] one-time session without known sku:', session.id)
    return
  }
  const customer =
    typeof session.customer === 'object' && session.customer !== null && 'email' in session.customer
      ? (session.customer as Stripe.Customer)
      : undefined
  const email = session.customer_details?.email || customer?.email
  if (!email) {
    console.warn('[webhook] one-time session missing email:', session.id)
    return
  }
  const admin = getAdminSupabase()
  const row = {
    session_id: session.id,
    user_id: session.metadata?.user_id || null,
    email,
    sku: pack.sku,
    pack_title: pack.title,
    amount_total: session.amount_total ?? null,
    currency: session.currency || 'usd',
    status: 'pending_access',
  }
  const { error } = await admin.from('purchases').upsert(row, { onConflict: 'session_id' })
  if (error) {
    console.error('[webhook] purchases upsert failed:', error.message)
    throw error
  }
  console.log('[webhook] one-time purchase recorded:', session.id, pack.sku, email)

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vaultofarcana.com'
  const txt = buildAccessTxt({ pack, email, accessLink: null, siteUrl: site, status: 'pending_access' })
  await sendAccessEmail({ to: email, packTitle: pack.title, txt }).catch(() => {})
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
      if (session.mode === 'payment') {
        await handleOneTimePurchase(session)
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
