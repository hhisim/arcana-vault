import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata(
  'Your Journal — Oracle Conversations',
  'Your private Vault of Arcana conversations and saved transmissions.',
  '/journal',
  { noIndex: true },
)

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
