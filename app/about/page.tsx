import { buildMetadata } from '@/lib/seo'
import AboutContent from './AboutContent'

export const metadata = buildMetadata(
  'About the Mystery School',
  'A living mystery school built from rare archives, curated datasets, symbolic intelligence, and the evolving collaboration of Hakan Hisim + PRIME.',
  '/about',
)

export default function AboutPage() {
  return <AboutContent />
}
