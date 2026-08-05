import { createHash, timingSafeEqual } from 'crypto'

export const ADMIN_COOKIE = 'voa_admin'

/** Deterministic token derived from the admin secret (the raw secret never leaves the server). */
export function adminToken(): string {
  const secret = process.env.ADMIN_SECRET || ''
  return createHash('sha256').update(`voa-admin:${secret}`).digest('hex')
}

/** Constant-time comparison of the provided password against ADMIN_SECRET. */
export function passwordMatches(password: string | null | undefined): boolean {
  if (!password || !process.env.ADMIN_SECRET) return false
  const a = Buffer.from(String(password))
  const b = Buffer.from(process.env.ADMIN_SECRET)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

/** True when the incoming cookie equals the current admin token. */
export function cookieValueMatches(token: string | null | undefined): boolean {
  if (!token) return false
  const a = Buffer.from(token)
  const b = Buffer.from(adminToken())
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}
