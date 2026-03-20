import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url)
  const code = requestUrl.searchParams.get('code')
  if (code) {
    const response = NextResponse.redirect(new URL('/account', req.url))
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return req.cookies.get(name)?.value },
          set(name: string, value: string, options: Record<string, unknown>) { response.cookies.set({ name, value, ...options }) },
          remove(name: string, options: Record<string, unknown>) { response.cookies.set({ name, value: '', ...options }) },
        },
      },
    )
    await supabase.auth.exchangeCodeForSession(code)
    return response
  }
  return NextResponse.redirect(new URL('/login', req.url))
}
