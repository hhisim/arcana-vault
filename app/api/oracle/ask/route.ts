import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const base = process.env.ORACLE_API_BASE
  if (!base) {
    return NextResponse.json({ detail: 'ORACLE_API_BASE is not set.' }, { status: 500 })
  }

  const payload = await request.json()
  const params = new URLSearchParams({
    q: String(payload.q ?? ''),
    pack: String(payload.pack ?? 'tao'),
    mode: String(payload.mode ?? 'oracle'),
  })

  if (payload.target_lang) {
    params.set('target_lang', String(payload.target_lang))
  }

  try {
    const response = await fetch(`${base.replace(/\/$/, '')}/ask?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    })

    const text = await response.text()
    return new NextResponse(text, {
      status: response.status,
      headers: { 'content-type': response.headers.get('content-type') ?? 'application/json' },
    })
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : 'Unknown error' },
      { status: 503 },
    )
  }
}
