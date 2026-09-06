import type { Metadata } from 'next'

export const SITE_URL = 'https://www.vaultofarcana.com'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function seoTitle(title: string, maxLength = 48): string {
  const normalized = title.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  const candidate = normalized.slice(0, maxLength - 1).replace(/\s+[^\s]*$/, '').trim()
  return `${candidate || normalized.slice(0, maxLength - 1)}…`
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
