'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getBrowserSupabase } from '@/lib/supabase/client'
import { useSiteI18n } from '@/lib/site-i18n'

interface ThreadPreview {
  id: string
  title: string
  category_slug: string
  author_name: string
  reply_count: number
  view_count: number
  created_at: string
  icon?: string
}

const CATEGORY_ICONS: Record<string, string> = {
  general: '🔥',
  tarot: '🎴',
  sufism: '🌀',
  tao: '☯',
  tantra: '🔥',
  entheogens: '🧬',
  dreamwork: '🌙',
  codex: '✦',
  help: '💬',
  gnosticism: '✦',
  alchemy: '⚗',
  kabbalah: '🌳',
  hermeticism: '☿',
  chaos: '⚡',
}

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  en: {
    general: 'General', tarot: 'Tarot', sufism: 'Sufism', tao: 'Tao',
    tantra: 'Tantra', entheogens: 'Entheogens', dreamwork: 'Dreamwork',
    codex: 'Codex', help: 'Help', gnosticism: 'Gnosticism',
    alchemy: 'Alchemy', kabbalah: 'Kabbalah', hermeticism: 'Hermeticism', chaos: 'Chaos',
  },
  tr: {
    general: 'Genel', tarot: 'Tarot', sufism: 'Sufizm', tao: 'Tao',
    tantra: 'Tantra', entheogens: 'Enteyojenler', dreamwork: 'Rüya',
    codex: 'Codex', help: 'Yardım', gnosticism: 'Gnostisizm',
    alchemy: 'Simya', kabbalah: 'Kabbalah', hermeticism: 'Hermesçilik', chaos: 'Kaos',
  },
  ru: {
    general: 'Общее', tarot: 'Таро', sufism: 'Суфизм', tao: 'Дао',
    tantra: 'Тантра', entheogens: 'Энтеогены', dreamwork: 'Сновидения',
    codex: 'Кодекс', help: 'Помощь', gnosticism: 'Гностицизм',
    alchemy: 'Алхимия', kabbalah: 'Каббала', hermeticism: 'Герметизм', chaos: 'Хаос',
  },
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (d > 0) return `${d}d ago`
  if (h > 0) return `${h}h ago`
  return 'just now'
}

export default function LiveAgoraFeed() {
  const [threads, setThreads] = useState<ThreadPreview[]>([])
  const [loading, setLoading] = useState(true)
  const { lang } = useSiteI18n()

  useEffect(() => {
    const fetchThreads = async () => {
      const supabase = getBrowserSupabase()
      const { data } = await supabase
        .from('forum_posts')
        .select('id, title, category_slug, author_name, reply_count, view_count, created_at')
        .eq('is_deleted', false)
        .order('last_reply_at', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(5)

      if (data) {
        setThreads(data as ThreadPreview[])
      }
      setLoading(false)
    }
    fetchThreads()
  }, [])

  const getLabel = (slug: string) => {
    const labels = CATEGORY_LABELS[lang] || CATEGORY_LABELS.en
    return labels[slug] || slug
  }

  const getIcon = (slug: string) => CATEGORY_ICONS[slug] || '✦'

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="voa-dots text-xl text-gold">●●●</div>
      </div>
    )
  }

  if (threads.length === 0) {
    return (
      <div className="rounded-2xl border border-white/6 bg-card/50 p-6 text-center">
        <p className="text-sm italic text-text-secondary">
          The Agora awaits its first voices.{' '}
          <Link href="/agora" className="text-gold hover:underline">Be the first →</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {threads.map((thread) => (
        <Link
          key={thread.id}
          href={`/agora/${thread.category_slug}`}
          className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:border-gold/30 hover:bg-white/[0.06]"
        >
          <span className="mt-0.5 text-base">{getIcon(thread.category_slug)}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-widest text-gold/70">
                {getLabel(thread.category_slug)}
              </span>
              <span className="text-[10px] text-text-secondary/50">·</span>
              <span className="text-[10px] text-text-secondary/50">
                {timeAgo(thread.created_at)}
              </span>
            </div>
            <p className="text-sm font-medium text-text-primary leading-snug group-hover:text-gold transition-colors line-clamp-2">
              {thread.title}
            </p>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-text-secondary/60">
              <span>by {thread.author_name}</span>
              <span>💬 {thread.reply_count}</span>
              <span>👁 {thread.view_count}</span>
            </div>
          </div>
        </Link>
      ))}
      <Link
        href="/agora"
        className="block text-center text-xs uppercase tracking-widest text-gold/70 hover:text-gold transition-colors pt-2"
      >
        Enter the Agora →
      </Link>
    </div>
  )
}
