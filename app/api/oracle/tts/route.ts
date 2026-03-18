import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const base = process.env.ORACLE_API_BASE
  if (!base) {
    return NextResponse.json({ detail: 'ORACLE_API_BASE is not set.' }, { status: 500 })
  }

  const payload = await request.json()
  const params = new URLSearchParams({
    text: String(payload.text ?? ''),
    lang: String(payload.lang ?? 'en'),
  })

  try {
    const response = await fetch(`${base.replace(/\/$/, '')}/tts?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    })

    if (!response.ok) {
      const text = await response.text()
      return new NextResponse(text, {
        status: response.status,
        headers: { 'content-type': response.headers.get('content-type') ?? 'application/json' },
      })
    }

    const audio = await response.arrayBuffer()
    return new NextResponse(audio, {
      status: 200,
      headers: { 'content-type': response.headers.get('content-type') ?? 'audio/ogg' },
    })
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : 'Unknown error' },
      { status: 503 },
    )
  }
}
