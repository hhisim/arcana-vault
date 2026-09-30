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

  // --- Curated 2026-09-30: extends the UT->VOA back-loop from 17 to 61 packs ---
  // Every slug below is verified present in the live UT sitemap. Packs with no
  // genuine thematic match are intentionally left unmapped rather than given a
  // token link.
  "etsy-1890769318": [
    J(
      "hermetic-crater-cup-of-mind",
      "The Hermetic Crater — Cup of the Mind",
      "hermetics"
    ),
    J(
      "alchemy-of-soul-magnum-opus",
      "Alchemy of the Soul — The Magnum Opus",
      "alchemy"
    ),
  ],
  "etsy-4329093346": [
    J(
      "corpus-hermeticum-poimandres-cosmic-human",
      "Corpus Hermeticum — Poimandres and the Cosmic Human",
      "hermetics"
    ),
    J(
      "alchemy-of-soul-magnum-opus",
      "Alchemy of the Soul — The Magnum Opus",
      "alchemy"
    ),
  ],
  "etsy-4311792279": [
    J(
      "rosicrucian-manifestos-public-secret-reformation",
      "Rosicrucian Manifestos — Public Secret and Reformation",
      "rosicrucianism"
    ),
  ],
  "etsy-4311224586": [
    J(
      "enochian-angelic-language-modern-occultism",
      "Enochian — Angelic Language and Modern Occultism",
      "enochian"
    ),
  ],
  "etsy-4311828972": [
    J(
      "hermetic-crater-cup-of-mind",
      "The Hermetic Crater — Cup of the Mind",
      "hermetics"
    ),
  ],
  "etsy-4307968359": [
    J(
      "hermetic-crater-cup-of-mind",
      "The Hermetic Crater — Cup of the Mind",
      "hermetics"
    ),
  ],
  "etsy-4310056291": [
    J(
      "hermetic-crater-cup-of-mind",
      "The Hermetic Crater — Cup of the Mind",
      "hermetics"
    ),
    J(
      "corpus-hermeticum-poimandres-cosmic-human",
      "Corpus Hermeticum — Poimandres and the Cosmic Human",
      "hermetics"
    ),
  ],
  "etsy-4312897379": [
    J(
      "hermetic-crater-cup-of-mind",
      "The Hermetic Crater — Cup of the Mind",
      "hermetics"
    ),
    J(
      "picatrix-technology-of-correspondence-astrological-magic",
      "Picatrix — Correspondence and Astrological Magic",
      "hermetics"
    ),
  ],
  "etsy-1886869572": [
    J(
      "five-tibetans-ancient-rites-of-rejuvenation",
      "The Five Tibetans — Ancient Rites of Rejuvenation",
      "yoga"
    ),
  ],
  "etsy-4488658060": [
    J(
      "kabbalah-tree-of-life-sefirot-explained",
      "Kabbalah — Tree of Life and the Sefirot Explained",
      "kabbalah"
    ),
    J(
      "sefer-yetzirah-32-paths-of-wisdom",
      "Sefer Yetzirah — The 32 Paths of Wisdom",
      "kabbalah"
    ),
  ],
  "etsy-4302414623": [
    J(
      "kabbalah-tree-of-life-sefirot-explained",
      "Kabbalah — Tree of Life and the Sefirot Explained",
      "kabbalah"
    ),
    J(
      "sefer-yetzirah-32-paths-of-wisdom",
      "Sefer Yetzirah — The 32 Paths of Wisdom",
      "kabbalah"
    ),
  ],
  "etsy-4489220708": [
    J(
      "hermetic-crater-cup-of-mind",
      "The Hermetic Crater — Cup of the Mind",
      "hermetics"
    ),
  ],
  "etsy-1888639622": [
    J(
      "dreamwalker-lucid-dreaming-astral-projection",
      "Dreamwalker — Lucid Dreaming and Astral Projection",
      "dreamwalker"
    ),
    J(
      "third-vortex-the-power",
      "Third Vortex — The Power",
      "yoga"
    ),
  ],
  "etsy-4516425177": [
    J(
      "2026-03-19-the-cosmic-sandbox",
      "The Cosmic Sandbox",
      "sacred-geometry"
    ),
    J(
      "cymatics-language-of-form",
      "Cymatics — The Language of Form",
      "sacred-geometry"
    ),
  ],
  "etsy-4323025629": [
    J(
      "book-of-thoth-egyptian-knowledge-scribe",
      "Book of Thoth — Egyptian Knowledge as Scribe",
      "kemet"
    ),
    J(
      "egyptian-book-of-the-dead-heart-scale-maat",
      "Egyptian Book of the Dead — Heart, Scale and Ma'at",
      "kemet"
    ),
  ],
  "etsy-4322941091": [
    J(
      "hermetic-crater-cup-of-mind",
      "The Hermetic Crater — Cup of the Mind",
      "hermetics"
    ),
  ],
  "etsy-4329083079": [
    J(
      "hermetic-crater-cup-of-mind",
      "The Hermetic Crater — Cup of the Mind",
      "hermetics"
    ),
  ],
  "etsy-4310832778": [
    J(
      "picatrix-technology-of-correspondence-astrological-magic",
      "Picatrix — Correspondence and Astrological Magic",
      "hermetics"
    ),
  ],
  "etsy-4513179705": [
    J(
      "tarot-symbolic-machine-for-fate",
      "Tarot — the Symbolic Machine for Fate",
      "tarot"
    ),
    J(
      "picatrix-technology-of-correspondence-astrological-magic",
      "Picatrix — Correspondence and Astrological Magic",
      "hermetics"
    ),
  ],
  "etsy-4491576096": [
    J(
      "corpus-hermeticum-poimandres-cosmic-human",
      "Corpus Hermeticum — Poimandres and the Cosmic Human",
      "hermetics"
    ),
    J(
      "taoist-microcosmic-orbit-inner-alchemy",
      "Taoist Microcosmic Orbit — Inner Alchemy",
      "tao"
    ),
  ],
  "etsy-4491083373": [
    J(
      "gnosticism-archive-of-light-architecture-divine-spark",
      "Gnosticism — Archive of Light Architecture",
      "gnosticism"
    ),
  ],
  "etsy-4545522210": [
    J(
      "hermetic-crater-cup-of-mind",
      "The Hermetic Crater — Cup of the Mind",
      "hermetics"
    ),
  ],
  "etsy-4543069477": [
    J(
      "picatrix-technology-of-correspondence-astrological-magic",
      "Picatrix — Correspondence and Astrological Magic",
      "hermetics"
    ),
    J(
      "hermetic-crater-cup-of-mind",
      "The Hermetic Crater — Cup of the Mind",
      "hermetics"
    ),
  ],
  "etsy-4537633204": [
    J(
      "tarot-symbolic-machine-for-fate",
      "Tarot — the Symbolic Machine for Fate",
      "tarot"
    ),
  ],
  "etsy-4545818178": [
    J(
      "rosicrucian-manifestos-public-secret-reformation",
      "Rosicrucian Manifestos — Public Secret and Reformation",
      "rosicrucianism"
    ),
  ],
  "etsy-4545856178": [
    J(
      "alchemy-of-soul-magnum-opus",
      "Alchemy of the Soul — The Magnum Opus",
      "alchemy"
    ),
    J(
      "taoist-microcosmic-orbit-inner-alchemy",
      "Taoist Microcosmic Orbit — Inner Alchemy",
      "tao"
    ),
  ],
  "etsy-4545668667": [
    J(
      "hermetic-crater-cup-of-mind",
      "The Hermetic Crater — Cup of the Mind",
      "hermetics"
    ),
    J(
      "corpus-hermeticum-poimandres-cosmic-human",
      "Corpus Hermeticum — Poimandres and the Cosmic Human",
      "hermetics"
    ),
  ],
  "etsy-4545842201": [
    J(
      "tarot-symbolic-machine-for-fate",
      "Tarot — the Symbolic Machine for Fate",
      "tarot"
    ),
    J(
      "kabbalah-tree-of-life-sefirot-explained",
      "Kabbalah — Tree of Life and the Sefirot Explained",
      "kabbalah"
    ),
  ],
  "etsy-4543166138": [
    J(
      "2026-03-19-the-cosmic-sandbox",
      "The Cosmic Sandbox",
      "sacred-geometry"
    ),
    J(
      "cymatics-language-of-form",
      "Cymatics — The Language of Form",
      "sacred-geometry"
    ),
  ],
  "etsy-4543086125": [
    J(
      "book-of-thoth-egyptian-knowledge-scribe",
      "Book of Thoth — Egyptian Knowledge as Scribe",
      "kemet"
    ),
    J(
      "egyptian-book-of-the-dead-heart-scale-maat",
      "Egyptian Book of the Dead — Heart, Scale and Ma'at",
      "kemet"
    ),
  ],
  "etsy-4547014447": [
    J(
      "five-tibetans-ancient-rites-of-rejuvenation",
      "The Five Tibetans — Ancient Rites of Rejuvenation",
      "yoga"
    ),
  ],
  "etsy-4547455025": [
    J(
      "tarot-symbolic-machine-for-fate",
      "Tarot — the Symbolic Machine for Fate",
      "tarot"
    ),
  ],
  "etsy-4552205423": [
    J(
      "working-on-the-5th-chakra",
      "Working on the 5th Chakra",
      "yoga"
    ),
  ],
  "etsy-4561328273": [
    J(
      "red-book-active-imagination-ethics-image",
      "The Red Book — Active Imagination and the Ethics of the Image",
      "philosophy"
    ),
    J(
      "gnosticism-archive-of-light-architecture-divine-spark",
      "Gnosticism — Archive of Light Architecture",
      "gnosticism"
    ),
  ],
  "etsy-4562868882": [
    J(
      "dreamwalker-lucid-dreaming-astral-projection",
      "Dreamwalker — Lucid Dreaming and Astral Projection",
      "dreamwalker"
    ),
  ],
  "etsy-4561633018": [
    J(
      "enochian-angelic-language-modern-occultism",
      "Enochian — Angelic Language and Modern Occultism",
      "enochian"
    ),
  ],
  "etsy-4561586193": [
    J(
      "dreamwalker-lucid-dreaming-astral-projection",
      "Dreamwalker — Lucid Dreaming and Astral Projection",
      "dreamwalker"
    ),
  ],
  "etsy-4561531962": [
    J(
      "the-shape-before-the-world",
      "The Shape Before the World",
      "philosophy"
    ),
  ],
  "etsy-4561350260": [
    J(
      "third-vortex-the-power",
      "Third Vortex — The Power",
      "yoga"
    ),
    J(
      "the-making-of-power",
      "The Making of Power",
      "yoga"
    ),
  ],
  "etsy-4556298212": [
    J(
      "the-making-of-power",
      "The Making of Power",
      "yoga"
    ),
    J(
      "third-vortex-the-power",
      "Third Vortex — The Power",
      "yoga"
    ),
  ],
  "etsy-4546962947": [
    J(
      "fasting-of-the-heart-zhuangzi-attention",
      "The Fasting of the Heart — Zhuangzi on Attention",
      "tao"
    ),
    J(
      "the-star-and-the-uncarved-block",
      "The Star and the Uncarved Block",
      "tao"
    ),
  ],
  "etsy-4491074798": [
    J(
      "sexual-alchemy-taoist-tradition",
      "Sexual Alchemy in the Taoist Tradition",
      "tao"
    ),
  ],
  "etsy-4488448861": [
    J(
      "toroidal-tantra",
      "Toroidal Tantra",
      "tantra"
    ),
    J(
      "kundalini-shakti-serpent-power-western-science",
      "Kundalini — Shakti, Serpent Power and Western Science",
      "tantra"
    ),
  ],
  "etsy-4334241254": [
    J(
      "vijnana-bhairava-112-doors-technology-of-attention",
      "Vijnana Bhairava — The 112 Doors of Attention",
      "tantra"
    ),
    J(
      "toroidal-tantra",
      "Toroidal Tantra",
      "tantra"
    ),
  ]

};

export function getJournalLinks(sku: string): JournalLink[] {
  return JOURNAL_LINKS_BY_SKU[sku] || [];
}

const UT_BASE = "https://www.universal-transmissions.com/journal";

export function journalUrl(slug: string): string {
  return `${UT_BASE}/${slug}`;
}