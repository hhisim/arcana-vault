import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Journal — Essays on Sacred Traditions | Vault of Arcana',
  description: 'Long-form essays on the world\'s sacred traditions — alchemy, Taoism, Gnosticism, Tantra, Tarot, Chaos Magick, and more.',
  alternates: {
    canonical: 'https://www.vaultofarcana.com/blog',
  },
  openGraph: {
    title: 'Journal | Vault of Arcana',
    description: 'Essays on sacred traditions and the mystery school.',
    url: 'https://www.vaultofarcana.com/blog',
    type: 'website',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
