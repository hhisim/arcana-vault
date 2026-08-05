import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { getCurrentUserLite } from '@/lib/account'
import { packFromSku } from '@/lib/shop'

// Force Node.js runtime — Edge can't reliably reach Stripe
export const runtime = 'nodejs'

/**
 * One-time (mode: 'payment') checkout for an esoteric archive pack.
 * Unlike the subscription checkout, this works for guests too — Stripe
 * collects the buyer's email. If the buyer is logged in we attach user_id.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const sku = typeof body.sku === 'string' && body.sku ? body.sku : undefined
    const pack = packFromSku(sku)
    if (!pack) {
      return NextResponse.json({ detail: 'Unknown pack SKU.' }, { status: 400 })
    }

    // Optional auth — guest purchases are allowed.
    let user: { id: string; email?: string | null } | null = null
    try {
      const ah = req.headers.get('Authorization')
      user = ((await (ah ? getCurrentUserLite(ah) : getCurrentUserLite())) as { id: string; email?: string | null } | null) ?? null
    } catch {
      user = null
    }

    const stripe = getStripe()
    const site = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin

    const metadata: Record<string, string> = { sku: pack.sku, source: 'voa-shop' }
    if (user) metadata.user_id = user.id

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      line_items: [{ price: pack.stripePriceId, quantity: 1 }],
      success_url: `${site}/shop/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/shop?cancelled=1`,
      allow_promotion_codes: true,
      customer_creation: 'always',
      metadata,
    }
    if (user?.email) params.customer_email = user.email

    const session = await stripe.checkout.sessions.create(params)
    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[shop/checkout] error:', message)
    return NextResponse.json({ detail: `Checkout error: ${message}` }, { status: 500 })
  }
}
