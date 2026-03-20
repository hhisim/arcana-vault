'use client'

import dynamic from 'next/dynamic'
import { useSiteI18n } from '@/lib/site-i18n'

const OraclePortal = dynamic(() => import('@/app/components/OraclePortal'), { ssr: false })

export default function ChatPage() {
  const { t } = useSiteI18n()

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <OraclePortal />
    </section>
  )
}
