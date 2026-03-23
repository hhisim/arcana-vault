import { NextRequest, NextResponse } from 'next/server'

const BREVO_API_KEY = process.env.BREVO_API_KEY
// TODO: Hakan — create "The Transmission" list in Brevo and add the list ID here.
// Find it at: https://app.brevo.com/lists
// The LIST_ID should be a number, e.g. 12345
const BREVO_LIST_ID = process.env.BREVO_LIST_ID

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email format.' }, { status: 400 })
    }

    if (!BREVO_API_KEY) {
      console.error('[subscribe] BREVO_API_KEY is not set in environment variables.')
      return NextResponse.json({ success: false, error: 'Email service is not configured.' }, { status: 500 })
    }

    if (!BREVO_LIST_ID) {
      console.error('[subscribe] BREVO_LIST_ID is not set in environment variables.')
      return NextResponse.json({ success: false, error: 'Email list is not configured.' }, { status: 500 })
    }

    const listId = parseInt(BREVO_LIST_ID, 10)
    if (isNaN(listId)) {
      console.error('[subscribe] BREVO_LIST_ID is not a valid number:', BREVO_LIST_ID)
      return NextResponse.json({ success: false, error: 'Email list ID is misconfigured.' }, { status: 500 })
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
      // Duplicate email is not really an error with updateEnabled: true,
      // but Brevo may return 400 for various reasons. Treat 400 with code "duplicate" gracefully.
      if (data.code === 'duplicate_parameter' || data.code === 'already_exists') {
        return NextResponse.json({ success: true })
      }
      return NextResponse.json(
        { success: false, error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[subscribe] Unexpected error:', error)
    return NextResponse.json({ success: false, error: 'An unexpected error occurred.' }, { status: 500 })
  }
}
