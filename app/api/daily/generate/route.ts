import { NextRequest, NextResponse } from 'next/server'
import { getTodayContent, generateTodayContent } from '@/lib/daily-content'

export async function POST(req: NextRequest) {
  // Validate secret key
  const secret = req.headers.get('x-daily-secret')
  const expectedKey = process.env.DAILY_SECRET_KEY

  if (!expectedKey) {
    return NextResponse.json({ error: 'DAILY_SECRET_KEY not configured' }, { status: 500 })
  }

  if (!secret || secret !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Check if we already have today's content
    const existing = await getTodayContent()
    if (existing && Object.keys(existing.entries).length > 0) {
      return NextResponse.json({ date: existing.date, entries: existing.entries, status: 'existing' })
    }

    // Generate fresh content
    const content = await generateTodayContent()
    return NextResponse.json({ date: content.date, entries: content.entries, status: 'generated' })
  } catch (error) {
    console.error('[api/daily/generate] error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    )
  }
}
