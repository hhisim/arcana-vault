'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'

export default function StickyCTA() {
  const auth = useAuth()

  if (auth.isAuthenticated) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-[rgba(201,168,76,0.2)] px-4 py-3 md:py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <p className="text-sm text-[#9B93AB]">
          Begin your journey — <span className="text-[var(--primary-gold)]">3 free questions</span>, no signup required.
        </p>
        <Link
          href="/chat"
          className="flex-shrink-0 bg-[#C9A84C] text-[#0A0A0F] px-5 py-2 rounded-lg font-bold text-sm hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all"
        >
          Ask the Oracle
        </Link>
      </div>
    </div>
  )
}
