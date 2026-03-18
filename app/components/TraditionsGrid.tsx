'use client'

const traditions = [
  {
    name: 'TAO',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="2">
        <circle cx="24" cy="24" r="20"/>
        <path d="M24 4c8 0 12 8 12 20s-4 20-12 20-12-8-12-20 4-20 12-20z"/>
        <circle cx="24" cy="16" r="4" fill="currentColor"/>
        <circle cx="24" cy="32" r="4" fill="currentColor"/>
      </svg>
    ),
    tagline: 'Flow with the uncarved block',
    badge: 'Voice enabled',
    badgeType: 'voice',
  },
  {
    name: 'TAROT',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="2">
        <polygon points="24,6 28,20 42,20 32,28 36,42 24,34 12,42 16,28 6,20 20,20"/>
        <circle cx="24" cy="26" r="6" fill="currentColor"/>
      </svg>
    ),
    tagline: 'The archetypal journey',
    badge: 'Text only',
    badgeType: 'text',
  },
  {
    name: 'TANTRA',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="2">
        <polygon points="24,8 40,40 8,40"/>
        <polygon points="24,40 8,8 40,8"/>
      </svg>
    ),
    tagline: 'Sacred energy awakening',
    badge: 'Voice enabled',
    badgeType: 'voice',
  },
  {
    name: 'ESOTERIC ENTHEOGEN',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="2">
        <path d="M24 44c0-20-10-25-15-30s-5-10 0-15c5 5 15 10 15 30"/>
        <path d="M24 44c0-20 10-25 15-30s5-10 0-15c-5 5-15 10-15 30"/>
        <line x1="24" y1="44" x2="24" y2="20"/>
      </svg>
    ),
    tagline: 'Plant wisdom and transformation',
    badge: 'Voice enabled',
    badgeType: 'voice',
  },
]

export default function TraditionsGrid() {
  return (
    <section id="traditions" className="max-w-6xl mx-auto px-6 py-24">
      <h2 className="font-cinzel text-3xl text-center text-text-primary mb-16">
        Four Traditions. Infinite Depth.
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {traditions.map((tradition) => (
          <div
            key={tradition.name}
            className="glass-card p-6 aspect-square flex flex-col items-center text-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,112,219,0.3)] hover:scale-[1.02] cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full bg-raised flex items-center justify-center text-gold p-4">
              <div className="w-full h-full">{tradition.icon}</div>
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
