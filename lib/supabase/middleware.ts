import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { applySupabaseCookieBatch } from '@/lib/supabase-cookie-batch'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return response

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        response = applySupabaseCookieBatch(
          request,
          (updatedRequest) => NextResponse.next({ request: updatedRequest }),
          cookiesToSet,
        )
      },
    },
  })

  // IMPORTANT: await getUser() so the session token refresh actually completes
  // and the updated cookies are written to the response.
  // The original code used `void` which meant token refresh was fire-and-forget.
  await supabase.auth.getUser()

  return response
}
