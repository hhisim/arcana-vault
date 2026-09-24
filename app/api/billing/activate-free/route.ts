import { NextRequest, NextResponse } from 'next/server'
import { ensureProfile, getCurrentUserLite } from '@/lib/account'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { enqueueAkashaAlert, handleAkashaFreeActivation } from '@/lib/akasha-subscription-alerts'
import { sendAkashaAlertWithOutbox } from '@/lib/akasha-outbox-repository'

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
  try {
    await handleAkashaFreeActivation(
      user.id,
      (alert) => enqueueAkashaAlert(admin, alert),
      async (_message, alert) => { await sendAkashaAlertWithOutbox(admin, alert) },
    )
  } catch (err) {
    // A failed operational alert must not undo a successful free activation.
    console.error('[activate-free] AKASHA alert delivery failed:', err instanceof Error ? err.message : 'unknown error')
  }
  return NextResponse.json({ ok: true })
}
