import { buildMetadata } from '@/lib/seo'
import CorrespondenceEngine from '@/app/components/CorrespondenceEngine'
import CorrespondenceGuide from '@/components/correspondence/CorrespondenceGuide'

export const metadata = buildMetadata(
  'Correspondence Engine · Classic',
  'Explore the original Vault of Arcana correspondence engine.',
  '/correspondence-engine/classic',
)

export default function Page({ searchParams }: { searchParams?: { entry?: string | string[] } }) {
  const requested = typeof searchParams?.entry === 'string' ? searchParams.entry : ''
  const initialSlug = /^[a-z0-9-]+$/.test(requested) ? requested : 'venus'
  return <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10"><CorrespondenceGuide /><CorrespondenceEngine initialSlug={initialSlug} /></section>
}
