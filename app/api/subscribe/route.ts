import { NextRequest, NextResponse } from 'next/server'

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_LIST_ID = process.env.BREVO_LIST_ID
const MARKETING_WEBHOOK_URL = process.env.SIGNUP_WEBHOOK_URL || process.env.MARKETING_WEBHOOK_URL

type SubscribeBody = {
  email?: string
  listKey?: string
  source?: string
  name?: string
  plan?: string
  context?: string
  metadata?: Record<string, unknown>
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function sendMarketingWebhook(payload: Record<string, unknown>) {
  if (!MARKETING_WEBHOOK_URL) {
    return { attempted: false, success: false }
  }

  try {
    const response = await fetch(MARKETING_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[subscribe] marketing webhook error:', response.status, errorText)
      return { attempted: true, success: false }
    }

    return { attempted: true, success: true }
  } catch (error) {
    console.error('[subscribe] marketing webhook request failed:', error)
    return { attempted: true, success: false }
  }
}

async function upsertBrevoContact(email: string, listKey: string) {
  if (!BREVO_API_KEY) {
    console.error('[subscribe] BREVO_API_KEY is not set in environment variables.')
    return { attempted: false, success: false, error: 'Email service is not configured.' }
  }

  const listEnvMap: Record<string, string | undefined> = {
    default: BREVO_LIST_ID,
    'arcana-initiation': process.env.BREVO_ARCANA_INITIATION_LIST_ID || BREVO_LIST_ID,
  }

  const resolvedListKey = listKey in listEnvMap ? listKey : 'default'
  const resolvedListId = listEnvMap[resolvedListKey]

  if (!resolvedListId) {
    console.error('[subscribe] No Brevo list configured for list key:', resolvedListKey)
    return { attempted: true, success: false, error: 'Email list is not configured.' }
  }

  const listId = parseInt(resolvedListId, 10)
  if (Number.isNaN(listId)) {
    console.error('[subscribe] Resolved Brevo list ID is not a valid number:', resolvedListId)
    return { attempted: true, success: false, error: 'Email list ID is misconfigured.' }
  }

  const response = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify({
      email: email.toLowerCase().trim(),
      listIds: [listId],
      updateEnabled: true,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    console.error('[subscribe] Brevo API error:', data)
    if (data.code === 'duplicate_parameter' || data.code === 'already_exists') {
      return { attempted: true, success: true }
    }

    return { attempted: true, success: false, error: 'Failed to subscribe. Please try again.' }
  }

  return { attempted: true, success: true }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SubscribeBody
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const listKey = typeof body.listKey === 'string' && body.listKey ? body.listKey : 'default'
    const source = typeof body.source === 'string' && body.source ? body.source : 'unknown'
    const name = typeof body.name === 'string' ? body.name.trim() : undefined
    const plan = typeof body.plan === 'string' ? body.plan : undefined
    const context = typeof body.context === 'string' && body.context ? body.context : 'email-capture'
    const metadata = body.metadata && typeof body.metadata === 'object' ? body.metadata : undefined

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email format.' }, { status: 400 })
    }

    const brevoResult = await upsertBrevoContact(email, listKey)

    const webhookPayload = {
      event: context === 'account-signup' ? 'signup_subscribed' : 'email_subscribed',
      email,
      listKey,
      source,
      context,
      name,
      plan,
      metadata,
      submittedAt: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || undefined,
      referrer: request.headers.get('referer') || undefined,
    }

    const webhookResult = await sendMarketingWebhook(webhookPayload)

    console.log('[subscribe] subscription request', {
      email,
      listKey,
      source,
      context,
      brevoAttempted: brevoResult.attempted,
      brevoSuccess: brevoResult.success,
      webhookAttempted: webhookResult.attempted,
      webhookSuccess: webhookResult.success,
    })

    if (brevoResult.success || webhookResult.success) {
      return NextResponse.json({ success: true })
    }

    if (!brevoResult.attempted && !webhookResult.attempted) {
      return NextResponse.json(
        { success: false, error: 'No subscription destination is configured.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: false, error: brevoResult.error || 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  } catch (error) {
    console.error('[subscribe] Unexpected error:', error)
    return NextResponse.json({ success: false, error: 'An unexpected error occurred.' }, { status: 500 })
  }
}
