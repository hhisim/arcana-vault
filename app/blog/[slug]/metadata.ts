import type { Metadata } from 'next'

const essayMeta: Record<string, { description: string; keywords: string[] }> = {
  'dmt-hyperbolic-mind': {
    description: 'Explore the geometry of DMT hyperspace — hyperbolic manifolds, entity encounters, and the mathematics of visionary states. A treatise from Vault of Arcana.',
    keywords: ['DMT', 'hyperbolic geometry', 'altered states of consciousness', 'Terence McKenna', 'entheogens', 'psychedelic geometry', 'visionary states'],
  },
  'alchemy-of-soul-magnum-opus': {
    description: 'From nigredo to rubedo — the 12 stages of the alchemical Magnum Opus mapped as a path of inner transformation.',
    keywords: ['alchemy', 'Magnum Opus', 'nigredo', 'rubedo', 'solve et coagula', 'transmutation', 'Great Work', 'alchemical stages'],
  },
  'dreamwalker-lucid-dreaming-astral-projection': {
    description: 'Techniques for lucid dreaming and astral projection — from LaBerge\'s modern research to Monroe\'s out-of-body methods.',
    keywords: ['lucid dreaming', 'astral projection', 'Robert Monroe', 'Stephen LaBerge', 'out-of-body experience', 'dream yoga', 'consciousness exploration'],
  },
  'enochian-angelic-language-modern-occultism': {
    description: 'John Dee and Edward Kelley\'s angelic language — the 48 Enochian Calls, elemental tablets, and their influence on the Golden Dawn.',
    keywords: ['Enochian', 'John Dee', 'Edward Kelley', 'angelic language', 'Golden Dawn', 'Enochian Calls', 'magical alphabet', 'angelic magick'],
  },
  'five-tibetans-ancient-rites-of-rejuvenation': {
    description: 'Are the Five Tibetan Rites ancient yoga or Western invention? Separating genuine practice from Orientalist mythology.',
    keywords: ['Five Tibetans', 'Tibetan yoga', 'rejuvenation exercises', 'Peter Kelder', 'Orientalist mythology', 'Tibetan lamas', 'anti-aging yoga'],
  },
  'gnosticism-archive-of-light-architecture-divine-spark': {
    description: 'The Pleroma, the Demiurge, Archons, and the divine spark — Gnostic cosmology as a technical map for consciousness.',
    keywords: ['Gnosticism', 'Pleroma', 'Demiurge', 'Archons', 'divine spark', 'Gnostic cosmology', 'Nag Hammadi', 'consciousness liberation'],
  },
  'i-ching-ancient-oracle-of-change': {
    description: '3,000 years of oracular wisdom — 8 trigrams, 64 hexagrams, and the oldest divination system on Earth.',
    keywords: ['I Ching', 'Yijing', 'hexagrams', 'trigrams', 'Taoist divination', 'ancient oracle', 'Book of Changes', 'Wu Xing'],
  },
  'kundalini-shakti-serpent-power-western-science': {
    description: 'Seven chakras, seven seals, seven levels of consciousness — the kundalini tradition maps human awakening.',
    keywords: ['kundalini', 'shakti', 'chakras', 'serpent power', 'tantra', 'subtle body', 'energy awakening', 'kundalini yoga'],
  },
  'sufism-the-path-of-divine-love': {
    description: 'From Rumi\'s whirling dervishes to Ibn Arabi\'s Unity of Being — Sufism as the mystical heart of Islam.',
    keywords: ['Sufism', 'Rumi', 'Ibn Arabi', 'whirling dervishes', 'divine love', 'Unity of Being', 'Sufi mysticism', 'fana'],
  },
  'tarot-symbolic-machine-for-fate': {
    description: 'From 15th-century playing cards to a 78-card alphabet of archetypal initiation — how the Tarot maps the human journey.',
    keywords: ['Tarot', 'archetypes', 'Major Arcana', 'Minor Arcana', 'Jungian psychology', 'tarot initiation', 'symbolic system', 'Cartomancy'],
  },
  'the-kybalion-7-principles-hermetic-philosophy': {
    description: 'Mentalism, Correspondence, Vibration, Polarity, Rhythm, Causation, Gender — the seven Hermetic axioms.',
    keywords: ['Kybalion', 'Hermetic Philosophy', 'seven principles', 'mentalism', 'correspondence', 'vibration', 'polarity', 'Hermetic Axiom'],
  },
  'sexual-alchemy-taoist-tradition-nei-dan': {
    description: 'Jing, Qi, Shen — the three treasures of Taoist inner alchemy. Sexual energy as the fuel of spiritual transformation.',
    keywords: ['Taoist sexual alchemy', 'Nei Dan', 'Jing Qi Shen', 'three treasures', 'sexual energy', 'Internal Elixir', 'Taoist yoga', 'Jing refinement'],
  },
  'taoism-quantum-physics-real-parallels': {
    description: 'Separating meaningful metaphysical resonance from pop-spirituality — where Tao and quantum mechanics genuinely converge.',
    keywords: ['Taoism', 'quantum physics', 'Fritjof Capra', 'Tao of physics', 'metaphysics', 'Wu Wei', 'quantum consciousness', 'pop-spirituality'],
  },
  'what-tao-te-ching-says-about-uncertainty': {
    description: 'The ancient Taoist concept of non-action applied to modern decision fatigue. A radical strategy for navigating uncertainty.',
    keywords: ['Wu Wei', 'Tao Te Ching', 'non-action', 'decision fatigue', 'Taoist philosophy', 'Laozi', 'strategic uncertainty', 'effortless action'],
  },
  'seven-hermetic-principles-silicon-valley': {
    description: 'The Seven Hermetic Principles as a framework for systems thinking, recursion, and emergence.',
    keywords: ['Hermeticism', 'As Above So Below', 'systems thinking', 'recursion', 'Silicon Valley', 'emergence', 'Hermetic principles', 'complexity theory'],
  },
  'chaos-magick-not-what-you-think': {
    description: 'Sigils, paradigm shifting, and belief as a technology — Chaos Magick as the postmodern operating system.',
    keywords: ['Chaos Magick', 'Austin Osman Spare', 'sigil magick', 'paradigm shifting', 'belief technology', 'postmodern magick', 'magical pragmatism'],
  },
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug
  const meta = essayMeta[slug]

  const { posts } = await import('@/lib/posts')
  const post = posts.find((p) => p.slug === slug)

  if (!meta || !post) {
    return { title: 'Vault of Arcana' }
  }

  return {
    title: `${post.title} — Vault of Arcana`,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      type: 'article',
      title: post.title,
      description: meta.description,
      url: `https://www.vaultofarcana.com/blog/${slug}`,
      siteName: 'Vault of Arcana',
      publishedTime: post.publishedAt,
      authors: ['Hakan Hisim', 'PRIME'],
      tags: [post.tradition],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: meta.description,
    },
    alternates: {
      canonical: `https://www.vaultofarcana.com/blog/${slug}`,
    },
  }
}
