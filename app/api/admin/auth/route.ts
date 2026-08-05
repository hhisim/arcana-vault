import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, adminToken, passwordMatches } from '@/lib/admin'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { password } = (await req.json().catch(() => ({}))) as { password?: string }
    if (!passwordMatches(password)) {
      return NextResponse.json({ ok: false, detail: 'Invalid password.' }, { status: 401 })
    }
    const res = NextResponse.json({ ok: true })
    res.cookies.set(ADMIN_COOKIE, adminToken(), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12, // 12h
    })
    return res
  } catch (e) {
    console.error('[admin/auth] error:', e)
    return NextResponse.json({ ok: false, detail: 'Server error.' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest) {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return res
}
