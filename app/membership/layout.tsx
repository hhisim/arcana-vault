import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata(
  'Membership',
  'Manage your private Vault of Arcana membership and selected traditions.',
  '/membership',
  { noIndex: true },
)

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
