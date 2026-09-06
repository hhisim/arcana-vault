import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata(
  'Account',
  'Manage your private Vault of Arcana account.',
  '/account',
  { noIndex: true },
)

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
