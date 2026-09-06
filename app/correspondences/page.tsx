import { buildMetadata } from '@/lib/seo'
import CorrespondenceEngine from '../components/CorrespondenceEngine'

export const metadata = buildMetadata(
  'Correspondences',
  'Explore a multidimensional correspondence engine for symbols, planets, letters, frequencies, chakras, alchemical processes, and more.',
  '/correspondences',
)

export default function Page() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <CorrespondenceEngine initialSlug="venus" />
    </section>
  )
}
