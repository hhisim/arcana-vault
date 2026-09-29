import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata(
  'Claim the Free Tao Oracle Pack',
  'Create a free Vault of Arcana account to claim the 3GB Taoist archive plus 30 days of Seeker access. No card, no purchase.',
  '/redeem/tao',
  { noIndex: true },
)

export default function RedeemTaoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
