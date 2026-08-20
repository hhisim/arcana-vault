'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

type ArchiveSaleCtaProps = {
  placement: string
  compact?: boolean
  title?: string
  body?: string
}

function trackArchiveSale(action: 'view' | 'click', placement: string) {
  try {
    const payload = JSON.stringify({
      tool: 'archive_sale_cta',
      action,
      meta: {
        placement,
        href: typeof window !== 'undefined' ? window.location.pathname : undefined,
      },
      timestamp: new Date().toISOString(),
    })

    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([payload], { type: 'application/json' })
      if (navigator.sendBeacon('/api/usage/track', blob)) return
    }

    void fetch('/api/usage/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Never let analytics interfere with navigation or the reading experience.
  }
}

export default function ArchiveSaleCta({
  placement,
  compact = false,
  title = '20% Archive Sale',
  body = 'Esoteric study packs, grimoires, tarot, alchemy, sacred geometry, manifestation archives — all discounted now.',
}: ArchiveSaleCtaProps) {
  const seen = useRef(false)

  useEffect(() => {
    const el = document.querySelector(`[data-archive-sale-placement="${placement}"]`)
    if (!el) return

    const markSeen = () => {
      if (seen.current) return
      seen.current = true
      trackArchiveSale('view', placement)
    }

    if (!('IntersectionObserver' in window)) {
      markSeen()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          markSeen()
          observer.disconnect()
        }
      },
      { threshold: 0.35 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [placement])

  return (
    <section
      data-archive-sale-placement={placement}
      className={`mx-auto max-w-5xl px-6 ${compact ? 'py-6' : 'py-10'}`}
      aria-label="Archive sale"
    >
      <div className="relative overflow-hidden rounded-3xl border border-[#C9A84C]/30 bg-gradient-to-br from-[#C9A84C]/15 via-[#12121A] to-[#7B5EA7]/20 p-6 md:p-8 shadow-[0_0_45px_rgba(201,168,76,0.12)]">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#C9A84C]/15 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-[#C9A84C]">
              Limited archive sale · 20% off every pack
            </p>
            <h2 className="font-cinzel text-2xl md:text-3xl text-[#E8E0F0]">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#B8AEC8]">{body}</p>
          </div>
          <Link
            href="/shop?utm_source=archive_sale_cta"
            onClick={() => trackArchiveSale('click', placement)}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#C9A84C] px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#0A0A0F] transition-colors hover:bg-[#E0BE63]"
          >
            Browse the Archives →
          </Link>
        </div>
      </div>
    </section>
  )
}
