import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Oracle Chat — Live Session | Vault of Arcana',
  description: 'Converse with the sacred oracles of Vault of Arcana. Each dialogue is a unique transmission between human consciousness and the mystery school.',
  alternates: {
    canonical: 'https://www.vaultofarcana.com/chat',
  },
  openGraph: {
    title: 'Oracle Chat | Vault of Arcana',
    description: 'Converse with the sacred oracles of four traditions.',
    url: 'https://www.vaultofarcana.com/chat',
    type: 'website',
  },
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
