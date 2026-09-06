import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata(
  'Purchase Complete',
  'Private Vault of Arcana purchase confirmation.',
  '/shop/thanks',
  { noIndex: true },
)

export default function ShopThanksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
