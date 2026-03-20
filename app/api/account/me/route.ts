import { NextResponse } from 'next/server'
import { getEntitlement } from '@/lib/account'

export async function GET() {
  const entitlement = await getEntitlement()
  return NextResponse.json({
    isAuthenticated: entitlement.isAuthenticated,
    user: entitlement.userId ? { id: entitlement.userId, email: entitlement.email } : null,
    plan: entitlement.plan,
    selectedTraditions: entitlement.selectedTraditions,
    usageUsed: entitlement.usageUsed,
    usageLimit: entitlement.usageLimit,
    usageRemaining: entitlement.usageRemaining,
    guestTotalRemaining: entitlement.guestTotalRemaining,
  })
}
