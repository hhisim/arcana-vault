import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata(
  'Redeem Access',
  'Private Vault of Arcana redemption flow.',
  '/redeem',
  { noIndex: true },
)

export default function RedeemLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
