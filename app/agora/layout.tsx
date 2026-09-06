import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata(
  'Agora — Community Wisdom',
  'The living archive of human-transmitted wisdom. Browse questions, practices, and transmissions from the Vault of Arcana community.',
  '/agora',
)

export default function AgoraLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
