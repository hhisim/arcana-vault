'use client'

import { useCallback, useEffect, useState } from 'react'

type Purchase = {
  id: string
  session_id?: string | null
  email: string
  sku: string
  pack_title: string
  amount_total?: number | null
  currency?: string | null
  status: string
  access_link?: string | null
  created_at: string
}

function fmtMoney(cents?: number | null): string {
  if (cents == null) return '—'
  return `$${(cents / 100).toFixed(2)}`
}

function fmtWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [loginErr, setLoginErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [links, setLinks] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/purchases')
    if (res.status === 401) {
      setAuthed(false)
      return
    }
    if (!res.ok) {
      setError('Could not load purchases.')
      setAuthed(false)
      return
    }
    const data = await res.json()
    setPurchases(data.purchases ?? [])
    setAuthed(true)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setLoginErr('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setPassword('')
        await load()
      } else {
        setLoginErr('Invalid password.')
      }
    } catch {
      setLoginErr('Could not reach the server.')
    }
    setBusy(false)
  }

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    setAuthed(false)
    setPurchases([])
  }

  async function authorize(p: Purchase) {
    const link = (links[p.id] ?? '').trim()
    if (!link) {
      setError('Paste the Google Drive share link before authorizing.')
      return
    }
    setSaving((s) => ({ ...s, [p.id]: true }))
    setError('')
    try {
      const res = await fetch(`/api/admin/purchases/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_link: link, status: 'authorized' }),
      })
      if (res.ok) {
        await load()
      } else {
        const d = await res.json().catch(() => ({}))
        setError(d.error || 'Update failed.')
      }
    } catch {
      setError('Update failed.')
    }
    setSaving((s) => ({ ...s, [p.id]: false }))
  }

  async function reopen(p: Purchase) {
    setSaving((s) => ({ ...s, [p.id]: true }))
    try {
      await fetch(`/api/admin/purchases/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending_access' }),
      })
      await load()
    } catch {}
    setSaving((s) => ({ ...s, [p.id]: false }))
  }

  // ---- Login gate ----
  if (authed === null) {
    return <p className="text-zinc-400">Loading…</p>
  }

  if (!authed) {
    return (
      <main className="mx-auto max-w-sm px-4 py-20">
        <h1 className="text-3xl font-serif mb-2 text-center">Vault Admin</h1>
        <p className="text-zinc-400 text-sm text-center mb-8">Sign in to manage archive access.</p>
        <form onSubmit={login} className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            autoFocus
            className="rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-white placeholder-zinc-500 focus:border-amber-400/60 focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-amber-500 px-4 py-3 font-semibold text-black hover:bg-amber-400 disabled:opacity-60"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
          {loginErr && <p className="text-red-400 text-sm text-center">{loginErr}</p>}
        </form>
      </main>
    )
  }

  const pending = purchases.filter((p) => p.status !== 'authorized')
  const authorized = purchases.filter((p) => p.status === 'authorized')

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif">Vault Admin</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Archive access fulfillment — grant Google Drive access per purchase.
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm text-zinc-300 hover:border-white/30"
        >
          Sign out
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
          <div className="text-3xl font-serif text-amber-200">{purchases.length}</div>
          <div className="text-xs text-zinc-400">Total</div>
        </div>
        <div className="rounded-xl border border-amber-400/30 bg-amber-400/[0.04] p-4 text-center">
          <div className="text-3xl font-serif text-amber-200">{pending.length}</div>
          <div className="text-xs text-zinc-400">Awaiting access</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
          <div className="text-3xl font-serif text-amber-200">{authorized.length}</div>
          <div className="text-xs text-zinc-400">Authorized</div>
        </div>
      </div>

      <h2 className="font-serif text-xl mb-3 text-[#EBE4F2]">Awaiting access ({pending.length})</h2>
      {pending.length === 0 ? (
        <p className="text-zinc-500 text-sm mb-8">No pending purchases. Everything is fulfilled.</p>
      ) : (
        <div className="mb-10 space-y-3">
          {pending.map((p) => (
            <div key={p.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-[#EBE4F2] truncate">{p.pack_title}</p>
                  <p className="text-sm text-zinc-400">
                    {p.email} · {fmtMoney(p.amount_total)} · {fmtWhen(p.created_at)}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">SKU {p.sku}</p>
                </div>
                <span className="rounded-full border border-amber-400/40 px-3 py-1 text-xs text-amber-300">
                  pending
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  type="url"
                  value={links[p.id] ?? ''}
                  onChange={(e) => setLinks((s) => ({ ...s, [p.id]: e.target.value }))}
                  placeholder="Paste Google Drive share link…"
                  className="flex-1 rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-amber-400/60 focus:outline-none"
                />
                <button
                  onClick={() => authorize(p)}
                  disabled={saving[p.id]}
                  className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-60"
                >
                  {saving[p.id] ? 'Saving…' : 'Authorize'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-serif text-xl mb-3 text-[#EBE4F2]">Authorized ({authorized.length})</h2>
      <div className="space-y-2">
        {authorized.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm text-[#EBE4F2] truncate">{p.pack_title}</p>
              <p className="text-xs text-zinc-500">
                {p.email} · {fmtMoney(p.amount_total)}
              </p>
              {p.access_link && (
                <a
                  href={p.access_link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-amber-300 underline break-all"
                >
                  {p.access_link}
                </a>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-emerald-400/40 px-3 py-1 text-xs text-emerald-300">
                authorized
              </span>
              <button
                onClick={() => reopen(p)}
                disabled={saving[p.id]}
                className="text-xs text-zinc-400 hover:text-zinc-200"
              >
                Reopen
              </button>
            </div>
          </div>
        ))}
        {authorized.length === 0 && (
          <p className="text-zinc-500 text-sm">No authorized purchases yet.</p>
        )}
      </div>
    </main>
  )
}
