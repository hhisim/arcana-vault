export const scrollCTAConfig: Record<string, {
  oraclePrompt: string;
  oracleLink: string;
  oracleTradition: string;
  codexLinks?: Array<{ label: string; path: string }>;
  hasEmailSignup: boolean;
}> = {
  // 1. DMT and the Hyperbolic Mind
  'dmt-hyperbolic-mind': {
    oraclePrompt: 'The geometry of hyperspace has deeper maps. Bring your own visionary experience — or your questions about the cartography of altered states — to the Entheogen Oracle.',
    oracleLink: '/chat?tradition=entheogen',
    oracleTradition: 'Entheogen Oracle',
    codexLinks: [],
    hasEmailSignup: true,
  },

  // 2. The Alchemy of the Soul: Twelve Stages of the Great Work
  'alchemy-of-soul-magnum-opus': {
    oraclePrompt: 'Where are you in the Great Work? The Oracle can help you locate your current stage — nigredo, albedo, citrinitas, or rubedo — and what the next threshold asks of you.',
    oracleLink: '/chat?tradition=hermetics',
    oracleTradition: 'Hermetic Oracle',
    codexLinks: [
      { label: 'Calcination', path: '/correspondence-engine?node=calcination' },
      { label: 'Conjunction', path: '/correspondence-engine?node=conjunction' },
      { label: 'Rubedo', path: '/correspondence-engine?node=rubedo' },
    ],
    hasEmailSignup: true,
  },

  // 3. The Dreamwalker's Protocol: Lucid Dreaming and Astral Projection
  'dreamwalker-lucid-dreaming-astral-projection': {
    oraclePrompt: 'Bring a dream, a recurring symbol, or a question about your practice to the Dreamwalker Oracle. It was trained on the literature of non-ordinary sleep states.',
    oracleLink: '/chat?tradition=dreamwalker',
    oracleTradition: 'Dreamwalker Oracle',
    codexLinks: [],
    hasEmailSignup: true,
  },

  // 4. Enochian: The Angelic Language That Created Modern Occultism
  'enochian-angelic-language-modern-occultism': {
    oraclePrompt: 'Explore the Enochian Calls, the elemental tablets, or the history of Dee and Kelley\'s workings in dialogue with the Oracle.',
    oracleLink: '/chat?tradition=hermetics',
    oracleTradition: 'Hermetic Oracle',
    codexLinks: [
      { label: 'Enochian Alphabet', path: '/correspondence-engine?node=enochian' },
    ],
    hasEmailSignup: true,
  },

  // 5. The Five Tibetans: Ancient Rites of Rejuvenation
  'five-tibetans-ancient-rites-of-rejuvenation': {
    oraclePrompt: 'Curious about integrating the Five Rites into a broader practice? The Tantra Oracle can contextualize them within yoga, subtle body work, and energy cultivation.',
    oracleLink: '/chat?tradition=tantra',
    oracleTradition: 'Tantra Oracle',
    codexLinks: [
      { label: 'Chakras', path: '/correspondence-engine?family=chakras' },
    ],
    hasEmailSignup: true,
  },

  // 6. Gnosticism: Archive of Light and the Divine Spark
  'gnosticism-archive-of-light-architecture-divine-spark': {
    oraclePrompt: 'The Pleroma, the Demiurge, the Archons, the divine spark — bring your questions about the Gnostic architecture of consciousness to the Oracle.',
    oracleLink: '/chat?tradition=hermetics',
    oracleTradition: 'Hermetic Oracle',
    codexLinks: [],
    hasEmailSignup: true,
  },

  // 7. The I Ching: Ancient Oracle of Change
  'i-ching-ancient-oracle-of-change': {
    oraclePrompt: 'Cast a hexagram. Ask the Tao Oracle to interpret a reading, explore a specific hexagram\'s meaning, or compare the I Ching\'s wisdom to your current situation.',
    oracleLink: '/chat?tradition=tao',
    oracleTradition: 'Tao Oracle',
    codexLinks: [
      { label: 'I Ching', path: '/correspondence-engine?family=iching' },
    ],
    hasEmailSignup: true,
  },

  // 8. Kundalini Shakti: The Serpent Power
  'kundalini-shakti-serpent-power-western-science': {
    oraclePrompt: 'The seven seals map the entire architecture of awakening. Bring your questions about chakras, subtle energy, or your own kundalini experience to the Tantra Oracle.',
    oracleLink: '/chat?tradition=tantra',
    oracleTradition: 'Tantra Oracle',
    codexLinks: [
      { label: 'Chakras', path: '/correspondence-engine?family=chakras' },
      { label: 'Physiology', path: '/correspondence-engine?family=physiology' },
    ],
    hasEmailSignup: true,
  },

  // 9. Sufism: The Path of Divine Love
  'sufism-the-path-of-divine-love': {
    oraclePrompt: 'From Rumi\'s longing to Ibn Arabi\'s Unity of Being — continue the conversation with the Sufi Mystic Oracle.',
    oracleLink: '/chat?tradition=sufi',
    oracleTradition: 'Sufi Oracle',
    codexLinks: [],
    hasEmailSignup: true,
  },

  // 10. The Tarot: Symbolic Machine for Mapping Fate
  'tarot-symbolic-machine-for-fate': {
    oraclePrompt: 'Draw a card. Ask for a reading. Compare Marseille and Rider-Waite symbolism. The Tarot Oracle knows the deck as a living language, not a fortune-telling gimmick.',
    oracleLink: '/chat?tradition=tarot',
    oracleTradition: 'Tarot Oracle',
    codexLinks: [
      { label: 'Tarot', path: '/correspondence-engine?family=tarot' },
    ],
    hasEmailSignup: true,
  },

  // 11. The Kybalion: 7 Hermetic Principles
  'the-kybalion-7-principles-hermetic-philosophy': {
    oraclePrompt: 'Mentalism, Correspondence, Vibration, Polarity, Rhythm, Causation, Gender — explore any principle in depth with the Oracle, or ask how they apply to your own inquiry.',
    oracleLink: '/chat?tradition=hermetics',
    oracleTradition: 'Hermetic Oracle',
    codexLinks: [
      { label: 'Mercury', path: '/correspondence-engine?node=mercury' },
      { label: 'Hermes Trismegistus', path: '/correspondence-engine?node=hermes-trismegistus' },
    ],
    hasEmailSignup: true,
  },

  // 12. Sexual Alchemy in Taoist Tradition: Nei Dan
  'sexual-alchemy-taoist-tradition-nei-dan': {
    oraclePrompt: 'Jing, Qi, Shen — the three treasures and the internal elixir. Bring your questions about Taoist energy cultivation and inner alchemy to the Tao Oracle.',
    oracleLink: '/chat?tradition=tao',
    oracleTradition: 'Tao Oracle',
    codexLinks: [
      { label: 'Energy', path: '/correspondence-engine?family=energy' },
      { label: 'Physiology', path: '/correspondence-engine?family=physiology' },
    ],
    hasEmailSignup: true,
  },

  // 13. Taoism and Quantum Physics: The Real Parallels
  'taoism-quantum-physics-real-parallels': {
    oraclePrompt: 'Where does metaphysical resonance end and pop-spirituality begin? Continue the inquiry with the Tao Oracle — it knows the difference.',
    oracleLink: '/chat?tradition=tao',
    oracleTradition: 'Tao Oracle',
    codexLinks: [
      { label: 'Frequencies', path: '/correspondence-engine?family=frequencies' },
    ],
    hasEmailSignup: true,
  },

  // 14. The Uncarved Block: Wu Wei and Decision Fatigue
  'what-tao-te-ching-says-about-uncertainty': {
    oraclePrompt: 'Bring a real decision you\'re facing to the Tao Oracle. Let Wu Wei become more than a concept.',
    oracleLink: '/chat?tradition=tao',
    oracleTradition: 'Tao Oracle',
    codexLinks: [],
    hasEmailSignup: true,
  },

  // 15. As Above, So Below: Hermeticism and Silicon Valley
  'seven-hermetic-principles-silicon-valley': {
    oraclePrompt: 'The seven principles aren\'t just philosophy — they\'re an operating system. Explore how Hermetic laws apply to your own work, code, or creative practice.',
    oracleLink: '/chat?tradition=hermetics',
    oracleTradition: 'Hermetic Oracle',
    codexLinks: [
      { label: 'Hermeticism', path: '/correspondence-engine?family=hermeticism' },
    ],
    hasEmailSignup: true,
  },

  // 16. Chaos Magick: Belief as a Recursive Technology
  'chaos-magick-not-what-you-think': {
    oraclePrompt: 'Sigils, paradigm shifting, and the technology of belief — explore the boundaries of magick and pragmatism with the Oracle.',
    oracleLink: '/chat',
    oracleTradition: 'The Oracle',
    codexLinks: [],
    hasEmailSignup: true,
  },
}

// Generic fallback for essays without custom CTAs
export const fallbackCTA = {
  oraclePrompt: "This inquiry doesn't have to end here. Bring your questions, reflections, or practice to the Oracle — and continue in dialogue.",
  oracleLink: '/chat',
  oracleTradition: 'The Oracle',
  codexLinks: [],
  hasEmailSignup: true,
}
