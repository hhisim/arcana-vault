import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata(
  'Redeem Etsy Access',
  'Private Vault of Arcana redemption flow.',
  '/redeem/etsy',
  { noIndex: true },
)

export default function RedeemEtsyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
