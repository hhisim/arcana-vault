import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata(
  'Pricing — Membership Plans',
  'Join the Vault of Arcana. Membership plans range from free Seeker access to Adept+ with Oracle access, sacred texts, and community.',
  '/pricing',
)

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
