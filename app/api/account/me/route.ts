import { NextResponse } from 'next/server'
import { getEntitlement } from '@/lib/account'

export async function GET() {
  try {
    const entitlement = await Promise.race([
      getEntitlement(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Account API timeout')), 5000)
      ),
    ])
    return NextResponse.json({
      isAuthenticated: entitlement.isAuthenticated,
      user: entitlement.userId
        ? { id: entitlement.userId, email: entitlement.email, full_name: null }
        : null,
      plan: entitlement.plan,
      selectedTraditions: entitlement.selectedTraditions,
      usageUsed: entitlement.usageUsed,
      usageLimit: entitlement.usageLimit,
      usageRemaining: entitlement.usageRemaining,
      guestTotalRemaining: entitlement.guestTotalRemaining,
      // Trial info
      isTrial: entitlement.isTrial,
      trialEndsAt: entitlement.trialEndsAt,
      trialDaysRemaining: entitlement.trialDaysRemaining,
      promoSource: entitlement.promoSource,
      // Test mode
      isTestMode: entitlement.isTestMode,
    })
  } catch (err) {
    console.error('[account/me]', err)
    return NextResponse.json({
      isAuthenticated: false, user: null, plan: 'guest',
      selectedTraditions: ['tao', 'tarot', 'tantra', 'entheogen', 'sufi', 'dreamwalker'],
      usageUsed: 0, usageLimit: 3, usageRemaining: 3, guestTotalRemaining: 3,
      isTrial: false, trialEndsAt: null, trialDaysRemaining: null, promoSource: null,
      isTestMode: false,
    })
  }
}
