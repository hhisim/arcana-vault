import { NextRequest, NextResponse } from 'next/server'
import { buildGateMessage, canUseTradition, getCurrentUserLite, getEntitlement, recordUsage } from '@/lib/account'
import { PlanId, TraditionId } from '@/lib/plans'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function guestIdFromCookies(req: NextRequest) {
  return req.cookies.get('voa_guest_id')?.value || crypto.randomUUID()
}

function oracleGateResponse(code: 'guest_limit' | 'auth_required' | 'tradition_locked' | 'daily_limit', tradition: TraditionId, mode: string, plan?: PlanId) {
  return NextResponse.json({
    answer: buildGateMessage(code, plan),
    pack: tradition,
    mode,
    gate: { code, plan },
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const tradition = String(body?.tradition || body?.pack || 'tao') as TraditionId
  const mode = String(body?.mode || 'oracle')
  const q = String(body?.q || '').trim()
  const targetLang = body?.target_lang ? String(body.target_lang) : undefined
  const base = process.env.ORACLE_API_BASE
  if (!base) return NextResponse.json({ answer: 'Oracle backend is not configured.', pack: tradition, mode }, { status: 500 })

  const entitlement = await getEntitlement()

  if (!entitlement.isAuthenticated) {
    const used = entitlement.guestTotalUsed
    if (used >= 3) return oracleGateResponse('guest_limit', tradition, mode)
  } else {
    if (entitlement.plan === 'guest') return oracleGateResponse('auth_required', tradition, mode)
    if (!canUseTradition(entitlement, tradition)) return oracleGateResponse('tradition_locked', tradition, mode, entitlement.plan)
    if (entitlement.usageLimit !== 'unlimited' && Number(entitlement.usageRemaining) <= 0) {
      return oracleGateResponse('daily_limit', tradition, mode, entitlement.plan)
    }
  }

  const params = new URLSearchParams({ q, pack: tradition, mode })
  if (targetLang) params.set('target_lang', targetLang)

  try {
    const upstream = await fetch(`${base.replace(/\/$/, '')}/ask?${params.toString()}`, { method: 'GET', cache: 'no-store' })
    const text = await upstream.text()
    const response = new NextResponse(text, {
      status: upstream.status,
      headers: { 'content-type': upstream.headers.get('content-type') || 'application/json' },
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
    return NextResponse.json({ answer: error instanceof Error ? error.message : 'Oracle backend unavailable.', pack: tradition, mode }, { status: 503 })
  }
}
