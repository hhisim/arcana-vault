import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getAdminSupabase } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url)
  const code = requestUrl.searchParams.get('code')
  const promo = requestUrl.searchParams.get('promo')
  const promoPlan = requestUrl.searchParams.get('plan') || 'seeker'
  const promoDays = Math.min(Number(requestUrl.searchParams.get('days')) || 30, 90)

  if (code) {
    const redirectTo = promo ? '/account' : '/inquiry'
    const response = NextResponse.redirect(new URL(redirectTo, req.url))
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
    const { data } = await supabase.auth.exchangeCodeForSession(code)

    // If this was a promo signup (e.g. Etsy), activate the trial
    if (promo && data?.user) {
      try {
        const allowedPlans = ['seeker', 'adept']
        const plan = allowedPlans.includes(promoPlan) ? promoPlan : 'seeker'
        const admin = getAdminSupabase()

        // Check if trial already exists
        const { data: profile } = await admin.from('profiles').select('trial_ends_at, stripe_subscription_id, subscription_status').eq('user_id', data.user.id).maybeSingle()
        const hasActiveTrial = profile?.trial_ends_at && new Date(profile.trial_ends_at) > new Date()
        const hasPaidSub = profile?.stripe_subscription_id && profile?.subscription_status === 'active'

        if (!hasActiveTrial && !hasPaidSub) {
          const trialEnd = new Date()
          trialEnd.setDate(trialEnd.getDate() + promoDays)
          await admin.from('profiles').update({
            plan,
            subscription_status: 'trialing',
            trial_ends_at: trialEnd.toISOString(),
            promo_source: promo,
          }).eq('user_id', data.user.id)
          console.log(`[auth/callback] Activated ${plan} trial for ${data.user.email} via promo=${promo}`)
        }
      } catch (err) {
        console.error('[auth/callback] Trial activation failed:', err instanceof Error ? err.message : String(err))
        // Non-fatal — user still gets logged in, just without trial
      }
    }

    return response
  }

  return NextResponse.redirect(new URL('/login', req.url))
}
