// Curated SEO titles for Vault of Arcana essays — GENERATED, keyed on exact lib/posts.ts titles.
//
// WHY THIS FILE EXISTS
// --------------------
// `seoTitle()` in lib/seo.ts used to hard-truncate the <title> at 60 characters. Measured on
// lib/posts.ts (voa/growth-2026-09 worktree): 50 of 58 registered essays were cut and 17 ended
// on a dangling connective — which is exactly what Google was rendering:
//
//   "Metatron's Cube and the Tree of Life: When Kabbalah and"
//   "As Above, So Below: The Secret Thread Running Through the"
//   "The Kybalion: The 7 Principles of Hermetic Philosophy That"
//
// 1,184 characters cut, frequently removing the essay's own keyword (Kabbalah, Geometry, DMT,
// Vijnana Bhairava) from the end of its title. This is the most likely mechanical cause of the
// blog's 0.70% CTR against a 1.63% site average.
//
// The fix has two halves:
//   1. lib/seo.ts now cuts on a clause boundary at a 72-char budget, never onto a stopword.
//   2. The table below overrides the essays whose distinctive term sits past the budget.
//
// Keys are the EXACT registry titles, not slugs — posts.ts uses short editorial slugs and
// slugifying these titles mangles apostrophes and em-dashes.

