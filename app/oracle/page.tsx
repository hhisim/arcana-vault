import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'Oracle — Consult Sacred Traditions | Vault of Arcana',
  description: 'Consult the oracles of four sacred traditions. Tao. Tarot. Tantra. Entheogens. Each a unique lens on the mystery school.',
  alternates: {
    canonical: 'https://www.vaultofarcana.com/oracle',
  },
  openGraph: {
    title: 'Oracle | Vault of Arcana',
    description: 'Consult the oracles of four sacred traditions.',
    url: 'https://www.vaultofarcana.com/oracle',
    type: 'website',
  },
}

const OraclePortal = dynamic(() => import('../components/OraclePortal'), { ssr: false })

export default function OraclePage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8 pt-16">
      <OraclePortal />
    </section>
  )
}
