import dynamic from 'next/dynamic'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata(
  'Oracle — Consult Sacred Traditions',
  'Consult the oracles of six sacred traditions — Tao, Tarot, Tantra, Entheogens, Sufism, and Dreamwalker — each a unique lens on the mystery school.',
  '/oracle',
)

const OraclePortal = dynamic(() => import('../components/OraclePortal'), { ssr: false })

export default function OraclePage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8 pt-16">
      <h1 className="sr-only">Oracle — Consult Sacred Traditions</h1>
      <OraclePortal />
    </section>
  )
}
