import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const base = process.env.ORACLE_API_BASE

  if (!base) {
    return NextResponse.json(
      { status: 'misconfigured', detail: 'ORACLE_API_BASE is not set.' },
      { status: 500 },
    )
  }

  try {
    const response = await fetch(`${base.replace(/\/$/, '')}/health`, {
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
      {
        status: 'unreachable',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 },
    )
  }
}
