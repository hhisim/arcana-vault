import { NextRequest, NextResponse } from 'next/server'
import { ensureProfile, getCurrentUserLite } from '@/lib/account'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { normalizeSelectedTraditions, TraditionId } from '@/lib/plans'
import { normalizePendingPlan } from '@/lib/billing-flow'

export async function POST(req: NextRequest) {
  const user = await getCurrentUserLite(req.headers.get('authorization'))
  if (!user) return NextResponse.json({ detail: 'Authentication required' }, { status: 401 })

  const profile = await ensureProfile(user)
  const body = await req.json().catch(() => ({}))
  const desired = Array.isArray(body.traditions) ? body.traditions as TraditionId[] : []
  // A pending checkout plan only limits the selections that are saved. It never grants access;
  // the profile remains authoritative for entitlements until Stripe confirms payment.
  const selectionPlan = typeof body.pendingPlan === 'string'
    ? normalizePendingPlan(body.pendingPlan)
    : normalizePendingPlan(profile.plan)
  const next = normalizeSelectedTraditions(selectionPlan, desired)
  const admin = getAdminSupabase()

  const { error: deleteError } = await admin.from('user_traditions').delete().eq('user_id', user.id)
  if (deleteError) return NextResponse.json({ detail: 'Could not update traditions' }, { status: 500 })

  if (next.length) {
    const { error: insertError } = await admin
      .from('user_traditions')
      .insert(next.map((tradition) => ({ user_id: user.id, tradition })))
    if (insertError) return NextResponse.json({ detail: 'Could not save traditions' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, traditions: next })
}
