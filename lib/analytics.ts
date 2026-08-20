'use client'

import { track as vercelTrack } from '@vercel/analytics'

type AnalyticsPrimitive = string | number | boolean

type AnalyticsPayload = Record<string, AnalyticsPrimitive | null | undefined>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function sanitizePayload(payload: AnalyticsPayload): Record<string, AnalyticsPrimitive> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== '')
  ) as Record<string, AnalyticsPrimitive>
}

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}) {
  const cleanPayload = sanitizePayload(payload)

  try {
    vercelTrack(eventName, cleanPayload)
  } catch (error) {
    console.error('[analytics] vercel track failed:', error)
  }

  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, cleanPayload)
    } catch (error) {
      console.error('[analytics] gtag failed:', error)
    }
  }
}
