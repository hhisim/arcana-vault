import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata(
  'Journal — Sacred Tradition Essays',
  'Long-form essays on the world\'s sacred traditions — alchemy, Taoism, Gnosticism, Tantra, Tarot, Chaos Magick, and more.',
  '/blog',
)

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
