'use client'

import { useState } from 'react'
import { useSiteI18n } from '@/lib/site-i18n'
import { TRADITIONS, TraditionId } from '@/lib/plans'

interface Props {
  selected: TraditionId[]
  onChange: (selected: TraditionId[]) => void
  max: number | 'all'
}

export default function TraditionPicker({ selected, onChange, max }: Props) {
  const { t } = useSiteI18n()
  const toggle = (id: TraditionId) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else if (max === 'all' || selected.length < max) {
      onChange([...selected, id])
    }
  }
  return (
    <div className="space-y-3">
      <div className="text-sm text-[var(--text-secondary)]">
        {max === 'all' ? t('traditionsPicker.all') : t('traditionsPicker.count').replace('{n}', String(max))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {TRADITIONS.map((id) => {
          const active = selected.includes(id)
          const disabled = !active && max !== 'all' && selected.length >= max
          return (
            <button
              key={id}
              type="button"
              disabled={disabled}
              onClick={() => toggle(id)}
              className={`rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                active
                  ? 'border-[var(--primary-gold)] bg-[var(--primary-gold)]/10 text-[var(--primary-gold)]'
                  : disabled
                  ? 'border-white/5 text-white/20 cursor-not-allowed'
                  : 'border-white/10 text-[var(--text-secondary)] hover:border-white/30 hover:text-white'
              }`}
            >
              <div className="capitalize font-medium">{id}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
