'use client'

import { useEffect, useState } from 'react'
import ProductCard from '@/components/shop/ProductCard'
import { PACKS } from '@/lib/packs'
import { orderArchivePacks } from '@/lib/pack-ordering'

export default function ArchiveGrid() {
  // Deterministic first render avoids hydration drift; each visit then shuffles.
  const [packs, setPacks] = useState(() => orderArchivePacks(PACKS, () => 0.999999))
  useEffect(() => {
    setPacks(orderArchivePacks(PACKS))
    const reshuffleOnRestore = (event: PageTransitionEvent) => {
      if (event.persisted) setPacks(orderArchivePacks(PACKS))
    }
    window.addEventListener('pageshow', reshuffleOnRestore)
    return () => window.removeEventListener('pageshow', reshuffleOnRestore)
  }, [])

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {packs.map(pack => <ProductCard key={pack.sku} pack={pack} />)}
    </div>
  )
}
