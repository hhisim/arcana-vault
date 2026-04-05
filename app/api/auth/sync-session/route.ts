import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const accessToken = String(body.access_token || '')
  const refreshToken = String(body.refresh_token || '')

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ detail: 'Missing tokens' }, { status: 400 })
  }

  // Build a response first, then use supabase.setSession which reads from + writes to cookies
  const response = NextResponse.json({ ok: true })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, opts: Record<string, unknown>) {
          response.cookies.set({ name, value, ...opts })
        },
        remove(name: string, opts: Record<string, unknown>) {
          response.cookies.set({ name, value: '', ...opts })
        },
      },
    },
  )

  const { data, error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
  if (error) {
    return NextResponse.json({ detail: error.message }, { status: 401 })
  }

  return response
}
