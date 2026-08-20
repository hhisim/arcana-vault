'use client'

import dynamic from 'next/dynamic'
import { useSiteI18n } from '@/lib/site-i18n'
import ArchiveSaleCta from '@/components/ArchiveSaleCta'

const OraclePortal = dynamic(() => import('@/app/components/OraclePortal'), { ssr: false })

export default function ChatPage() {
  const { t } = useSiteI18n()

  return (
    <section className="mx-auto max-w-7xl px-6 py-8 pt-16">
      <ArchiveSaleCta
        placement="chat-top"
        compact
        title="20% Archive Sale"
        body="Before or after your oracle session, browse the source vaults behind the work: manifestation, grimoires, tarot, alchemy, sacred geometry, and more."
      />
      <OraclePortal />
    </section>
  )
}
