import { NextRequest, NextResponse } from 'next/server'
import { cookieValueMatches, ADMIN_COOKIE } from '@/lib/admin'
import { getAdminSupabase } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value
  if (!cookieValueMatches(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = (await req.json().catch(() => ({}))) as {
      access_link?: string
      status?: string
    }
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (typeof body.access_link === 'string') updates.access_link = body.access_link.trim()
    if (typeof body.status === 'string') updates.status = body.status

    const admin = getAdminSupabase()
    const { data, error } = await admin
      .from('purchases')
      .update(updates)
      .eq('id', params.id)
      .select('*')
      .single()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ purchase: data })
  } catch (e) {
    console.error('[admin/purchases/update] error:', e)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
