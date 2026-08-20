import { NextRequest, NextResponse } from 'next/server'
import { cookieValueMatches, ADMIN_COOKIE } from '@/lib/admin'
import { getAdminSupabase } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value
  if (!cookieValueMatches(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const admin = getAdminSupabase()
    const { data, error } = await admin
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ purchases: data ?? [] })
  } catch (e) {
    console.error('[admin/purchases] error:', e)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
