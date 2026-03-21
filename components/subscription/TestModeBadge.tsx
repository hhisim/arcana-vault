'use client'

import { useAuth } from '@/components/auth/AuthProvider'

/**
 * Small fixed badge that shows when test mode is active.
 * Drop into layout.tsx or providers.tsx so it's always visible.
 *
 * Usage: <TestModeBadge />
 */
export default function TestModeBadge() {
  const { isTestMode } = useAuth()

  if (!isTestMode) return null

  const handleOff = () => {
    document.cookie = 'voa_test_mode=; path=/; max-age=0'
    window.location.reload()
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-white text-xs font-mono shadow-lg shadow-purple-900/50">
      <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      TEST MODE — Full access
      <button
        onClick={handleOff}
        className="ml-2 rounded-full bg-white/20 px-2 py-0.5 hover:bg-white/30 transition-colors"
      >
        OFF
      </button>
    </div>
  )
}
