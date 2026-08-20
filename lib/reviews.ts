/**
 * Real Etsy review/rating snapshot for the Vault of Arcana pack shop.
 *
 * Sourced live from Etsy's shop-reviews API on 2026-08-05. Etsy does not return
 * review *message text* via the API (only rating + count), so we surface honest
 * star ratings and review counts — never fabricated prose.
 *
 * Two values are one-time snapshots; refresh `packRatings`/`SHOP` when you want
 * newer numbers (see /tmp/fetch_reviews.py).
 */

export type PackRating = {
  /** Average star rating (0–5), rounded to 2 decimals. */
  rating: number
  /** Number of reviews that contributed to the average. */
  count: number
}

/** Shop-wide aggregate across all listings (550 reviews, avg 4.59). */
export const SHOP_RATING: PackRating = { rating: 4.6, count: 550 }

/**
 * Per-pack ratings. Only packs with real reviews averaging >= 4.0 are listed,
 * so every surfaced rating is genuine, positive social proof.
 */
export const PACK_RATINGS: Record<string, PackRating> = {
  'etsy-1890769318': { rating: 4.6, count: 5 }, // Grimoire & Occult Archive
  'etsy-1906598267': { rating: 4.7, count: 3 }, // Complete Works of Rudolf Steiner
  'etsy-4308981590': { rating: 5.0, count: 2 }, // Enochian Magick Archive
  'etsy-1888688570': { rating: 5.0, count: 2 }, // Astral Projection & Lucid Dreaming
  'etsy-4306241391': { rating: 5.0, count: 2 }, // Gnosticism Digital Library
  'etsy-4311792279': { rating: 5.0, count: 1 }, // Rosicrucian Mega Pack
  'etsy-4310056291': { rating: 5.0, count: 1 }, // Golden Dawn Digital Archive
  'etsy-4488658060': { rating: 5.0, count: 1 }, // Kabbalah Oracle AI
  'etsy-4302414623': { rating: 5.0, count: 1 }, // Kabbalah Archive 22GB
  'etsy-1903856877': { rating: 5.0, count: 1 }, // Tarot Mega Bundle
  'etsy-4471894787': { rating: 5.0, count: 1 }, // Tao Oracle AI
  'etsy-4516425177': { rating: 5.0, count: 1 }, // Sacred Geometry Vector Bundle
}

/** Fraction of full stars to render, for the 5-star display row. */
export function starFill(rating: number): number {
  return Math.max(0, Math.min(5, rating))
}

export function getPackRating(sku: string): PackRating | undefined {
  return PACK_RATINGS[sku]
}
