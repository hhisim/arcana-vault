'use client'

import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-32">
      <div className="text-6xl mb-6">🔮</div>
      <h1 className="text-4xl font-serif text-[var(--primary-gold)] mb-4">Something Broke</h1>
      <p className="text-[#9B93AB] text-lg mb-8 max-w-md">
        An error occurred in the Vault. Our systems have been notified.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-[#C9A84C] text-[#0A0A0F] px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-all"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="border border-[rgba(255,255,255,0.15)] text-[#9B93AB] px-6 py-3 rounded-lg hover:border-[rgba(255,255,255,0.3)] transition-all"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
