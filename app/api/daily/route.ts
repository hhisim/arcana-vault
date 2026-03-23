import { NextResponse } from 'next/server'
import { getTodayContent } from '@/lib/daily-content'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const content = await getTodayContent()
    if (!content) {
      return NextResponse.json({ date: new Date().toISOString().slice(0, 10), entries: {} })
    }
    return NextResponse.json(content)
  } catch (error) {
    console.error('[api/daily] GET error:', error)
    return NextResponse.json(
      { date: new Date().toISOString().slice(0, 10), entries: {} },
      { status: 200 }
    )
  }
}
