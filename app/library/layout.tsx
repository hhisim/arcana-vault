import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata(
  'Library — Sacred Texts Archive',
  'Browse the library of sacred texts — Tao Te Ching, I Ching, Book of Thoth, Gnostic gospels, Tantric texts, and more.',
  '/library',
)

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
