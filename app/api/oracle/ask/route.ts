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
  const speed = body?.speed ? String(body.speed) : undefined
  if (speed) params.set('speed', speed)

  try {
    const upstream = await fetch(`${base.replace(/\/$/, '')}/ask?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    })

    if (!upstream.ok) {
      const text = await upstream.text()
      return new NextResponse(text, {
        status: upstream.status,
        headers: { ...corsHeaders, 'content-type': upstream.headers.get('content-type') || 'application/json' },
      })
    }

    // Stream the response body directly to the client
    const stream = new ReadableStream({
      async start(controller) {
        const reader = upstream.body!.getReader()
        const encoder = new TextEncoder()
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              controller.close()
              break
            }
            controller.enqueue(encoder.encode(new TextDecoder().decode(value)))
          }
        } catch (e) {
          controller.error(e)
        }
      },
    })

    const response = new NextResponse(stream, {
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
