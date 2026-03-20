import Stripe from 'stripe'

let stripeClient: Stripe | null = null

export function getStripe() {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY missing')
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion })
  }
  return stripeClient
}
