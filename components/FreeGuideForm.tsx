'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const GUIDES: Record<string, { title: string; blurb: string; count: string }> = {
  tarot: {
    title: 'Tarot',
    blurb: 'The structure of the deck before the interpretation of a single card.',
    count: '2 essays · 5,000 words',
  },
  kabbalah: {
    title: 'Kabbalah',
    blurb: 'The Tree from sefirot to the Four Worlds, and where tradition diverges from the popular version.',
    count: '5 essays · 15,800 words',
  },
  hermeticism: {
    title: 'Hermeticism',
    blurb: 'The Kybalion, the Corpus Hermeticum, and the Victorian compilation that is not the same thing.',
    count: '17 essays · 35,600 words',
  },
  alchemy: {
    title: 'Alchemy',
    blurb: 'Operation, vessel, and the work that repeats — nigredo through rubedo.',
    count: '9 essays · 22,200 words',
  },
  'sacred-geometry': {
    title: 'Sacred Geometry',
    blurb: "Metatron's Cube, the Flower of Life, and where the mathematics carries symbolic weight.",
    count: '5 essays · 16,400 words',
  },
  taoism: {
    title: 'Taoism',
    blurb: 'Tao Te Ching, the I Ching and Neidan, with the philosophical and esoteric lines kept apart.',
    count: '11 essays · 14,000 words',
  },
  sufism: {
    title: 'Sufism',
    blurb: 'The stations, the maqamat, and the attested sources versus the romantic accounts.',
    count: '5 essays · 11,400 words',
  },
}

const ALL = Object.keys(GUIDES)

export function FreeGuideForm() {
  const router = useRouter()
  const params = useSearchParams()
  const initial = params.get('tradition')
  const [tradition, setTradition] = useState<string>(initial && GUIDES[initial] ? initial : ALL[0])
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'busy' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const value = email.trim()
    if (!value) {
      setError('Enter your email address.')
      setStatus('error')
      return
    }
    setStatus('busy')
    setError('')
    try {
      const res = await fetch('/api/free-grimoire', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: value, tradition, source: 'free-grimoire' }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }
      // Straight to the guide. The token is in the URL, not localStorage, so
      // the reader can bookmark or share the document and refresh it later.
      router.push(data.guideUrl)
    } catch {
      setError('Could not reach the server. Please try again.')
      setStatus('error')
    }
  }

  return (
    <section className="mx-auto mt-16 max-w-3xl border border-[#C9A84C]/40 bg-[#111019] p-8 md:mt-20">
      <h2 className="text-2xl text-[#E8E0F0]">Unlock the guide</h2>
      <p className="mt-2 text-sm text-[#9B93AB]">
        Pick a tradition, leave an email, and the guide opens immediately.
      </p>

      <form onSubmit={submit} className="mt-6">
        <label htmlFor="guide-tradition" className="font-sans text-xs uppercase tracking-[0.2em] text-[#C9A84C]">
          Tradition
        </label>
        <select
          id="guide-tradition"
          value={tradition}
          onChange={(e) => setTradition(e.target.value)}
          className="mt-2 w-full border border-[#2a2733] bg-[#0a0a10] px-4 py-3 font-serif text-[#E8E0F0] outline-none focus:border-[#C9A84C]"
        >
          {ALL.map((k) => (
            <option key={k} value={k}>
              {GUIDES[k].title} — {GUIDES[k].count}
            </option>
          ))}
        </select>

        <p className="mt-4 text-sm text-[#9B93AB]">{GUIDES[tradition]?.blurb}</p>

        <label htmlFor="guide-email" className="mt-6 block font-sans text-xs uppercase tracking-[0.2em] text-[#C9A84C]">
          Email
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="guide-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 border border-[#2a2733] bg-[#0a0a10] px-4 py-3 font-serif text-[#E8E0F0] outline-none placeholder:text-[#4a4658] focus:border-[#C9A84C]"
          />
          <button
            type="submit"
            disabled={status === 'busy'}
            className="bg-[#C9A84C] px-8 py-3 font-sans text-sm font-semibold uppercase tracking-[0.15em] text-[#0A0A10] transition-colors hover:bg-[#d9bb63] disabled:opacity-60"
          >
            {status === 'busy' ? 'Unlocking…' : 'Unlock'}
          </button>
        </div>

        {error ? (
          <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>
        ) : null}

        <p className="mt-5 text-xs leading-relaxed text-[#6f6a80]">
          We send the guide and an occasional note when new work is published. No discount sequence,
          no upsell on the page the guide opens. Unsubscribe in one click.
        </p>
      </form>
    </section>
  )
}
