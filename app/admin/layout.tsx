import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata(
  'Admin',
  'Private Vault of Arcana administration.',
  '/admin',
  { noIndex: true },
)

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
