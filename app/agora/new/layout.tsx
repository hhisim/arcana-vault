import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata(
  'Create a Transmission',
  'Submit a question, practice, or wisdom transmission to the Vault of Arcana Agora.',
  '/agora/new',
  { noIndex: true },
)

export default function AgoraNewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
