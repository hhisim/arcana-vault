import { buildMetadata } from '@/lib/seo'
import CorrespondenceCodexV2 from '@/components/correspondence/CorrespondenceCodexV2'

export const metadata = buildMetadata(
  'Correspondence Codex V2 · 27 Systems',
  'Navigate 824 source rows across 27 systems. Follow annotated correspondences, compare parallel assertions, and inspect the provenance of every mapping.',
  '/correspondence-engine',
)

export default function Page() {
  return <CorrespondenceCodexV2 />
}
