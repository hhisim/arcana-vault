'use client'

import { useState } from 'react'

export default function BuyButton({ sku, price }: { sku: string; price: string }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function buy() {
    if (busy) return
    setBusy(true)
    setErr('')
    try {
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
