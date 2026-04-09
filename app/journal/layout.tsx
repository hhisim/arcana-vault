import type { Metadata } from 'next'
import JournalPage from './page'

export const metadata: Metadata = {
  title: 'Journal — Your Oracle Conversations',
  description: 'Browse all your conversations with the Oracle. Each dialogue is a unique transmission between human consciousness and the mystery school.',
  alternates: {
    canonical: 'https://www.vaultofarcana.com/journal',
  },
  openGraph: {
    title: 'Journal | Vault of Arcana',
    description: 'Browse all your conversations with the Oracle. Each dialogue is a unique transmission.',
    url: 'https://www.vaultofarcana.com/journal',
    type: 'website',
  },
}

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return <JournalPage />
}
