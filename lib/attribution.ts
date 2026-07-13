export type FirstTouchAttribution = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  source?: string
  landing_path?: string
  referrer_origin?: string
}

export const FIRST_TOUCH_STORAGE_KEY = 'voa:first-touch-attribution:v1'

const QUERY_FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'source'] as const
const MAX_VALUE_LENGTH = 120
const SAFE_VALUE = /^[A-Za-z0-9._~-]+$/

function safeValue(value: string | null): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > MAX_VALUE_LENGTH || !SAFE_VALUE.test(trimmed)) return undefined
  return trimmed
}

function safePathname(pathname: string): string | undefined {
  if (!pathname || pathname.length > 240 || !pathname.startsWith('/') || pathname.includes('?') || pathname.includes('#')) return undefined
  return pathname
}

function safeOrigin(referrer: string): string | undefined {
  if (!referrer) return undefined
  try {
    const url = new URL(referrer)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.origin : undefined
  } catch {
    return undefined
  }
}

export function createFirstTouchAttribution(url: URL, referrer = ''): FirstTouchAttribution {
  const attribution: FirstTouchAttribution = {}

  for (const field of QUERY_FIELDS) {
    const value = safeValue(url.searchParams.get(field))
    if (value) attribution[field] = value
  }

  const landingPath = safePathname(url.pathname)
  if (landingPath) attribution.landing_path = landingPath
  if (!attribution.source && landingPath === '/redeem/etsy') attribution.source = 'etsy'
  if (!attribution.source && landingPath === '/initiation') attribution.source = 'arcana-initiation'

  const referrerOrigin = safeOrigin(referrer)
  if (referrerOrigin) attribution.referrer_origin = referrerOrigin

  return attribution
}

function readStoredAttribution(): FirstTouchAttribution | undefined {
  try {
    const stored = window.localStorage.getItem(FIRST_TOUCH_STORAGE_KEY)
    if (!stored) return undefined
    const parsed = JSON.parse(stored) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return undefined
    const url = new URL(window.location.origin)
    const candidate = parsed as Record<string, unknown>
    for (const field of QUERY_FIELDS) {
      if (typeof candidate[field] === 'string') url.searchParams.set(field, candidate[field])
    }
    url.pathname = typeof candidate.landing_path === 'string' ? candidate.landing_path : '/'
    return createFirstTouchAttribution(url, typeof candidate.referrer_origin === 'string' ? candidate.referrer_origin : '')
  } catch {
    return undefined
  }
}

export function captureFirstTouchAttribution(): FirstTouchAttribution | undefined {
  if (typeof window === 'undefined') return undefined
  const existing = readStoredAttribution()
  if (existing) return existing

  const attribution = createFirstTouchAttribution(new URL(window.location.href), document.referrer)
  try {
    window.localStorage.setItem(FIRST_TOUCH_STORAGE_KEY, JSON.stringify(attribution))
  } catch {
    // A private-browser storage restriction should never interrupt a capture.
  }
  return attribution
}

export function getFirstTouchAttribution(): FirstTouchAttribution | undefined {
  if (typeof window === 'undefined') return undefined
  return readStoredAttribution() || captureFirstTouchAttribution()
}
