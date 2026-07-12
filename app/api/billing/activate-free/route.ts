import { NextRequest, NextResponse } from 'next/server'
import { ensureProfile, getCurrentUserLite } from '@/lib/account'
import { getAdminSupabase } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const user = await getCurrentUserLite(req.headers.get('authorization'))
  if (!user) return NextResponse.json({ detail: 'Authentication required' }, { status: 401 })
  await ensureProfile(user)
  const admin = getAdminSupabase()
  const { error } = await admin
    .from('profiles')
    .update({ plan: 'free', subscription_status: 'active' })
    .eq('user_id', user.id)
  if (error) return NextResponse.json({ detail: 'Could not activate the free plan' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
