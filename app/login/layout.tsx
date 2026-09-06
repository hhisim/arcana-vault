import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata(
  'Sign In',
  'Sign in to your private Vault of Arcana account.',
  '/login',
  { noIndex: true },
)

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
