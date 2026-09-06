import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata(
  'Create Your Account',
  'Create a free private Vault of Arcana account.',
  '/signup',
  { noIndex: true },
)

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
