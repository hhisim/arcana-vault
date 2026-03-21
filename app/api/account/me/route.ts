import { NextResponse } from 'next/server'
import { getEntitlement } from '@/lib/account'

export async function GET() {
  try {
    // 5-second timeout prevents the API from hanging indefinitely
    const entitlement = await Promise.race([
      getEntitlement(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Account API timeout')), 5000)
      ),
    ])
    return NextResponse.json({
      isAuthenticated: entitlement.isAuthenticated,
      user: entitlement.userId
        ? {
            id: entitlement.userId,
            email: entitlement.email,
            full_name: null,
          }
        : null,
      plan: entitlement.plan,
      selectedTraditions: entitlement.selectedTraditions,
      usageUsed: entitlement.usageUsed,
      usageLimit: entitlement.usageLimit,
      usageRemaining: entitlement.usageRemaining,
      guestTotalRemaining: entitlement.guestTotalRemaining,
    })
  } catch (err) {
    console.error('[account/me]', err)
    // Return guest state on error so the page still loads
    return NextResponse.json({
      isAuthenticated: false,
      user: null,
      plan: 'guest',
      selectedTraditions: ['tao', 'tarot', 'tantra', 'entheogen', 'sufi', 'dreamwalker'],
      usageUsed: 0,
      usageLimit: 3,
      usageRemaining: 3,
      guestTotalRemaining: 3,
    })
  }
}
