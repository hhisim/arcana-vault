import { NextRequest, NextResponse } from 'next/server'
import { PLAN_CONFIG, PlanId } from '@/lib/plans'

/**
 * GET /api/debug/checkout-test?plan=seeker
 *
 * Tests each component of the checkout flow independently.
 * Does NOT actually create a Stripe session — just verifies everything is configured.
 *
 * Remove this route before going to production.
 */
export async function GET(req: NextRequest) {
  const plan = (req.nextUrl.searchParams.get('plan') || 'seeker') as PlanId
  const results: Record<string, unknown> = { plan, timestamp: new Date().toISOString() }

  // 1. Check plan config
  const cfg = PLAN_CONFIG[plan]
  results.planConfig = cfg ? {
    name: cfg.name,
    priceMonthly: cfg.priceMonthly,
    stripePriceId: cfg.stripePriceId || 'MISSING!',
    stripePriceIdLength: cfg.stripePriceId?.length ?? 0,
    stripePriceIdStartsWithPrice: cfg.stripePriceId?.startsWith('price_') ?? false,
  } : 'PLAN NOT FOUND'

  // 2. Check env vars
  results.envVars = {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'NOT SET',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'MISSING',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'MISSING',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'MISSING',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? `set (${process.env.STRIPE_SECRET_KEY.substring(0, 7)}...)` : 'MISSING',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? 'set' : 'MISSING',
    // Check all NEXT_PUBLIC price IDs (these are inlined at build time)
    NEXT_PUBLIC_STRIPE_PRICE_SEEKER: process.env.NEXT_PUBLIC_STRIPE_PRICE_SEEKER_MONTHLY || 'MISSING/EMPTY',
    NEXT_PUBLIC_STRIPE_PRICE_ADEPT: process.env.NEXT_PUBLIC_STRIPE_PRICE_ADEPT_MONTHLY || 'MISSING/EMPTY',
    NEXT_PUBLIC_STRIPE_PRICE_MAGISTER: process.env.NEXT_PUBLIC_STRIPE_PRICE_MAGISTER_MONTHLY || 'MISSING/EMPTY',
    // Server-side price IDs
    STRIPE_PRICE_SEEKER: process.env.STRIPE_PRICE_SEEKER_MONTHLY || 'MISSING/EMPTY',
    STRIPE_PRICE_ADEPT: process.env.STRIPE_PRICE_ADEPT_MONTHLY || 'MISSING/EMPTY',
    STRIPE_PRICE_MAGISTER: process.env.STRIPE_PRICE_MAGISTER_MONTHLY || 'MISSING/EMPTY',
  }

  // 3. Test Stripe connection
  try {
    const { getStripe } = await import('@/lib/stripe')
    const stripe = getStripe()
    // Just list 1 price to verify the connection works
    const prices = await stripe.prices.list({ limit: 1 })
    results.stripe = { connected: true, priceCount: prices.data.length }

    // Verify the specific price ID exists
    if (cfg?.stripePriceId) {
      try {
        const price = await stripe.prices.retrieve(cfg.stripePriceId)
        results.stripePriceValid = {
          id: price.id,
          active: price.active,
          currency: price.currency,
          unitAmount: price.unit_amount,
          recurring: price.recurring?.interval,
        }
      } catch (priceErr) {
        results.stripePriceValid = {
          error: `Price ID "${cfg.stripePriceId}" not found in Stripe: ${priceErr instanceof Error ? priceErr.message : String(priceErr)}`,
        }
      }
    }
  } catch (stripeErr) {
    results.stripe = { connected: false, error: stripeErr instanceof Error ? stripeErr.message : String(stripeErr) }
  }

  // 4. Test Supabase connection
  try {
    const { getAdminSupabase } = await import('@/lib/supabase/admin')
    const admin = getAdminSupabase()
    const { count, error } = await admin.from('profiles').select('*', { head: true, count: 'exact' })
    results.supabase = error
      ? { connected: false, error: error.message }
      : { connected: true, profileCount: count }
  } catch (supErr) {
    results.supabase = { connected: false, error: supErr instanceof Error ? supErr.message : String(supErr) }
  }

  // 5. Test Bearer auth (with a dummy token for format check)
  const authHeader = req.headers.get('Authorization')
  if (authHeader) {
    try {
      const { getCurrentUserLite } = await import('@/lib/account')
      const user = await getCurrentUserLite(authHeader)
      results.bearerAuth = user
        ? { success: true, userId: user.id, email: user.email }
        : { success: false, detail: 'Token valid format but user not found' }
    } catch (authErr) {
      results.bearerAuth = { success: false, error: authErr instanceof Error ? authErr.message : String(authErr) }
    }
  } else {
    results.bearerAuth = { skipped: 'No Authorization header. Add ?test_auth=1 and paste Bearer token to test.' }
  }

  // 6. Summary
  const issues: string[] = []
  if (!cfg?.stripePriceId) issues.push(`stripePriceId is undefined for plan "${plan}" — NEXT_PUBLIC_STRIPE_PRICE_*_MONTHLY env vars may not be set at BUILD TIME on Vercel`)
  if (cfg?.stripePriceId && !cfg.stripePriceId.startsWith('price_')) issues.push(`stripePriceId "${cfg.stripePriceId}" doesn't start with "price_" — might be base64-encoded or wrong value`)
  if (!process.env.STRIPE_SECRET_KEY) issues.push('STRIPE_SECRET_KEY is missing')
  if (!process.env.NEXT_PUBLIC_SITE_URL) issues.push('NEXT_PUBLIC_SITE_URL is not set')
  if (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('vaultofarcana') && !process.env.NEXT_PUBLIC_SITE_URL.includes('codexoracle')) {
    issues.push(`NEXT_PUBLIC_SITE_URL is "${process.env.NEXT_PUBLIC_SITE_URL}" — make sure this matches your actual domain`)
  }
  results.issues = issues.length > 0 ? issues : ['No issues detected']

  return NextResponse.json(results, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
