'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DailyEntry } from '@/lib/daily-content'

const TRADITIONS = [
  {
    key: 'tao',
    emoji: '☯️',
    label: 'Tao',
    cta: 'Receive the full teaching →',
    href: '/chat?tradition=tao&mode=oracle',
    accent: '#C9A84C',
  },
  {
    key: 'tarot',
    emoji: '🎴',
    label: 'Tarot',
    cta: 'Draw your card →',
    href: '/chat?tradition=tarot&mode=reading',
    accent: '#9B93AB',
  },
  {
    key: 'tantra',
    emoji: '🔥',
    label: 'Tantra',
    cta: 'Begin the meditation →',
    href: '/chat?tradition=tantra&mode=dharana',
    accent: '#E8722A',
  },
  {
    key: 'entheogen',
    emoji: '🍄',
    label: 'Entheogen',
    cta: 'Enter the reflection →',
    href: '/chat?tradition=entheogen&mode=guide',
    accent: '#4ECDC4',
  },
]

function SkeletonCard({ accent }: { accent: string }) {
  return (
    <div className="rounded-3xl border border-white/8 bg-card/80 p-6 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: `${accent}20` }} />
        <div className="h-3 w-20 rounded" style={{ backgroundColor: `${accent}15` }} />
      </div>
      <div className="h-5 w-3/4 rounded mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
      <div className="space-y-2 mb-6">
        <div className="h-3 w-full rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
        <div className="h-3 w-5/6 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
      </div>
      <div className="h-8 w-32 rounded-xl" style={{ backgroundColor: `${accent}15` }} />
    </div>
  )
}

function DailyCard({
  tradition,
  entry,
}: {
  tradition: (typeof TRADITIONS)[number]
  entry: DailyEntry
}) {
  return (
    <div
      className="rounded-3xl border border-white/8 bg-card/80 p-6 flex flex-col gap-4 transition-all duration-300 hover:border-white/15 hover:bg-card/90"
      style={{ boxShadow: `0 0 0 0 ${tradition.accent}00` }}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
          style={{ backgroundColor: `${tradition.accent}18`, border: `1px solid ${tradition.accent}30` }}
        >
          {tradition.emoji}
        </div>
        <p className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: tradition.accent }}>
          {tradition.label}
        </p>
      </div>

      <h3 className="font-serif text-xl text-text-primary leading-tight">
        {entry.title}
      </h3>

      <p className="text-sm leading-6 text-text-secondary italic">
        {entry.teaser}
      </p>

      <Link
        href={tradition.href}
        className="mt-auto inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-medium transition-all hover:opacity-90"
        style={{
          backgroundColor: `${tradition.accent}18`,
          border: `1px solid ${tradition.accent}35`,
          color: tradition.accent,
        }}
      >
        {tradition.cta}
      </Link>
    </div>
  )
}

export default function DailyPractice() {
  const [entries, setEntries] = useState<Record<string, DailyEntry> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/daily')
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.entries ?? {})
        setLoading(false)
      })
      .catch(() => {
        setEntries({})
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {TRADITIONS.map((t) => (
          <SkeletonCard key={t.key} accent={t.accent} />
        ))}
      </div>
    )
  }

  if (!entries || Object.keys(entries).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary text-sm italic">
          Daily practices arrive at midnight. Check back soon.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {TRADITIONS.map((tradition) => {
        const entry = entries[tradition.key]
        if (!entry) return null
        return <DailyCard key={tradition.key} tradition={tradition} entry={entry} />
      })}
    </div>
  )
}