export const ESSAY_SEO_TITLES: Record<string, string> = {
  'The Book of Thoth Was Not a Secret: How Egyptian Knowledge Trained the Scribe':
    'The Book of Thoth: How Egypt Trained the Scribe',
  'Sacred Geometry Explained: The Flower of Life, Metatron\'s Cube and the Blueprint of Creation':
    'Sacred Geometry: Flower of Life & Metatron\'s Cube',
  'The Akashic Record as Holographic Universe: Vedic Cosmology Meets Bohm\'s Implicate Order':
    'The Akashic Record: Vedic Cosmology, Implicate Order',
  'The Sefirot as Neural Architecture: Why Kabbalists Mapped God Before We Mapped Intelligence':
    'The Sefirot as Neural Architecture: God Before AI',
  'The Rosicrucian Manifestos: How a Secret Brotherhood Turned Absence into a Method of Reform':
    'The Rosicrucian Manifestos: Absence as Method',
  'The 112 Doors of the Vijnana Bhairava: How Attention Becomes a Technology':
    'The 112 Doors: Attention as Technology',
  'The Imaginal World: Ibn Arabi and the Discipline of Perception Between Spirit and Matter':
    'The Imaginal World: Ibn Arabi on Perception',
  'The Hermetic Crater: The Cup of Mind and the Discipline of Receiving':
    'The Hermetic Crater: The Cup of Mind',
  'The Microcosmic Orbit: How Taoist Inner Alchemy Turns the Body into a Practice of Return':
    'The Microcosmic Orbit: Alchemy of Return',
  'As Above, So Below: The Secret Thread Running Through the Western Mysteries':
    'As Above, So Below: A Secret Thread',
  'As Above, So Below: The Sufi Mirror and the Hermetic Principle \\u2014 Two Traditions, One Alchemy':
    'As Above, So Below: Sufi & Hermetic',
  'Tantra and Kabbalah: The Tree of Life and the Body of Light \\u2014 Two Maps of the Inner Cosmos':
    'Tantra & Kabbalah: Two Inner Maps',
  'Timewave Zero and the Eschaton: McKenna\'s Novelty Theory as a Compression Algorithm':
    'Timewave Zero: Novelty as Compression',
  'Solve et Coagula as Quantum Decoherence: The Alchemical Opus as a Physics Textbook':
    'Solve et Coagula: Opus as Physics',
  'The Dreamwalker\'s Protocol: Navigating Lucid Dreaming and Astral Projection':
    'The Dreamwalker\'s Protocol',
  'The Alchemy of the Soul: The Twelve Stages of the Great Work (Magnum Opus)':
    'The Alchemy of the Soul: Twelve Stages',
  'The Hyperbolic Geometry of DMT Space: Mathematical Proof of a Non-Euclidean Realm':
    'The Hyperbolic Geometry of DMT Space',
  'It From Bit: The Kybalion\'s \'All Is Mind\' and Wheeler\'s Information-Theoretic Universe':
    'It From Bit: Kybalion & Wheeler',
  'Egregore Warfare: How Chaos Magic Predicted the Age of Viral Thoughtforms':
    'Egregore Warfare: Chaos & Virality',
  'Cymatics and the Word of God: Hans Jenny\'s Vibrating Matter as Proof of the Logos':
    'Cymatics: Jenny\'s Vibrating Matter',
  'The Amplituhedron and the Flower of Life: When Physicists Redrew Sacred Geometry':
    'The Amplituhedron and Sacred Geometry',
  'The Temple in Man: How Ancient Egypt Encoded the Human Body in Stone':
    'The Temple in Man: Body in Stone',
  'The Heart on the Scale: How the Egyptian Book of the Dead Makes a Self Legible':
    'The Heart on the Scale',
  'Walter Russell\'s The Universal One: When Cosmology Became a Diagram of Light':
    'Walter Russell: The Universal One',
  'The Qliphoth as Error States: Kabbalah\'s Shadow Tree as a Map of System Failure':
    'The Qliphoth as Error States',
  'Gnosticism: The Archive of Light and the Architecture of the Divine Spark':
    'Gnosticism: Light & the Divine Spark',
  'Sophia\'s Fall and the Emergence of AI: Gnostic Cosmogony as Machine Learning':
    'Sophia\'s Fall and the Emergence of AI',
  'Beelzebub\'s Tales as Operating Manual: Gurdjieff\'s Disguised Cosmology Decoded':
    'Beelzebub\'s Tales: Gurdjieff Decoded',
  'The Entheogenic Dream: DMT, REM, and the Shared Architecture of Visionary Worlds':
    'The Entheogenic Dream: DMT, REM, Worlds',
  'Metatron\'s Cube and the Tree of Life: When Kabbalah and Geometry Share One Blueprint':
    'Metatron\'s Cube: Kabbalah & Geometry',
  'Kabbalah\'s Tree of Life: The Ten Sefirot as a Map of Consciousness':
    'Kabbalah\'s Tree of Life: The Ten Sefirot',
  'The Tarot: A Symbolic Machine for Mapping the Architecture of Fate':
    'The Tarot: Mapping the Architecture',
  'The Kybalion: The 7 Principles of Hermetic Philosophy That Predate Modern Psychology':
    'The Kybalion: 7 Hermetic Principles',
  'The Fasting of the Heart: Zhuangzi\'s Attention Practice for an Overloaded Age':
    'The Fasting of the Heart: Zhuangzi',
  'As Above, So Below: Why Hermeticism Resonates with Silicon Valley':
    'As Above, So Below: Hermeticism & Silicon',
  'The Five Tibetans: Ancient Rites of Rejuvenation or Modern Myth?':
    'The Five Tibetans: Ritual or Myth?',
  'Enochian as First Contact Protocol: John Dee and the SETI Problem':
    'Enochian: John Dee and the SETI Problem',
  'The I Ching: Ancient Oracle of Change Through 8 Trigrams and 64 Hexagrams':
    'The I Ching: 8 Trigrams, 64 Hexagrams',
  'Kundalini Shakti: The Serpent Power That Western Science Can\'t Explain':
    'Kundalini Shakti: The Serpent Power',
  'Sufism: The Mystical Path of Divine Love and the Alchemy of the Soul':
    'Sufism: Divine Love and the Soul',
  'The Uncarved Block: Applying Wu Wei to Modern Decision Fatigue':
    'The Uncarved Block: Wu Wei & Fatigue',
  'The Law of One: When Cosmic Unity Becomes an Ethics of Relation':
    'The Law of One: Unity as Ethics',

  // ---- orphaned essays brought back into the registry ----
  'John Dee\'s Enochian Angelic Diaries: The Lost Cryptographic Language of Angels':
    'John Dee\'s Enochian Diaries: A Cryptographic Language',
  'The Necronomicon Myth: Fiction vs. Arabic Grimoire Traditions':
    'The Necronomicon: Fiction vs. Arabic Grimoire',
}

/** Curated title for a registry title, or undefined when the generated cut is good enough. */
export function curatedEssayTitle(title: string): string | undefined {
  return ESSAY_SEO_TITLES[title]
}
