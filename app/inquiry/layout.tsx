import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata(
  'Inquiry — Ask the Vault',
  'Ask a specific question to the Vault of Arcana about traditions, practices, symbols, or any aspect of the mystery school.',
  '/inquiry',
)

export default function InquiryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
