import { NextResponse } from 'next/server.js'

export function accountMeFailureResponse() {
  return NextResponse.json(
    { error: 'account_unavailable' },
    { status: 503, headers: { 'Cache-Control': 'no-store' } },
  )
}
