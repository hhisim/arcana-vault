import Stripe from 'stripe'

let stripeClient: Stripe | null = null

export function getStripe() {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY missing')
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {})
  }
  return stripeClient
}
