import type { Metadata } from 'next'
import FeaturesContent from './FeaturesContent'

export const metadata: Metadata = {
  title: 'Features · Vault of Arcana',
  description: 'Explore the features of the Vault of Arcana — a living mystery school built from rare archives, symbolic intelligence, and the collaboration of Hakan Hisim + PRIME.',
}

export default function FeaturesPage() {
  return <FeaturesContent />
}
