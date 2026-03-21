import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Server Supabase client for use in Server Components and Route Handlers.
 *
 * NOTE: This client is READ-ONLY for cookies. It can read the current session
 * but cannot write updated tokens back to the browser. For routes that need
 * to write cookies (like auth callbacks), create a client with writable
 * cookie handlers on the NextResponse object directly.
 *
 * For authenticating fresh signups where cookies may not exist yet,
 * use getCurrentUserLite(bearerToken) which accepts a JWT directly.
 */
export async function getServerSupabase() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) throw new Error('Supabase env vars are missing')
  return createServerClient(url, anon, {
    cookies: {
      get(name: string) { return cookieStore.get(name)?.value },
      set() {},
      remove() {},
    },
  })
}
