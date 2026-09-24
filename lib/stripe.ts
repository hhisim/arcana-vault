import Stripe from 'stripe'
import { normalizeStripeSecret } from './stripe-secret'

let stripeClient: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeClient) {
    const secretKey = normalizeStripeSecret(process.env.STRIPE_SECRET_KEY)
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }

    stripeClient = new Stripe(secretKey, {
      httpClient: Stripe.createFetchHttpClient(),
    })
  }

  return stripeClient
}
