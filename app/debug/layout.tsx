import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata(
  'Debug',
  'Private Vault of Arcana diagnostics.',
  '/debug',
  { noIndex: true },
)

export default function DebugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
