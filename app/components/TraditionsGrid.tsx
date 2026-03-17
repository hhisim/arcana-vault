'use client'

const traditions = [
  {
    name: 'TAO',
    icon: (
      <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M20 2 C28 2 32 10 32 20 C32 30 28 38 20 38 C12 38 8 30 8 20 C8 10 12 2 20 2 Z M20 12 C16 12 14 16 14 20 C14 24 16 28 20 28 C24 28 26 24 26 20 C26 16 24 12 20 12" fill="currentColor"/></svg>
    ),
    tagline: 'Flow with the uncarved block',
    badge: 'Voice enabled',
    badgeType: 'voice',
  },
  {
    name: 'TAROT',
    icon: (
      <svg viewBox="0 0 40 40"><polygon points="20,2 24,14 38,14 28,22 32,38 20,28 8,38 12,22 2,14 16,14" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="20" cy="20" r="6" fill="currentColor"/></svg>
    ),
    tagline: 'The archetypal journey',
    badge: 'Text only',
    badgeType: 'text',
  },
  {
    name: 'TANTRA',
    icon: (
      <svg viewBox="0 0 40 40"><polygon points="20,4 36,34 4,34" fill="none" stroke="currentColor" strokeWidth="2"/><polygon points="20,36 4,6 36,6" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
    ),
    tagline: 'Sacred energy awakening',
    badge: 'Voice enabled',
    badgeType: 'voice',
  },
  {
    name: 'ENTHEOGENS',
    icon: (
      <svg viewBox="0 0 40 40"><path d="M20 38 C20 38 20 20 20 20 C20 20 8 16 8 8 C8 8 20 12 20 20 C20 20 32 16 32 8 C32 8 20 12 20 20 L20 38" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="20" cy="20" r="3" fill="currentColor"/></svg>
    ),
    tagline: 'Plant wisdom and transformation',
    badge: 'Voice enabled',
    badgeType: 'voice',
  },
]

export default function TraditionsGrid() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <h2 className="font-cinzel text-3xl text-center text-text-primary mb-16">
        Four Traditions. Infinite Depth.
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            key={tradition.name}
            className="glass-card p-6 aspect-square flex flex-col items-center text-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,112,219,0.3)] hover:scale-[1.02] cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full bg-raised flex items-center justify-center text-3xl text-gold">
              <div className="w-8 h-8">{tradition.icon}</div>
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
