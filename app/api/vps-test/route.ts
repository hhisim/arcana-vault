import { NextResponse } from 'next/server'

export async function GET() {
  const start = Date.now()
  try {
    const res = await fetch('http://204.168.154.237:8002/health', {
      signal: AbortSignal.timeout(10000),
    })
    const text = await res.text()
    return NextResponse.json({ ok: true, took: Date.now() - start, body: text.slice(0, 100) })
  } catch (e: any) {
    return NextResponse.json({ ok: false, took: Date.now() - start, error: e?.message })
  }
}
