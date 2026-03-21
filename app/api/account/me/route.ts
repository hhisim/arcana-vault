import { NextResponse } from 'next/server'
import { getEntitlement } from '@/lib/account'

export async function GET() {
  const entitlement = await getEntitlement()
  // full_name lives in user_metadata
  const full_name = (entitlement as Record<string, unknown>).user_metadata as Record<string, unknown> | undefined
  return NextResponse.json({
    isAuthenticated: entitlement.isAuthenticated,
    user: entitlement.userId
      ? {
          id: entitlement.userId,
          email: entitlement.email,
          full_name: full_name?.full_name ?? null,
        }
      : null,
    plan: entitlement.plan,
    selectedTraditions: entitlement.selectedTraditions,
    usageUsed: entitlement.usageUsed,
    usageLimit: entitlement.usageLimit,
    usageRemaining: entitlement.usageRemaining,
    guestTotalRemaining: entitlement.guestTotalRemaining,
  })
}
