export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { traditions } from '@/lib/tradition-config'
import TraditionDetailContent from './TraditionDetailContent'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const { liveTraditions, upcomingTraditions, horizonTraditions } = await import('@/lib/tradition-config')
  return [...liveTraditions, ...upcomingTraditions, ...horizonTraditions].map((t) => ({
    slug: t.slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const tradition = traditions[slug]
  if (!tradition) return { title: 'Tradition Not Found' }
  return {
    title: `${tradition.name} — Vault of Arcana`,
    description: tradition.description,
  }
}

export default async function TraditionPage({ params }: Props) {
  const { slug } = await params
  const tradition = traditions[slug]
  if (!tradition) notFound()
  return <TraditionDetailContent tradition={tradition} />
}
