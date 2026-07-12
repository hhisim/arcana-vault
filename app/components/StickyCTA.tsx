'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'

export default function StickyCTA() {
  const auth = useAuth()
  const pathname = usePathname()

  // The visitor is already at the primary conversion surface; a fixed duplicate CTA
  // competes with the question input and obscures the lower chat controls.
  if (auth.isAuthenticated || pathname === '/chat') return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-[rgba(201,168,76,0.2)] px-4 py-3 md:py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <p className="text-sm text-[#9B93AB]">
          Ask one powerful question for free — then <span className="text-[var(--primary-gold)]">save the reading and continue daily</span>.
        </p>
        <Link
          href="/chat"
          className="flex-shrink-0 bg-[#C9A84C] text-[#0A0A0F] px-5 py-2 rounded-lg font-bold text-sm hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all"
        >
          Ask One Question
        </Link>
      </div>
    </div>
  )
}
