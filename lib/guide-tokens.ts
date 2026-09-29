import crypto from 'crypto'

/**
 * Signed, expiring unlock tokens for the free tradition guides.
 *
 * Lives in lib/ rather than the route file because Next.js route modules may only
 * export HTTP handlers.
 */

export const GUIDE_TRADITIONS = [
  'tarot',
  'kabbalah',
  'hermeticism',
  'alchemy',
  'sacred-geometry',
  'taoism',
  'sufism',
] as const

export type GuideTradition = (typeof GUIDE_TRADITIONS)[number]

export function isGuideTradition(value: unknown): value is GuideTradition {
  return typeof value === 'string' && (GUIDE_TRADITIONS as readonly string[]).includes(value)
}

function secret(): string {
  return (
    process.env.FREE_GUIDE_SIGNING_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'voa-dev-fallback'
  )
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', secret()).update(payload).digest('hex').slice(0, 24)
}

/** token = base64url(tradition.expiryMs).signature */
export function issueGuideToken(tradition: GuideTradition, days = 30): string {
  const exp = Date.now() + days * 24 * 60 * 60 * 1000
  const body = Buffer.from(`${tradition}.${exp}`).toString('base64url')
  return `${body}.${sign(body)}`
}

export function verifyGuideToken(token: string | null | undefined): GuideTradition | null {
  if (!token || !token.includes('.')) return null
  const [body, sig] = token.split('.')
  if (!body || !sig || sign(body) !== sig) return null

  let decoded: string
  try {
    decoded = Buffer.from(body, 'base64url').toString()
  } catch {
    return null
  }

  const [tradition, expStr] = decoded.split('.')
  if (!isGuideTradition(tradition)) return null
  if (!expStr || Number(expStr) < Date.now()) return null
  return tradition
}
