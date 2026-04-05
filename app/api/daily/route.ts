import { NextResponse } from 'next/server'
import { getTodayContent, generateTodayContent } from '@/lib/daily-content'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const content = await getTodayContent()
    // If no content exists for today, generate it on demand
    if (!content || Object.keys(content.entries).length === 0) {
      const generated = await generateTodayContent()
      return NextResponse.json(generated)
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
