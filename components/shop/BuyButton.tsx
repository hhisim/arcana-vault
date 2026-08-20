'use client'

import { useState } from 'react'

function trackCheckoutStart(sku: string) {
  try {
    const payload = JSON.stringify({
      tool: 'archive_shop',
      action: 'checkout_started',
      meta: {
        sku,
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
    // Analytics must never block checkout.
  }
}

export default function BuyButton({ sku, price }: { sku: string; price: string }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function buy() {
    if (busy) return
    setBusy(true)
    setErr('')
    try {
      trackCheckoutStart(sku)
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku }),
      })
      const data = await res.json().catch(() => ({}))
      if (data.url) {
        window.location.href = data.url
        return
      }
      setErr(data.detail || 'Could not start checkout. Please try again.')
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    }
    setBusy(false)
  }

  return (
    <span className="inline-block">
      <button
        onClick={buy}
        disabled={busy}
        className="bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        {busy ? 'Starting…' : `Buy for ${price}`}
      </button>
      {err && <span className="block text-red-400 text-xs mt-1">{err}</span>}
    </span>
  )
}
