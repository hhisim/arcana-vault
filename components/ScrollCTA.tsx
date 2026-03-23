'use client'

import React from 'react'
import Link from 'next/link'
import { scrollCTAConfig, fallbackCTA } from '@/lib/scroll-cta-config'
import EmailCapture from '@/components/EmailCapture'

type ScrollCTAProps = {
  slug: string
}

export default function ScrollCTA({ slug }: ScrollCTAProps) {
  const config = scrollCTAConfig[slug] ?? fallbackCTA

  return (
    <div className="mt-16 pt-10 border-t border-white/8">
      {/* Continue This Inquiry block */}
      <div className="mb-8">
        {/* Label */}
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] font-bold mb-5 font-cinzel">
          ✦&nbsp;&nbsp;Continue This Inquiry&nbsp;&nbsp;✦
        </p>

        {/* Oracle prompt */}
        <p className="text-[#B8B0CC] text-[17px] leading-8 italic mb-7 max-w-2xl">
          {config.oraclePrompt}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {/* Primary: Enter the Oracle */}
          <a
            href={config.oracleLink}
            className="
              inline-flex items-center gap-2
              px-6 py-3 rounded-md
              bg-[var(--primary-gold)] text-[#0A0A10] font-bold text-sm uppercase tracking-wider
              hover:bg-[var(--primary-gold)]/90 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]
              transition-all duration-200
              font-cinzel
            "
          >
            Enter the Oracle
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          {/* Secondary: Explore in the Codex — only if codexLinks exist */}
          {config.codexLinks && config.codexLinks.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2">
              {config.codexLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="
                    inline-flex items-center gap-2
                    px-5 py-3 rounded-md
                    border border-[rgba(201,168,76,0.3)] text-[#C9A84C]
                    text-sm font-medium hover:border-[rgba(201,168,76,0.6)] hover:bg-[rgba(201,168,76,0.05)]
                    transition-all duration-200
                  "
                >
                  Explore in the Codex
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-[rgba(201,168,76,0.15)]" />
        <span className="text-[#5A5470] text-xs">✦</span>
        <div className="flex-1 h-px bg-[rgba(201,168,76,0.15)]" />
      </div>

      {/* Email signup */}
      {config.hasEmailSignup && (
        <div className="max-w-xl">
          <p className="text-[#9B93AB] text-sm mb-4">
            Stay attuned — subscribe to The Transmission
          </p>
          <EmailCapture variant="compact" />
        </div>
      )}

      {/* Discuss in Agora */}
      <div className="mt-8 pt-6 border-t border-[rgba(201,168,76,0.12)]">
        <p className="text-[#9B93AB] text-sm">
          Want to go deeper with others?{' '}
          <a
            href="/agora"
            className="text-[#C9A84C] hover:underline"
          >
            Discuss this essay in the Agora →
          </a>
        </p>
      </div>
    </div>
  )
}
