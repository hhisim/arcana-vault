'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'

/**
 * Site-wide first-visit popup offering the free Tao Oracle Pack.
 *
 * Shows once per visitor, then stays quiet for 3 days. If they dismiss it without
 * signing up, it returns after that window so an interested reader who got distracted
 * still gets one more chance. Signed-in users never see it.
 *
 * Timing note: the countdown starts on mount, NOT after auth resolves, because
 * /api/account/me can take up to 6s. Gating on loading before starting the timer
 * made the "4 second" delay up to 10s, and a late auth refresh could reset the
 * timer a second time. So: start the clock immediately, and simply hide the popup
 * if the visitor turns out to be signed in.
 */

const STORAGE_KEY = 'voa:tao-pack-offer:v1'
const REPEAT_AFTER_MS = 3 * 24 * 60 * 60 * 1000
const DELAY_MS = 4000

type Stored = { lastSeenAt: number; signedUpAt?: number }

function readStored(): Stored | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Stored
    if (typeof parsed?.lastSeenAt !== 'number') return null
    return parsed
  } catch {
    return null
  }
}

function writeStored(value: Stored) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    /* private mode / storage disabled — popup simply shows again next visit */
  }
}

export default function TaoPackOfferPopup() {
  const { isAuthenticated, loading } = useAuth()
  const [visible, setVisible] = useState(false)
  // Guards against scheduling a second timer if the effect re-runs for any reason.
  const armed = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Preview hatch: ?preview=1 forces the popup open regardless of storage/auth,
    // so the dialog can be verified visually without waiting out the 3-day window.
    const forced = new URLSearchParams(window.location.search).get('preview') === '1'
    if (forced) {
      setVisible(true)
      return
    }
    if (armed.current) return
    // Don't pile a popup on top of a redemption flow the visitor chose deliberately.
    if (window.location.pathname.startsWith('/redeem/')) return

    const stored = readStored()
    if (stored) {
      if (stored.signedUpAt) return
      if (Date.now() - stored.lastSeenAt < REPEAT_AFTER_MS) return
    }

    armed.current = true
    const timer = window.setTimeout(() => {
      // Only reveal once we know they aren't already a member.
      if (!loading && isAuthenticated) return
      setVisible(true)
      writeStored({ lastSeenAt: Date.now() })
      // Temporary diagnostic beacon: confirms the timer actually fired in a real
      // browser, which is the difference between "logic is wrong" and "CSS is
      // hiding it". Remove once the popup is confirmed visible.
      window.dispatchEvent(
        new CustomEvent('voa:tao-offer-shown', { detail: { at: Date.now() } })
      )
      ;(window as unknown as { __voaTaoOfferShown?: number }).__voaTaoOfferShown = Date.now()
    }, DELAY_MS)

    return () => {
      armed.current = false
      window.clearTimeout(timer)
    }
    // Intentionally not depending on loading/isAuthenticated: the timer must not
    // restart when auth state settles. Auth is re-checked inside the timer instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // A signed-in member never sees it, except in the explicit preview hatch.
  const preview =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('preview') === '1'
  if (isAuthenticated && !preview) return null
  if (!visible) return null

  const close = () => setVisible(false)

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center">
      <button
        aria-label="Close offer"
        onClick={close}
        className="absolute inset-0 bg-[#0A0A0F]/85 backdrop-blur-sm cursor-default"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tao-offer-title"
        className="relative w-full max-w-lg rounded-2xl border border-amber-300/25 bg-[#181421] p-7 shadow-2xl"
      >
        <button
          onClick={close}
          aria-label="Close offer"
          className="absolute right-4 top-4 rounded-full border border-white/10 px-2 py-1 text-xs text-[#b5a4bb] transition-colors hover:border-amber-300/40 hover:text-[#f2d29a]"
        >
          ✕
        </button>

        <p className="text-[11px] uppercase tracking-[.3em] text-[#d1ad75]">Free Tao Oracle Pack</p>
        <h2 id="tao-offer-title" className="mt-3 font-serif text-3xl leading-tight text-[#f8eddb]">
          3GB of Taoist archive — and a month free
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#c9bcd0]">
          Create a free Vault of Arcana account and this pack is yours: the full 3GB Taoist
          archive plus <span className="text-[#f8eddb] font-medium">30 days of Seeker access</span>.
          No card, no purchase, nothing to cancel.
        </p>

        <ul className="mt-5 space-y-2 text-sm text-[#bcb2c5]">
          <li>• I Ching, Qi Cultivation, Inner Alchemy, Wu Wei, the Tao Te Ching</li>
          <li>• 3 oracle traditions and 60 daily questions</li>
          <li>• Your archive link arrives by email once the claim is confirmed</li>
        </ul>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href="/redeem/tao"
            onClick={() => {
              writeStored({ lastSeenAt: Date.now(), signedUpAt: Date.now() })
              setVisible(false)
            }}
            className="rounded-full bg-amber-300 px-6 py-2.5 font-medium text-black transition-colors hover:bg-amber-200"
          >
            Claim the free pack
          </Link>
          <button
            onClick={close}
            className="text-sm text-[#b5a4bb] underline underline-offset-4 transition-colors hover:text-[#f2d29a]"
          >
            No thanks
          </button>
        </div>

        <p className="mt-5 text-xs leading-5 text-[#8f849c]">
          We only use your email to deliver the archive and the account you asked for.
        </p>
      </div>
    </div>
  )
}
