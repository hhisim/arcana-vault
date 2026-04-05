import { NextResponse } from 'next/server'
import { ensureProfile, getCurrentUserLite } from '@/lib/account'
import { getAdminSupabase } from '@/lib/supabase/admin'

export async function POST() {
  const user = await getCurrentUserLite()
  if (!user) return NextResponse.json({ detail: 'Authentication required' }, { status: 401 })
  await ensureProfile(user)
  const admin = getAdminSupabase()
  await admin.from('profiles').update({ plan: 'free', subscription_status: 'active' }).eq('user_id', user.id)
  return NextResponse.json({ ok: true })
}
