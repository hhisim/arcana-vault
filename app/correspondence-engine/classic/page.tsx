import { buildMetadata } from '@/lib/seo'
import CorrespondenceEngine from '@/app/components/CorrespondenceEngine'
import CorrespondenceGuide from '@/components/correspondence/CorrespondenceGuide'

export const metadata = buildMetadata(
  'Correspondence Engine · Classic',
  'Explore the original Vault of Arcana correspondence engine.',
  '/correspondence-engine/classic',
)

export default function Page() {
  return <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10"><CorrespondenceGuide /><CorrespondenceEngine initialSlug="venus" /></section>
}
