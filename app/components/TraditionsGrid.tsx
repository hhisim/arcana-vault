'use client'

import { useState } from 'react'

const traditions = [
  {
    name: 'TAO',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24 8C24 8 16 16 16 24C16 32 24 40 24 40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M24 8C24 8 32 16 32 24C32 32 24 40 24 40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="24" cy="24" r="4" fill="currentColor" />
      </svg>
    ),
    tagline: 'Flow with the uncarved block',
    badge: 'Voice enabled',
    badgeType: 'voice',
  },
  {
    name: 'TAROT',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
        <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24 4L27 17H40L30 25L33 38L24 30L15 38L18 25L8 17H21L24 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    tagline: 'The archetypal journey',
    badge: 'Text only',
    badgeType: 'text',
  },
  {
    name: 'TANTRA',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
        <path d="M24 4L38 22H32V44L24 34L16 44V22H10L24 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M24 14L30 22H27V34L24 28L21 34V22H18L24 14Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      </svg>
    ),
    tagline: 'Sacred energy awakening',
    badge: 'Voice enabled',
    badgeType: 'voice',
  },
  {
    name: 'ENTHEOGENS',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
        <path d="M24 44C24 44 10 34 10 22C10 12 16 4 24 4C32 4 38 12 38 22C38 34 24 44 24 44Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24 14C24 14 19 19 19 24C19 29 24 34 24 34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="24" cy="22" r="2" fill="currentColor" />
      </svg>
    ),
    tagline: 'Plant wisdom and transformation',
    badge: 'Voice enabled',
    badgeType: 'voice',
  },
]

export default function TraditionsGrid() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <h2 className="font-cinzel text-3xl text-center text-text-primary mb-16">
        Four Traditions. Infinite Depth.
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {traditions.map((tradition, index) => (
          <div
            key={tradition.name}
            className={`glass-card p-8 aspect-square flex flex-col items-center text-center transition-all duration-300 ${
              hovered === index
                ? 'shadow-[0_0_20px_rgba(147,112,219,0.3)] scale-[1.03]'
                : ''
            }`}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="w-16 h-16 rounded-full bg-raised flex items-center justify-center text-3xl text-gold">
              {tradition.icon}
            </div>

            <h3 className="font-cinzel text-xl text-text-primary mt-6">
              {tradition.name}
            </h3>

            <p className="text-text-secondary text-sm mt-2">
              {tradition.tagline}
            </p>

            <span
              className={`mt-auto text-xs px-3 py-1 rounded-full ${
                tradition.badgeType === 'voice'
                  ? 'bg-teal/20 text-teal'
                  : 'bg-muted/20 text-muted'
              }`}
            >
              {tradition.badge}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
