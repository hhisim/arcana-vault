import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inquiry — Ask the Vault | Vault of Arcana',
  description: 'Ask a specific question to the Vault of Arcana. Inquire about traditions, practices, symbols, or any aspect of the mystery school.',
  alternates: {
    canonical: 'https://www.vaultofarcana.com/inquiry',
  },
}

export default function InquiryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
