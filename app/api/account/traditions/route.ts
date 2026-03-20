import { NextRequest, NextResponse } from 'next/server'
import { ensureProfile, getCurrentUserLite } from '@/lib/account'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { normalizeSelectedTraditions, TraditionId } from '@/lib/plans'

export async function POST(req: NextRequest) {
  const user = await getCurrentUserLite()
  if (!user) return NextResponse.json({ detail: 'Authentication required' }, { status: 401 })

  const profile = await ensureProfile(user)
  const body = await req.json().catch(() => ({}))
  const desired = Array.isArray(body.traditions) ? body.traditions as TraditionId[] : []
  const next = normalizeSelectedTraditions(profile.plan, desired)
  const admin = getAdminSupabase()

  await admin.from('user_traditions').delete().eq('user_id', user.id)
  if (next.length) {
    await admin.from('user_traditions').insert(next.map((tradition) => ({ user_id: user.id, tradition })))
  }

  return NextResponse.json({ ok: true, traditions: next })
}
