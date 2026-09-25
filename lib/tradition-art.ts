export type TraditionArt = Readonly<{
  src: string
  alt: string
  position: string
}>

/**
 * Small existing editorial images used as visual accents on the gateway cards.
 * Keep this manifest tied to the live tradition slugs so a missing asset cannot
 * silently turn into a decorative request for a made-up image.
 */
export const TRADITION_ART: Record<string, TraditionArt> = {
  tao: {
    src: '/images/blog/what-tao-te-ching-says-about-uncertainty/image-2.webp',
    alt: 'A luminous gold mandala on a dark field',
    position: '50% 50%',
  },
  tarot: {
    src: '/images/blog/tarot-symbolic-machine-for-fate/image-2.webp',
    alt: 'A radiant golden figure framed by a celestial tarot design',
    position: '50% 50%',
  },
  tantra: {
    src: '/images/blog/sexual-alchemy-taoist-tradition-nei-dan/image-2.webp',
    alt: 'A glowing golden serpent winding through a symmetrical mandala',
    position: '50% 50%',
  },
  entheogens: {
    src: '/images/blog/dmt-hyperbolic-mind/cover.webp',
    alt: 'A luminous figure surrounded by cyan and magenta visionary geometry',
    position: '50% 50%',
  },
  sufi: {
    src: '/images/blog/sufism-hermeticism-as-above-so-below/cover.webp',
    alt: 'A gold geometric star around a bright central light',
    position: '50% 50%',
  },
  dreamwalker: {
    src: '/images/blog/dreamwalker-lucid-dreaming-astral-projection/image-3.webp',
    alt: 'A luminous dream figure reaching over a sleeping person beneath a moonlit window',
    position: '50% 50%',
  },
  'chaos-magick': {
    src: '/images/blog/chaos-magick-not-what-you-think/cover.webp',
    alt: 'A neon crystalline sigil against a dark violet field',
    position: '50% 50%',
  },
  kabbalah: {
    src: '/images/blog/sefirot-neural-architecture-kabbalah/cover.webp',
    alt: 'A glowing brain beneath a geometric constellation',
    position: '50% 50%',
  },
}
