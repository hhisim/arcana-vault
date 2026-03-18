import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const base = process.env.ORACLE_API_BASE
  if (!base) {
    return NextResponse.json({ detail: 'ORACLE_API_BASE is not set.' }, { status: 500 })
  }

  const incoming = await request.formData()
  const file = incoming.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ detail: 'A file field is required.' }, { status: 400 })
  }

  const form = new FormData()
  form.set('file', file, file.name || 'voice.ogg')

  try {
    const response = await fetch(`${base.replace(/\/$/, '')}/stt`, {
      method: 'POST',
      body: form,
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
