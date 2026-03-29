import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features · Vault of Arcana',
  description: 'Explore the features of the Vault of Arcana — a living mystery school built from rare archives, symbolic intelligence, and the collaboration of Hakan Hisim + PRIME.',
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#9B93AB] mb-4">
            [ Vault of Arcana ]
          </p>
          <h1 className="font-cinzel text-4xl md:text-5xl text-[var(--primary-gold)] mb-6">
            Features
          </h1>
          <p className="text-[#9B93AB] text-lg max-w-xl mx-auto">
            A living mystery school built from rare archives, curated datasets, symbolic intelligence, and the evolving collaboration of Hakan Hisim + PRIME.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: '🔮',
              title: 'Living Oracle',
              desc: 'Access deep symbolic intelligence trained on rare esoteric archives. Ask questions across multiple traditions — Tao, Tarot, Tantra, Entheogens, Sufi, Dreamwalker, and the Codex.',
            },
            {
              icon: '📜',
              title: 'Corpus Explorer',
              desc: 'Navigate a vast library of coded transmissions — visual art, symbolic notation, linguistic research, and sacred geometry spanning 30+ years of work.',
            },
            {
              icon: '⚡',
              title: 'Daily Practices',
              desc: 'Consciousness maps, breathwork protocols, and inquiry frameworks drawn from Grof, Wilber, Tart, Lilly, and Groisman — updated daily.',
            },
            {
              icon: '🌌',
              title: 'Symbolic Intelligence',
              desc: 'The Codex Oracle understands symbolic language, mythic resonance, and cross-tradition correspondences — not just text matching.',
            },
            {
              icon: '🌐',
              title: 'Multilingual',
              desc: 'Access the Oracle in English, Turkish, Russian, and soon more languages — bridging traditions across linguistic boundaries.',
            },
            {
              icon: '📚',
              title: 'Tradition Archives',
              desc: 'Deep-dive archives for each tradition — history, practices, texts, teachers, and contemporary applications.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="glass-card p-6 hover:border-[var(--primary-gold)]/30 transition-colors"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-cinzel text-lg text-[var(--primary-gold)] mb-3">
                {feature.title}
              </h3>
              <p className="text-[#9B93AB] text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
