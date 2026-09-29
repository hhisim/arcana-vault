import type { Metadata } from 'next'

export const SITE_URL = 'https://www.vaultofarcana.com'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Words that must never be the final token of a <title>. A title ending in one of these
 * reads as broken in the SERP, and was the visible symptom of the old blunt truncation:
 * "Metatron's Cube and the Tree of Life: When Kabbalah and".
 */
const TITLE_STOPWORDS =
  /^(and|or|but|of|the|a|an|to|in|on|at|by|for|with|from|as|is|are|was|were|be|been|that|this|these|those|it|its|into|onto|over|than|then|so|if|when|while|where|what|which|who|how|why|not|no|our|your|their|his|her|my)$/i

/** Clause boundaries we prefer to cut on, in priority order. */
const TITLE_CLAUSE_SPLITS: RegExp[] = [
  /:\s+(?=\S)/,
  /\s+[—–-]\s+(?=\S)/,
  /\?\s+(?=\S)/,
]

/**
 * Trim a title to fit, preferring a clause boundary and never leaving a dangling connective.
 *
 * Widened from 60 to 72 characters. Google truncates the SERP for DISPLAY, which is a reason
 * to make the cut clean — not to amputate the essay's own keyword off the end of its title.
 * Measured before/after on lib/posts.ts: 17 dangling titles -> 0.
 */
export function seoTitle(title: string, maxLength = 72): string {
  const normalized = title.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized

  const words = normalized.split(' ')
  const out: string[] = []
  let len = 0

  for (const word of words) {
    if (len + word.length + (out.length ? 1 : 0) > maxLength) break
    out.push(word)
    len += word.length + (out.length > 1 ? 1 : 0)
  }

  const candidate = out.join(' ')

  // 1. Prefer a clause boundary inside the budget we already fitted.
  for (const split of TITLE_CLAUSE_SPLITS) {
    const at = candidate.split(split)
    if (at.length > 1) {
      const head = at[0].trim()
      if (head.length >= 24) return head
    }
  }

  // 2. Fall back to the longest word boundary that does not strand a connective.
  while (out.length > 1 && TITLE_STOPWORDS.test(out[out.length - 1])) out.pop()
  const trimmed = out.join(' ')
  if (trimmed.length >= 24) return trimmed

  // 3. Very short title that still overflows — hard slice rather than emit nothing.
  return normalized.slice(0, maxLength - 1).replace(/\s+[^\s]*$/, '').trim() || normalized
}

export function seoDescription(description: string, maxLength = 160): string {
  const normalized = description.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  const candidate = normalized.slice(0, maxLength - 1).replace(/\s+[^\s]*$/, '').trim()
  return `${candidate || normalized.slice(0, maxLength - 1)}…`
}

type SeoOptions = {
  type?: 'website' | 'article'
  noIndex?: boolean
  image?: string
  imageAlt?: string
}

export function buildMetadata(
  title: string,
  description: string,
  path: string,
  options: SeoOptions = {},
): Metadata {
  const pageTitle = seoTitle(title)
  const pageDescription = seoDescription(description)
  const url = absoluteUrl(path)
  const image = absoluteUrl(options.image || DEFAULT_OG_IMAGE)
  const socialTitle = `${pageTitle} | Vault of Arcana`
  const imageObject = {
    url: image,
    width: 1200,
    height: 630,
    alt: options.imageAlt || `${pageTitle} — Vault of Arcana`,
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: pageTitle,
    description: pageDescription,
    alternates: { canonical: url },
    ...(options.noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: socialTitle,
      description: pageDescription,
      url,
      siteName: 'Vault of Arcana',
      type: options.type || 'website',
      images: [imageObject],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: pageDescription,
      images: [image],
    },
  }
}
