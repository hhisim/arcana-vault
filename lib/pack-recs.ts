import { PACKS, ShopPack } from './packs'

/**
 * Maps a blog post's `tradition` (and a few keyword signals) to relevant shop
 * pack SKUs, so each Scroll surfaces the archives that actually deepen its study.
 * Unmapped / uncommon topics fall back to the flagship general esoteric archives.
 */
const TRADITION_RECS: Record<string, string[]> = {
  alchemy: ['etsy-1889783512', 'etsy-4543073329', 'etsy-4545856178', 'etsy-1890769318'],
  hermetics: ['etsy-4310056291', 'etsy-4311224586', 'etsy-4311792279', 'etsy-4545818178'],
  enochian: ['etsy-4308981590', 'etsy-4310056291', 'etsy-1890769318'],
  kabbalah: ['etsy-4488658060', 'etsy-4302414623', 'etsy-4545842201', 'etsy-4543075975'],
  tao: ['etsy-4471894787', 'etsy-4543082389', 'etsy-4545856178'],
  tantra: ['etsy-4543075975', 'etsy-1906631935'],
  kundalini: ['etsy-4543075975', 'etsy-1906631935', 'etsy-1886869572'],
  tarot: ['etsy-1903856877', 'etsy-4491078191', 'etsy-4543079786', 'etsy-4537633204'],
  yoga: ['etsy-1906631935', 'etsy-4330541166'],
  sufism: ['etsy-4488453137', 'etsy-4330541166'],
  gnosticism: ['etsy-4306241391', 'etsy-4491083373', 'etsy-1890769318'],
  entheogens: ['etsy-4489018852', 'etsy-1888639622', 'etsy-4543166138'],
  'sacred-geometry': ['etsy-4543080231', 'etsy-4516425177', 'etsy-4329093346'],
  vedic: ['etsy-4329093346', 'etsy-1906631935'],
  'fourth-way': ['etsy-4329093346', 'etsy-1890769318'],
  kemet: ['etsy-4323025629', 'etsy-4543086125', 'etsy-4491083373'],
  egypt: ['etsy-4323025629', 'etsy-4543086125'],
  tibetan: ['etsy-1886869572', 'etsy-1888639622', 'etsy-1906631935'],
  dreamwalker: ['etsy-1888688570', 'etsy-4490122465', 'etsy-1888639622'],
  chaos: ['etsy-4307968359', 'etsy-4489220708'],
  'chaos-magick': ['etsy-4307968359', 'etsy-4489220708'],
  philosophy: ['etsy-4329093346', 'etsy-1890769318', 'etsy-4311828972'],
  science: ['etsy-4329093346', 'etsy-4513179705'],
  linguistics: ['etsy-4308981590', 'etsy-4329093346'],
  'sacred sound': ['etsy-1886869572', 'etsy-1888639622'],
  'hermetics-cymatics': ['etsy-4543080231', 'etsy-1886869572', 'etsy-4516425177'],
}

/** Flagship general archives shown when the topic has no specific pack of its own. */
const FALLBACK = ['etsy-4329093346', 'etsy-4311828972', 'etsy-1890769318']

// Extra per-slug overrides for posts whose tradition field is too broad.
const SLUG_OVERRIDES: Record<string, string[]> = {
  'amplituhedron-flower-of-life-sacred-geometry': ['etsy-4543080231', 'etsy-4516425177', 'etsy-4329093346'],
  'cymatics-word-of-god-hans-jenny-logos': ['etsy-4543080231', 'etsy-1886869572', 'etsy-4516425177'],
  'tarot-and-tree-of-life': ['etsy-4545842201', 'etsy-4543079786', 'etsy-4488658060'],
  'kundalini-shakti-serpent-power-western-science': ['etsy-4543075975', 'etsy-1886869572'],
  'hyperbolic-geometry-dmt-space-non-euclidean': ['etsy-4543166138', 'etsy-4489018852'],
  'chaos-magick-not-what-you-think': ['etsy-4307968359', 'etsy-4489220708', 'etsy-4329093346'],
  'egregore-warfare-chaos-magic-viral-thoughtforms': ['etsy-4307968359', 'etsy-4489220708', 'etsy-4329093346'],
  'metatrons-cube-tree-of-life-kabbalah-geometry': ['etsy-4543080231', 'etsy-4488658060', 'etsy-4329093346'],
  'tantra-kabbalah-tree-of-life-and-the-body': ['etsy-4543075975', 'etsy-4488658060', 'etsy-4302414623'],
  'entheogenic-dream-dmt-rem-visionary-states': ['etsy-4489018852', 'etsy-1888688570', 'etsy-1888639622'],
  'as-above-so-below-secret-thread-western-mysteries': ['etsy-4306241391', 'etsy-1890769318', 'etsy-4311828972'],
  'sufism-hermeticism-as-above-so-below': ['etsy-4488453137', 'etsy-1890769318', 'etsy-4311828972'],
  'picatrix-technology-of-correspondence-astrological-magic': ['etsy-4543069477', 'etsy-1890769318', 'etsy-4310056291'],
  'conference-of-the-birds-simurgh-map-of-self-recognition': ['etsy-4488453137', 'etsy-4330541166', 'etsy-4311828972'],
  'corpus-hermeticum-poimandres-cosmic-human': ['etsy-1890769318', 'etsy-4543073329', 'etsy-4310056291'],
  'sefer-yetzirah-32-paths-of-wisdom': ['etsy-4488658060', 'etsy-4302414623', 'etsy-4545842201'],
  'kabbalah-tree-of-life-sefirot-explained': ['etsy-4488658060', 'etsy-4302414623', 'etsy-4545842201'],
}

/** Resolve packs for a post by slug, then tradition, with a flagSHip fallback. */
export function packsForPost(slug: string, tradition: string): ShopPack[] {
  const key = (tradition || '').toLowerCase().trim()
  const skus = SLUG_OVERRIDES[slug] || TRADITION_RECS[key] || FALLBACK
  const bySku = new Map(PACKS.map((p) => [p.sku, p]))
  const picks: ShopPack[] = []
  for (const sku of skus) {
    const p = bySku.get(sku)
    if (p) picks.push(p)
    if (picks.length === 3) break
  }
  // Ensure we always render something even if a SKU drifted.
  if (picks.length === 0) {
    for (const sku of FALLBACK) {
      const p = bySku.get(sku)
      if (p) picks.push(p)
    }
  }
  return picks
}
