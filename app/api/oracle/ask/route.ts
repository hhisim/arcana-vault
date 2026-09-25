import { NextRequest, NextResponse } from 'next/server'
import { buildGateMessage, canUseTradition, getEntitlement, recordUsage } from '@/lib/account'
import { PlanId, TraditionId } from '@/lib/plans'

const ALLOWED_ORIGINS = [
  'https://www.vaultofarcana.com',
  'https://vaultofarcana.com',
  'https://universal-transmissions.com',
  'https://www.universal-transmissions.com',
]

function getCorsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
  if (origin && ALLOWED_ORIGINS.some(o => origin === o || origin.endsWith(`.${o.replace('https://', '')}`))) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Vary'] = 'Origin'
  }
  return headers
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function guestIdFromCookies(req: NextRequest) {
  return req.cookies.get('voa_guest_id')?.value || crypto.randomUUID()
}

function oracleGateResponse(code: 'guest_limit' | 'auth_required' | 'tradition_locked' | 'daily_limit', tradition: TraditionId, mode: string, plan?: PlanId, origin: string | null = null) {
  const headers = getCorsHeaders(origin)
  return NextResponse.json({
    answer: buildGateMessage(code, plan),
    pack: tradition,
    mode,
    gate: { code, plan },
  }, { headers })
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin')
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) })
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  const body = await req.json().catch(() => ({}))
  const tradition = String(body?.tradition || body?.pack || 'tao') as TraditionId
  const mode = String(body?.mode || 'oracle')
  const q = String(body?.q || '').trim()
  const targetLang = body?.target_lang ? String(body.target_lang) : undefined
  const base = process.env.ORACLE_API_BASE
  if (!base) return NextResponse.json({ answer: 'Oracle backend is not configured.', pack: tradition, mode }, { status: 500, headers: corsHeaders })

  const entitlement = await getEntitlement()

  if (!entitlement.isAuthenticated) {
    const used = entitlement.guestTotalUsed
    if (used >= 3) return oracleGateResponse('guest_limit', tradition, mode, undefined, origin)
  } else {
    if (entitlement.plan === 'guest') return oracleGateResponse('auth_required', tradition, mode, undefined, origin)
    if (!canUseTradition(entitlement, tradition)) return oracleGateResponse('tradition_locked', tradition, mode, entitlement.plan, origin)
    if (entitlement.usageLimit !== 'unlimited' && Number(entitlement.usageRemaining) <= 0) {
      return oracleGateResponse('daily_limit', tradition, mode, entitlement.plan, origin)
    }
  }

  const params = new URLSearchParams({ q, pack: tradition, mode })
  if (targetLang) params.set('target_lang', targetLang)
  // Keep JSON compatibility (and a safe fallback if the streaming proxy key is
  // absent) rather than breaking answers when only one environment is updated.
  const wantsStream = req.headers.get('accept')?.includes('text/event-stream') ?? false
  const streamSecret = process.env.VOA_ORACLE_STREAM_SECRET
  const useStream = wantsStream && Boolean(streamSecret)

  try {
    const upstream = await fetch(useStream
      ? `${base.replace(/\/$/, '')}/ask/stream`
      : `${base.replace(/\/$/, '')}/ask?${params.toString()}`, {
      method: useStream ? 'POST' : 'GET',
      headers: useStream ? { 'Content-Type': 'application/json', 'Accept': 'text/event-stream', 'x-voa-oracle-proxy-secret': streamSecret! } : undefined,
      body: useStream ? JSON.stringify({ q, pack: tradition, mode, target_lang: targetLang, speed: 'fast' }) : undefined,
      cache: 'no-store',
    })

    if (!upstream.ok) {
      const text = await upstream.text()
      return new NextResponse(text, {
        status: upstream.status,
        headers: { ...corsHeaders, 'content-type': upstream.headers.get('content-type') || 'application/json' },
      })
    }

    // Forward bytes unchanged so SSE token boundaries and Unicode survive proxying.
    const response = new NextResponse(upstream.body, {
      status: upstream.status,
      headers: {
        ...corsHeaders,
        'content-type': upstream.headers.get('content-type') || 'application/json',
        'x-accel-buffering': 'no',
        'cache-control': 'no-store',
      },
    })

    if (upstream.ok) {
      if (entitlement.isAuthenticated) {
        await recordUsage({ tradition, userId: entitlement.userId })
      } else {
        const nextTotal = entitlement.guestTotalUsed + 1
        const guestId = guestIdFromCookies(req)
        await recordUsage({ tradition, guestId })
        response.cookies.set('voa_guest_id', guestId, { path: '/', maxAge: 31536000, httpOnly: true, sameSite: 'lax' })
        response.cookies.set('voa_guest_questions_total', String(nextTotal), { path: '/', maxAge: 31536000, httpOnly: true, sameSite: 'lax' })
        response.cookies.set('voa_guest_last_day', todayKey(), { path: '/', maxAge: 31536000, httpOnly: true, sameSite: 'lax' })
      }
    }

    return response
  } catch (error) {
    return NextResponse.json({ answer: error instanceof Error ? error.message : 'Oracle backend unavailable.', pack: tradition, mode }, { status: 503, headers: corsHeaders })
  }
}
