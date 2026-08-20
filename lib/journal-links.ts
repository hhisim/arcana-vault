// === VOA → UT Journal Cross-Link (back-loop) =================================
// Closes the funnel loop: on a VOA pack page, surface the related Universal
// Transmissions journal essays that introduced the tradition, so readers can
// (a) read deeper for free and (b) re-enter the UT → VOA journey. Rendered as a
// "Related transmissions" card on /shop/[sku].
//
// Keys are VOA pack SKUs (lib/shop-catalog.ts); values point at UT journal
// essays (https://www.universal-transmissions.com/journal/<slug>).

export type JournalLink = {
  slug: string;
  title: string;
  tradition: string;
};

const J = (slug: string, title: string, tradition: string): JournalLink => ({
  slug,
  title,
  tradition,
});

// Pack SKU -> related UT essay(s)
export const JOURNAL_LINKS_BY_SKU: Record<string, JournalLink[]> = {
  // Tarot
  "etsy-1903856877": [
    J(
      "tarot-symbolic-machine-for-fate",
      "Tarot — the Symbolic Machine for Fate",
      "tarot"
    ),
  ],
  "etsy-4543079786": [
    J(
      "tarot-symbolic-machine-for-fate",
      "Tarot — the Symbolic Machine for Fate",
      "tarot"
    ),
  ],
  "etsy-4491078191": [
    J(
      "tarot-symbolic-machine-for-fate",
      "Tarot — the Symbolic Machine for Fate",
      "tarot"
    ),
  ],

  // Dream / astral
  "etsy-4490122465": [
    J(
      "dreamwalker-lucid-dreaming-astral-projection",
      "Dreamwalker — Lucid Dreaming & Astral Projection",
      "dream-yoga"
    ),
  ],
  "etsy-1888688570": [
    J(
      "dreamwalker-lucid-dreaming-astral-projection",
      "Dreamwalker — Lucid Dreaming & Astral Projection",
      "dream-yoga"
    ),
  ],

  // Tao / I Ching
  "etsy-4471894787": [
    J(
      "i-ching-ancient-oracle-of-change",
      "I Ching — the Ancient Oracle of Change",
      "tao"
    ),
    J(
      "taoism-quantum-physics-controversy",
      "Taoism & Quantum Physics — the Controversy",
      "tao"
    ),
  ],
  "etsy-4543082389": [
    J(
      "sexual-alchemy-taoist-tradition",
      "Sexual Alchemy in the Taoist Tradition",
      "tao"
    ),
    J(
      "i-ching-ancient-oracle-of-change",
      "I Ching — the Ancient Oracle of Change",
      "tao"
    ),
  ],

  // Alchemy / Hermetic
  "etsy-1889783512": [
    J(
      "alchemy-of-soul-magnum-opus",
      "Alchemy of the Soul — the Magnum Opus",
      "alchemy"
    ),
    J(
      "the-kybalion-7-principles-hermetic-philosophy",
      "The Kybalion — 7 Principles of Hermetic Philosophy",
      "hermeticism"
    ),
  ],
  "etsy-4543073329": [
    J(
      "the-kybalion-7-principles-hermetic-philosophy",
      "The Kybalion — 7 Principles of Hermetic Philosophy",
      "hermeticism"
    ),
    J(
      "alchemy-of-soul-magnum-opus",
      "Alchemy of the Soul — the Magnum Opus",
      "alchemy"
    ),
  ],

  // Kundalini / Tantra
  "etsy-4543075975": [
    J(
      "kundalini-shakti-serpent-power-western-science",
      "Kundalini Shakti — the Serpent Power in Western Science",
      "tantra"
    ),
  ],

  // Sufism
  "etsy-4488453137": [
    J(
      "sufism-the-path-of-divine-love",
      "Sufism — the Path of Divine Love",
      "sufism"
    ),
  ],

  // Enochian
  "etsy-4308981590": [
    J(
      "enochian-angelic-language-modern-occultism",
      "Enochian — an Angelic Language in Modern Occultism",
      "enochian"
    ),
  ],

  // Gnosticism
  "etsy-4306241391": [
    J(
      "gnosticism-archive-of-light-architecture-divine-spark",
      "Gnosticism — the Archive of Light, the Architecture of the Divine Spark",
      "gnosticism"
    ),
  ],

  // Entheogens
  "etsy-4489018852": [
    J(
      "2026-03-19-dmt-as-the-orthogonal-api-key",
      "DMT as the Orthogonal API Key",
      "entheogens"
    ),
  ],

  // Sacred geometry
  "etsy-634858175": [
    J(
      "2026-03-19-the-cosmic-sandbox",
      "The Cosmic Sandbox",
      "sacred-geometry"
    ),
  ],
  "etsy-4543080231": [
    J(
      "2026-03-19-the-cosmic-sandbox",
      "The Cosmic Sandbox",
      "sacred-geometry"
    ),
  ],

  // Meditation / energy
  "etsy-1906631935": [
    J(
      "five-tibetans-ancient-rites-of-rejuvenation",
      "The Five Tibetans — Ancient Rites of Rejuvenation",
      "yoga"
    ),
  ],
};

export function getJournalLinks(sku: string): JournalLink[] {
  return JOURNAL_LINKS_BY_SKU[sku] || [];
}

const UT_BASE = "https://www.universal-transmissions.com/journal";

export function journalUrl(slug: string): string {
  return `${UT_BASE}/${slug}`;
}