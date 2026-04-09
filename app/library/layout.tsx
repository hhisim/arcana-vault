import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Library — Sacred Texts Archive | Vault of Arcana',
  description: 'Browse the library of sacred texts — Tao Te Ching, I Ching, Book of Thoth, Gnostic gospels, Tantric texts, and more.',
  alternates: {
    canonical: 'https://www.vaultofarcana.com/library',
  },
  openGraph: {
    title: 'Library | Vault of Arcana',
    description: 'Sacred texts from the world\'s wisdom traditions.',
    url: 'https://www.vaultofarcana.com/library',
    type: 'website',
  },
}

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
