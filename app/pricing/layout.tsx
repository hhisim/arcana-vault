import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — Membership Plans | Vault of Arcana',
  description: 'Join the Vault of Arcana. Membership plans from free Seeker access to Adept+ with full Oracle access, sacred texts, and community.',
  alternates: {
    canonical: 'https://www.vaultofarcana.com/pricing',
  },
  openGraph: {
    title: 'Pricing | Vault of Arcana',
    description: 'Membership plans for the Vault of Arcana mystery school.',
    url: 'https://www.vaultofarcana.com/pricing',
    type: 'website',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
