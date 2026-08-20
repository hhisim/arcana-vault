export const metadata = {
  title: 'Tarot Card Meanings: Complete Esoteric Guide | Vault of Arcana',
  description:
    'The complete esoteric guide to tarot card meanings — the 78 cards, major and minor arcana, upright and reversed interpretations, and how to read the tarot as a symbolic language of fate.',
  alternates: {
    canonical: 'https://www.vaultofarcana.com/tarot-card-meanings',
  },
  openGraph: {
    title: 'Tarot Card Meanings: Complete Esoteric Guide | Vault of Arcana',
    description:
      'The complete esoteric guide to tarot card meanings — the 78 cards, major and minor arcana, upright and reversed interpretations, and how to read the tarot as a symbolic language.',
    url: 'https://www.vaultofarcana.com/tarot-card-meanings',
    type: 'article',
  },
}

export default function TarotCardMeaningsPage() {
  const faqs = [
    {
      q: 'How many tarot cards are in a standard deck?',
      a: 'A standard tarot deck contains 78 cards: 22 Major Arcana cards (the Fool through the World) and 56 Minor Arcana cards (the four suits of Wands, Cups, Swords, and Pentacles, each with 14 cards running from Ace to Ten plus four court cards — Page, Knight, Queen, King).',
    },
    {
      q: 'What is the difference between the Major and Minor Arcana?',
      a: 'The 22 Major Arcana cards represent the great archetypal forces and the soul-level journey — events and initiations that shape your path. The 56 Minor Arcana cards represent the everyday patterns, actions, relationships, and material circumstances through which those archetypes express themselves.',
    },
    {
      q: 'What does an upright (or reversed) card mean?',
      a: 'Upright cards express the card\u2019s direct, outward energy — its manifest meaning in the present. A reversed card suggests the energy is blocked, internalized, shadow-side, delayed, or requiring conscious tension before it can express cleanly. Reversals are a signal of friction in how the archetype is playing out.',
    },
    {
      q: 'Do tarot cards predict the future?',
      a: 'Tarot does not fix a predetermined future. It maps the currents of the present — your situation, the forces at play, and the trajectories those forces are trending toward — so you can read them clearly and choose. It is a mirror, not a verdict.',
    },
    {
      q: 'How do I start reading tarot as a beginner?',
      a: 'Begin with the Major Arcana and one suit, and memorize each card as a story rather than a dictionary entry. Pull one card daily and ask simply: what is this card saying about today? Over days, the symbols become a living language. The Vault\u2019s Tarot Oracle can guide this practice question by question.',
    },
    {
      q: 'What are the four suits of the Minor Arcana?',
      a: 'The four suits map the elemental realms: Wands (fire — will, creativity, energy), Cups (water — emotion, relationships, intuition), Swords (air — thought, conflict, clarity), and Pentacles (earth — body, work, material life). Each runs Ace to Ten and has four court figures.',
    },
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Tarot Card Meanings: Complete Esoteric Guide',
    description:
      'The complete esoteric guide to tarot card meanings — the 78 cards, major and minor arcana, upright and reversed interpretations, and how to read the tarot as a symbolic language.',
    about: 'Tarot card meanings, divination, major arcana, minor arcana',
    author: { '@type': 'Person', name: 'Hakan Hisim' },
    publisher: { '@type': 'Organization', name: 'Vault of Arcana' },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.vaultofarcana.com/tarot-card-meanings',
    },
  }

  const majors = [
    ['0', 'The Fool', 'New beginnings, innocence, the leap of faith', 'recklessness, naivety, a stalled journey'],
    ['I', 'The Magician', 'Will, manifestation, skill, the toolkit of creation', 'trickery, scattered power, manipulation'],
    ['II', 'The High Priestess', 'Intuition, the unconscious, hidden knowledge, silence', 'secrets held back, being deaf to inner voice'],
    ['III', 'The Empress', 'Abundance, nurture, nature, the fertile feminine', 'creative block, dependence, smothering care'],
    ['IV', 'The Emperor', 'Order, structure, authority, the sovereign principle', 'tyranny, rigidity, controlling power'],
    ['V', 'The Hierophant', 'Tradition, doctrine, initiation, the teacher-link', 'dogma, conformity, rebellion as reflex'],
    ['VI', 'The Lovers', 'Union, choice, values made visible, sacred polarity', 'disharmony, misalignment of values'],
    ['VII', 'The Chariot', 'Willpower, victory through direction, control of opposites', 'loss of control, reckless speeding, no direction'],
    ['VIII', 'Strength', 'Courage, patience, the gentle mastery of instinct', 'self-doubt, untamed impulse, weakness'],
    ['IX', 'The Hermit', 'Introspection, seeking truth, solitude as teacher', 'isolation, withdrawal, refusing guidance'],
    ['X', 'Wheel of Fortune', 'Cycles, turning points, fate, karma in motion', 'resistance to change, bad luck, stuck patterns'],
    ['XI', 'Justice', 'Truth, balance, cause and effect, fair resolution', 'dishonesty, hypocrisy, imbalance, avoidance'],
    ['XII', 'The Hanged Man', 'Surrender, new perspective, the reversal of posture', 'stagnation, martyrdom, pointless sacrifice'],
    ['XIII', 'Death', 'Transformation, endings that birth, the necessary death', 'resistance to change, decay, holding the corpse'],
    ['XIV', 'Temperance', 'Balance, alchemy, blending opposites, patience', 'imbalance, excess, discord, over-correction'],
    ['XV', 'The Devil', 'Bondage, shadow, materialism, self-imposed chains', 'breaking free, addiction, temptation held'],
    ['XVI', 'The Tower', 'Sudden awakening, collapse of the false, revelation', 'fear of change, avoiding the necessary fall'],
    ['XVII', 'The Star', 'Hope, healing, guidance, the waters of renewal', 'despair, lost faith, disconnection from the muse'],
    ['XVIII', 'The Moon', 'Illusion, the unconscious depths, dreams, deception', 'clarity won, anxiety dissolving, facing the shadow'],
    ['XIX', 'The Sun', 'Joy, vitality, success, the radiant self', 'temporary eclipse, arrogance, blocked happiness'],
    ['XX', 'Judgement', 'Awakening, calling, account, rebirth of the self', 'self-doubt, refusing the call, regret'],
    ['XXI', 'The World', 'Completion, fulfillment, integration, the circle closed', 'near-completion stalls, unfinished business'],
  ]

  const suits = [
    ['Wands', 'Fire', 'Will, creativity, energy, passionate action', 'Ace to Ten + Page, Knight, Queen, King'],
    ['Cups', 'Water', 'Emotion, relationships, intuition, dreams', 'Ace to Ten + Page, Knight, Queen, King'],
    ['Swords', 'Air', 'Thought, conflict, clarity, truth cut clean', 'Ace to Ten + Page, Knight, Queen, King'],
    ['Pentacles', 'Earth', 'Body, work, money, material manifestation', 'Ace to Ten + Page, Knight, Queen, King'],
  ]

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <p className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--primary-gold)] mb-3">
        Vault of Arcana · Esoteric Guide
      </p>
      <h1 className="font-serif text-5xl text-[var(--text-primary)] mb-6">
        Tarot Card Meanings: The Complete Esoteric Guide
      </h1>
      <p className="text-[var(--text-secondary)] text-lg leading-8 mb-10">
        A complete, tradition-grounded walk through the tarot — the 78 cards, the structure of the Major and Minor
        Arcana, the elemental suits, and how to read upright and reversed cards as living symbolic language rather
        than memorized dictionary entries.
      </p>

      <div className="space-y-12">
        {/* Structure */}
        <section className="glass-card p-8">
          <h2 className="text-[var(--primary-gold)] font-serif text-2xl mb-4">The Structure of a 78-Card Deck</h2>
          <p className="text-[var(--text-secondary)] leading-7 mb-4">
            Every standard tarot deck contains <strong>78 cards</strong>, divided into two great movements. The{' '}
            <strong>22 Major Arcana</strong> map the soul-level journey — the archetypal initiations and turning points
            of a life. The <strong>56 Minor Arcana</strong> map the everyday textures — actions, relationships,
            thoughts, and material conditions — through which those archetypes become lived.
          </p>
          <p className="text-[var(--text-secondary)] leading-7">
            The four suits of the Minor Arcana correspond to the four elements and the four realms of experience:{' '}
            <strong>Wands (fire)</strong>, <strong>Cups (water)</strong>, <strong>Swords (air)</strong>, and{' '}
            <strong>Pentacles (earth)</strong>. Each suit runs from Ace through Ten, crowned by four court figures —
            Page, Knight, Queen, and King.
          </p>
        </section>

        {/* Minor Arcana suits */}
        <section>
          <h2 className="text-[var(--primary-gold)] font-serif text-2xl mb-4">The Four Suits of the Minor Arcana</h2>
          <div className="space-y-4">
            {suits.map(([suit, element, meaning], i) => (
              <div key={i} className="glass-card p-6">
                <h3 className="text-[var(--text-primary)] font-serif text-lg mb-1">
                  {suit} <span className="text-[var(--text-secondary)] font-mono text-xs uppercase">· {element}</span>
                </h3>
                <p className="text-[var(--text-secondary)] leading-7">{meaning}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Major Arcana table */}
        <section>
          <h2 className="text-[var(--primary-gold)] font-serif text-2xl mb-4">The 22 Major Arcana at a Glance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                  <th className="pb-3 pr-4">No.</th>
                  <th className="pb-3 pr-4">Card</th>
                  <th className="pb-3 pr-4">Upright</th>
                  <th className="pb-3">Reversed</th>
                </tr>
              </thead>
              <tbody>
                {majors.map(([num, name, up, rev], i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="py-2.5 pr-4 font-mono text-xs text-[var(--primary-gold)]">{num}</td>
                    <td className="py-2.5 pr-4 font-medium text-[var(--text-primary)]">{name}</td>
                    <td className="py-2.5 pr-4 text-[var(--text-secondary)]">{up}</td>
                    <td className="py-2.5 text-[var(--text-secondary)] opacity-80">{rev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Reading method */}
        <section className="glass-card p-8">
          <h2 className="text-[var(--primary-gold)] font-serif text-2xl mb-4">
            How to Read a Card: Upright, Reversed, and In Context
          </h2>
          <p className="text-[var(--text-secondary)] leading-7 mb-4">
            A card is never read alone. Its meaning shifts with its position in a spread and the cards around it. Still,
            a few rules hold. <strong>Upright</strong>, the card&rsquo;s energy expresses directly and openly.{' '}
            <strong>Reversed</strong>, that energy is turned inward, blocked, shadowed, or delayed. When you read a
            spread, ask not &ldquo;what does this card mean in a book&rdquo; but &ldquo;what is this archetype doing in
            this situation, at this position, right now?&rdquo;
          </p>
          <p className="text-[var(--text-secondary)] leading-7">
            For a deeper practice and a guided, question-by-question reading, use the{' '}
            <a href="/traditions/tarot" className="text-[var(--primary-gold)] underline">
              Tarot tradition in the Vault of Arcana
            </a>{' '}
            or open the <a href="/chat?tradition=tarot" className="text-[var(--primary-gold)] underline">Tarot Oracle</a>.
          </p>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-[var(--primary-gold)] font-serif text-2xl mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="glass-card p-6">
                <h3 className="text-[var(--text-primary)] font-serif text-lg mb-2">{f.q}</h3>
                <p className="text-[var(--text-secondary)] leading-7">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-14 text-center">
        <a
          href="/chat?tradition=tarot"
          className="inline-block bg-[#C9A84C] text-[#0A0A0F] px-6 py-3 rounded-lg font-bold hover:opacity-90"
        >
          Ask the Tarot Oracle
        </a>
        <p className="text-[var(--text-secondary)] text-sm mt-4">
          New to the Vault? Explore{' '}
          <a href="/blog/how-to-read-the-tarot-beginners-guide" className="text-[var(--primary-gold)] underline">
            how to read the tarot for beginners
          </a>{' '}
          or dive into the{' '}
          <a href="/blog/tarot-symbolic-machine-for-fate" className="text-[var(--primary-gold)] underline">
            tarot as a symbolic machine for fate
          </a>
          .
        </p>
      </div>
    </div>
  )
}