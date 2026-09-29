import { NextResponse, type NextRequest } from 'next/server'
import {
  isGuideTradition,
  issueGuideToken,
  verifyGuideToken,
  type GuideTradition,
} from '@/lib/guide-tokens'

/**
 * GET  /api/free-grimoire?tradition=tarot[&token=...]
 *   -> unlock state for one tradition
 *
 * POST /api/free-grimoire  { email, tradition }
 *   -> subscribes to Brevo, returns a signed download token
 *
 * A token is issued even if the mail provider fails: a reader should not be
 * locked out because a webhook blipped, and a lost lead costs more than a
 * slightly leaky magnet.
 */

export const dynamic = 'force-dynamic'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function subscribeToBrevo(
  email: string,
  tradition: GuideTradition,
  source: string
): Promise<{ subscribed: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY
  const listId =
    process.env.BREVO_GUIDE_LIST_ID ||
    process.env.BREVO_ARCANA_INITIATION_LIST_ID ||
    process.env.BREVO_LIST_ID

  if (!apiKey || !listId) {
    console.error('[free-grimoire] Brevo not configured')
    return { subscribed: false, error: 'Email service is not configured.' }
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { accept: 'application/json', 'content-type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify({
        email,
        listIds: [parseInt(listId, 10)],
        updateEnabled: true,
        attributes: { TRADITION: tradition, SOURCE: source },
      }),
    })

    if (res.ok) return { subscribed: true }

    const data = await res.json().catch(() => ({}))
    if (data?.code === 'duplicate_parameter' || data?.code === 'already_exists') {
      return { subscribed: true }
    }
    console.error('[free-grimoire] brevo error', data)
    return { subscribed: false, error: 'Failed to subscribe. Please try again.' }
  } catch (error) {
    console.error('[free-grimoire] brevo request failed', error)
    return { subscribed: false, error: 'Failed to subscribe. Please try again.' }
  }
}

export async function GET(request: NextRequest) {
  const tradition = request.nextUrl.searchParams.get('tradition')
  if (!isGuideTradition(tradition)) {
    return NextResponse.json({ error: 'Unknown tradition.' }, { status: 400 })
  }

  const token = request.nextUrl.searchParams.get('token')
  const unlocked = verifyGuideToken(token) === tradition
  return NextResponse.json({ tradition, unlocked, ...(unlocked ? { token } : {}) })
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; tradition?: string; source?: string }
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const tradition = body.tradition
    const source = typeof body.source === 'string' ? body.source : 'free-grimoire'

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email format.' }, { status: 400 })
    }
    if (!isGuideTradition(tradition)) {
      return NextResponse.json({ success: false, error: 'Unknown tradition.' }, { status: 400 })
    }

    const { subscribed } = await subscribeToBrevo(email, tradition, source)
    const token = issueGuideToken(tradition)

    return NextResponse.json({
      success: true,
      subscribed,
      token,
      guideUrl: `/guides/${tradition}?t=${encodeURIComponent(token)}`,
    })
  } catch (error) {
    console.error('[free-grimoire] unexpected', error)
    return NextResponse.json({ success: false, error: 'Something went wrong.' }, { status: 500 })
  }
}
