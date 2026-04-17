import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const type: string = event.type

  if (type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.discounts?.length) {
      const coupons = session.discounts.map((d: any) =>
        typeof d.coupon === 'string' ? d.coupon : d.coupon?.id
      ).filter(Boolean)
      console.log('Checkout with discounts:', coupons)
    }
  }

  if (type === 'customer_subscription.created' ||
      type === 'customer_subscription.updated' ||
      type === 'customer_subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    console.log(`Subscription ${type}:`, sub.id, 'status:', sub.status)
  }

  if (type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice
    console.log('Invoice paid:', invoice.id, 'amount:', invoice.amount_paid)
  }

  if (type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    console.error('Invoice payment failed:', invoice.id, invoice.hosted_invoice_url)
  }

  if (type === 'customer.discount.updated') {
    const discount = event.data.object as any
    console.log('Discount updated:', discount.id, 'coupon:', discount.coupon?.id)
  }

  return NextResponse.json({ received: true })
}
