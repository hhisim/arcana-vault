import { NextRequest, NextResponse } from 'next/server'
import { ensureProfile, getCurrentUserLite } from '@/lib/account'
import { getStripe } from '@/lib/stripe'

// Force Node.js runtime — Edge runtime can't reliably reach Stripe
export const runtime = 'nodejs'

function getSiteUrl(req: NextRequest) {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUserLite()
  if (!user) return NextResponse.json({ detail: 'Authentication required' }, { status: 401 })
  const profile = await ensureProfile(user)
  if (!profile.stripe_customer_id) return NextResponse.json({ detail: 'No billing customer found' }, { status: 400 })
  const stripe = getStripe()
  const portal = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${getSiteUrl(req)}/account`,
  })
  return NextResponse.json({ url: portal.url })
}
