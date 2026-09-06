import { buildMetadata } from '@/lib/seo'
import FeaturesContent from './FeaturesContent'

export const metadata = buildMetadata(
  'Features',
  'Explore the features of the Vault of Arcana — a living mystery school built from rare archives, symbolic intelligence, and the collaboration of Hakan Hisim + PRIME.',
  '/features',
)

export default function FeaturesPage() {
  return <FeaturesContent />
}
