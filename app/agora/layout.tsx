import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Agora — Community Wisdom | Vault of Arcana',
  description: 'The living archive of human-transmitted wisdom. Browse questions, practices, and transmissions from the Vault of Arcana community.',
  alternates: {
    canonical: 'https://www.vaultofarcana.com/agora',
  },
  openGraph: {
    title: 'Agora | Vault of Arcana',
    description: 'Community wisdom and practice transmissions.',
    url: 'https://www.vaultofarcana.com/agora',
    type: 'website',
  },
}

export default function AgoraLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
