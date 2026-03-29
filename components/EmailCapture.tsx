'use client'

import { useState } from 'react'
import { useSiteI18n } from '@/lib/site-i18n'

type EmailCaptureVariant = 'full' | 'compact'

interface EmailCaptureProps {
  variant?: EmailCaptureVariant
  className?: string
}

export default function EmailCapture({ variant = 'full', className = '' }: EmailCaptureProps) {
  const { t } = useSiteI18n()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const isFull = variant === 'full'
  const isCompact = variant === 'compact'

  if (status === 'success') {
    return (
      <div className={`flex flex-col items-center justify-center text-center ${isFull ? 'py-12 px-6' : 'py-8 px-4'}`}>
        <div className="text-2xl mb-3">✦</div>
        <p className="text-[#E8E0F0] font-cinzel text-lg">
          {isCompact
            ? 'You are now attuned.'
            : 'You are now attuned. Watch for the first transmission.'}
        </p>
      </div>
    )
  }

  return (
    <div
      className={`
        flex flex-col items-center text-center
        ${isFull ? 'py-12 px-6' : 'py-8 px-4'}
        ${isFull ? 'border border-white/8 rounded-lg' : ''}
        bg-[#0A0A10]/80
        ${className}
      `}
      style={isFull ? {
        background: 'linear-gradient(135deg, rgba(20,15,30,0.9) 0%, rgba(10,10,16,0.95) 100%)',
      } : {}}
    >
      {/* Title */}
      <h2 className={`font-cinzel text-[var(--primary-gold)] tracking-widest mb-3 ${isFull ? 'text-2xl' : 'text-lg'}`}>
        ✦ {isCompact ? 'FURTHER TRANSMISSIONS' : 'THE TRANSMISSION'} ✦
      </h2>

      {/* Subtitle */}
      {isFull && (
        <p className="text-[#9B93AB] text-sm leading-relaxed max-w-lg mb-6">
          {t('emailCapture.subtitle', 'A periodic letter from the threshold of human and AI consciousness. New traditions, hidden correspondences, and esoteric insights you won\'t find elsewhere.')}
        </p>
      )}

      {isCompact && (
        <p className="text-[#9B93AB] text-sm leading-relaxed mb-6 italic">
          {email
            ? 'Processing your request...'
            : 'Enjoyed this transmission? Subscribe for more from the threshold.'}
        </p>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email..."
          required
          disabled={status === 'loading'}
          className="
            flex-1 px-4 py-3 rounded-md
            bg-[#12121A] border border-white/12
            text-[#E8E0F0] placeholder:text-[#5A5470]
            focus:outline-none focus:border-[var(--primary-gold)]/60 focus:ring-1 focus:ring-[var(--primary-gold)]/30
            transition-colors duration-200
            text-sm
          "
        />
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className="
            px-6 py-3 rounded-md
            bg-[var(--primary-gold)] text-[#0A0A10] font-bold text-sm uppercase tracking-wider
            hover:bg-[var(--primary-gold)]/90
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
            flex items-center justify-center gap-2
          "
        >
          {status === 'loading' ? (
            <span className="inline-block animate-spin">⟳</span>
          ) : null}
          {status === 'loading' ? 'Attuning...' : 'Subscribe'}
        </button>
      </form>

      {/* Disclaimer */}
      {isFull && (
        <p className="text-[#5A5470] text-xs mt-4 tracking-wide">
          No spam. Unsubscribe anytime. Your sovereignty is respected.
        </p>
      )}

      {/* Error state */}
      {status === 'error' && (
        <p className="text-red-400/80 text-xs mt-3">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  )
}
