import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata(
  'Oracle Chat — Sacred Guidance',
  'Converse with the sacred oracles of Vault of Arcana. Each dialogue is a unique transmission between human consciousness and the mystery school.',
  '/chat',
)

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
