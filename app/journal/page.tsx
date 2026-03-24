'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { getBrowserSupabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type LocalConversation = {
  id: string
  tradition: string
  mode: string
  title: string | null
  started_at: string
  last_message_at: string
  message_count: number
  is_starred: boolean
}

function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch { return fallback }
}

function lsGetConversations(): LocalConversation[] {
  return lsGet<LocalConversation[]>('arcana_guest_conversations', [])
}

type Conversation = {
  id: string
  title: string | null
  tradition: string
  mode: string | null
  summary: string | null
  started_at: string
  last_message_at: string
  message_count: number
  is_starred: boolean
  is_archived: boolean
  tags: string[] | null
  daily_type: string | null
  metadata: Record<string, any> | null
}

const TRADITION_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  tao:      { label: 'Tao Oracle',     icon: '☯',  color: '#4ECDC4' },
  tarot:    { label: 'Tarot Oracle',    icon: '🌟', color: '#7B5EA7' },
  tantra:   { label: 'Tantra Oracle',   icon: '🔮', color: '#E87EA1' },
  entheogen:{ label: 'Entheogen Oracle', icon: '🧬', color: '#2D5A4A' },
  sufi:     { label: 'Sufi Oracle',     icon: '🌀', color: '#D4A574' },
  dreamwalker:{ label: 'Dreamwalker',    icon: '🌙', color: '#5C8FE0' },
}

const MODE_LABELS: Record<string, string> = {
  oracle: 'Oracle', seeker: 'Seeker', shadow: 'Shadow',
  deepstudy: 'Deep Study', reading: 'Reading', pathwork: 'Pathwork',
  teacher: 'Teacher', historian: 'Historian',
}

const TRADITION_ICONS = ['☯', '🌟', '🔮', '🧬', '🌀', '🌙', '✨', '🔥']

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export default function JournalPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [traditionFilter, setTraditionFilter] = useState<string>('all')
  const [modeFilter, setModeFilter] = useState<string>('all')
  const [starredOnly, setStarredOnly] = useState(false)
  const [search, setSearch] = useState('')
  const [viewingConv, setViewingConv] = useState<Conversation | null>(null)
  const [convMessages, setConvMessages] = useState<any[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      // Load from localStorage for guests
      const localConvs = lsGetConversations().filter(c => !c.is_archived)
      setConversations(localConvs as unknown as Conversation[])
      setLoading(false)
      return
    }
    const load = async () => {
      try {
        const supabase = getBrowserSupabase()
        const res = await supabase
          .from('conversations')
          .select('*')
          .eq('is_archived', false)
          .order('last_message_at', { ascending: false })
          .limit(100)
        console.log('[Journal] Conversations query result:', res)
        if (res.data) {
          console.log('[Journal] Loaded', res.data.length, 'conversations')
          setConversations(res.data as Conversation[])
        }
        if (res.error) {
          console.error('[Journal] Conversations query error:', res.error)
        }
      } catch (e: any) {
        console.error('[Journal] Load failed:', e)
      } finally { setLoading(false) }
    }
    void load()
  }, [isAuthenticated])

  const filtered = conversations.filter(c => {
    if (starredOnly && !c.is_starred) return false
    if (traditionFilter !== 'all' && c.tradition !== traditionFilter) return false
    if (modeFilter !== 'all' && c.mode !== modeFilter) return false
    if (search) {
      const q = search.toLowerCase()
      const match = (c.title || '').toLowerCase().includes(q) ||
        (c.summary || '').toLowerCase().includes(q) ||
        c.tradition.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })

  const starred = filtered.filter(c => c.is_starred)
  const daily = filtered.filter(c => c.daily_type)
  const regular = filtered.filter(c => !c.is_starred && !c.daily_type)

  // Group by date
  const groups: { date: string; items: Conversation[] }[] = []
  const byDate: Record<string, Conversation[]> = {}
  filtered.forEach(c => {
    const d = formatDate(c.started_at)
    if (!byDate[d]) byDate[d] = []
    byDate[d].push(c)
  })
  Object.entries(byDate).forEach(([date, items]) => groups.push({ date, items }))

  // Load + open a conversation
  const openConversation = async (conv: Conversation) => {
    setViewingConv(conv)
    setLoadingMessages(true)
    try {
      const res = await fetch(`/api/conversations/${conv.id}/messages`)
      if (res.ok) {
        const msgs = await res.json()
        setConvMessages(msgs.reverse())
      }
    } catch {} finally { setLoadingMessages(false) }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-6">📓</div>
          <h1 className="font-cinzel text-3xl text-[#E8E0F0] mb-4">Practice Journal</h1>
          <p className="text-[#9B93AB] mb-8 leading-relaxed">
            Your practice history, starred sessions, and reflections — all in one place. Sign in to access your journal.
          </p>
          <Link href="/login" className="inline-block px-8 py-3.5 rounded-xl bg-[#C9A84C] text-[#0A0A0F] font-bold text-sm uppercase tracking-widest hover:bg-[#B1933E] transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  // Conversation viewer modal
  if (viewingConv) {
    const tInfo = TRADITION_LABELS[viewingConv.tradition] || { icon: '✨', label: viewingConv.tradition, color: '#9B93AB' }
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0] font-sans antialiased">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-white/8 bg-[#0A0A0F]/95 backdrop-blur-xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setViewingConv(null)} className="text-[#9B93AB] hover:text-[#E8E0F0] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span style={{ color: tInfo.color }}>{tInfo.icon}</span>
                <span className="font-cinzel text-sm" style={{ color: tInfo.color }}>{tInfo.label}</span>
                {viewingConv.mode && (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 text-[#5A5470]">
                    {MODE_LABELS[viewingConv.mode] || viewingConv.mode}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5A5470] mt-0.5">{formatDate(viewingConv.started_at)} · {viewingConv.message_count} messages</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {viewingConv.is_starred && <span className="text-[#C9A84C]">★</span>}
            <Link
              href={`/chat?conversation=${viewingConv.id}`}
              className="px-4 py-2 rounded-xl bg-[#C9A84C] text-[#0A0A0F] font-bold text-xs uppercase tracking-wider hover:bg-[#B1933E] transition-colors"
            >
              Continue →
            </Link>
          </div>
        </div>

        {/* Messages */}
        <div className="max-w-3xl mx-auto px-6 py-8">
          {viewingConv.title && (
            <div className="mb-8 text-center">
              <h1 className="font-cinzel text-xl text-[#E8E0F0] mb-2">{viewingConv.title}</h1>
              {viewingConv.summary && (
                <p className="text-sm text-[#6B6382] italic leading-relaxed">{viewingConv.summary}</p>
              )}
            </div>
          )}
          {loadingMessages ? (
            <div className="text-center py-20 text-[#5A5470]">Loading conversation…</div>
          ) : (
            <div className="space-y-4">
              {convMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                    msg.role === 'user'
                      ? 'bg-[#7B5EA7]/20 border border-[#7B5EA7]/30'
                      : msg.role === 'system'
                      ? 'bg-[#E05C5C]/10 border border-[#E05C5C]/20'
                      : 'bg-[#0f0f1a] border border-white/8'
                  }`}>
                    <div className="text-[10px] uppercase tracking-widest text-[#5A5470] mb-1.5">
                      {msg.role === 'user' ? 'You' : msg.role === 'system' ? 'System' : tInfo.label}
                    </div>
                    <p className="text-sm text-[#E8E0F0] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    {msg.metadata?.cards && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {msg.metadata.cards.map((card: string, ci: number) => (
                          <span key={ci} className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-[#9B93AB]">{card}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Link
              href={`/chat?conversation=${viewingConv.id}`}
              className="inline-block px-8 py-4 rounded-xl bg-[#C9A84C] text-[#0A0A0F] font-bold text-sm uppercase tracking-widest hover:bg-[#B1933E] transition-colors"
            >
              Continue This Conversation
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0] font-sans antialiased pb-20">
      {/* Hero */}
      <section className="border-b border-white/8 bg-gradient-to-b from-[#1a0f2e]/40 to-transparent">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="font-cinzel text-4xl text-[#E8E0F0] mb-3">Practice Journal</h1>
          <p className="text-[#9B93AB] text-sm">
            {conversations.length} session{conversations.length !== 1 ? 's' : ''} recorded
            {starred.length > 0 && ` · ${starred.length} starred`}
          </p>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        {loading ? (
          <div className="text-center py-20 text-[#5A5470]">Loading…</div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-6">📓</div>
            <h2 className="font-cinzel text-xl text-[#E8E0F0] mb-3">Your journal is empty</h2>
            <p className="text-[#6B6382] mb-8 max-w-sm mx-auto text-sm leading-relaxed">
              Start a session with any Oracle and it will appear here as part of your practice history.
            </p>
            <Link href="/chat" className="inline-block px-8 py-3.5 rounded-xl bg-[#C9A84C] text-[#0A0A0F] font-bold text-sm uppercase tracking-widest hover:bg-[#B1933E] transition-colors">
              Begin a Session
            </Link>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="space-y-3 mb-10">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search sessions…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-[#E8E0F0] placeholder:text-[#5A5470] focus:outline-none focus:border-[#7B5EA7]/50 transition-colors"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5470] hover:text-[#E8E0F0] text-xs">✕</button>
                )}
              </div>
              {/* Filter rows */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#5A5470] mr-1">Tradition:</span>
                {['all', 'tao', 'tarot', 'tantra', 'entheogen', 'sufi', 'dreamwalker'].map(f => (
                  <button key={f} onClick={() => setTraditionFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${traditionFilter === f ? 'bg-[#7B5EA7] text-white' : 'border border-white/10 text-[#9B93AB] hover:text-[#E8E0F0]'}`}>
                    {f === 'all' ? 'All' : (TRADITION_LABELS[f]?.icon + ' ' + f)}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#5A5470] mr-1">Mode:</span>
                {['all', 'oracle', 'seeker', 'shadow', 'reading', 'deepstudy', 'pathwork'].map(f => (
                  <button key={f} onClick={() => setModeFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${modeFilter === f ? 'bg-[#7B5EA7] text-white' : 'border border-white/10 text-[#9B93AB] hover:text-[#E8E0F0]'}`}>
                    {f === 'all' ? 'All' : (MODE_LABELS[f] || f)}
                  </button>
                ))}
                <button onClick={() => setStarredOnly(v => !v)}
                  className={`ml-auto px-3 py-1.5 rounded-full text-xs font-medium transition-all ${starredOnly ? 'bg-[#C9A84C] text-[#0A0A0F]' : 'border border-white/10 text-[#9B93AB] hover:text-[#E8E0F0]'}`}>
                  ★ Starred
                </button>
              </div>
            </div>

            {/* Results */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-[#5A5470]">
                No sessions match your filters.
                <button onClick={() => { setTraditionFilter('all'); setModeFilter('all'); setStarredOnly(false); setSearch('') }}
                  className="block mx-auto mt-2 text-xs text-[#7B5EA7] hover:underline">Clear filters</button>
              </div>
            ) : (
              <>
                {/* Starred first */}
                {starred.length > 0 && !starredOnly && (
                  <div className="mb-10">
                    <h2 className="font-cinzel text-xs uppercase tracking-widest text-[#C9A84C] mb-4">★ Starred</h2>
                    <div className="space-y-3">
                      {starred.map(conv => <ConvCard key={conv.id} conv={conv} onOpen={openConversation} onToggleStar={() => toggleStar(conv)} />)}
                    </div>
                  </div>
                )}

                {/* Daily sessions */}
                {daily.length > 0 && !starredOnly && (
                  <div className="mb-10">
                    <h2 className="font-cinzel text-xs uppercase tracking-widest text-[#5A5470] mb-4">Daily Practice</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {daily.map(conv => (
                        <button key={conv.id} onClick={() => openConversation(conv)}
                          className="flex flex-col items-center gap-1 p-3 rounded-xl border border-white/8 bg-[#0f0f1a] hover:border-[#7B5EA7]/30 transition-all text-center">
                          <span className="text-lg">{TRADITION_LABELS[conv.tradition]?.icon || '✨'}</span>
                          <span className="text-[10px] text-[#5A5470]">{formatDate(conv.started_at)}</span>
                          <span className="text-[9px] text-[#3A3550]">{conv.message_count}msg</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sessions by date */}
                {groups.map(group => (
                  <div key={group.date} className="mb-8">
                    {!starredOnly && <h2 className="font-cinzel text-xs uppercase tracking-widest text-[#5A5470] mb-4">{group.date}</h2>}
                    <div className="space-y-3">
                      {group.items.map(conv => <ConvCard key={conv.id} conv={conv} onOpen={openConversation} onToggleStar={() => toggleStar(conv)} />)}
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )

  function toggleStar(conv: Conversation) {
    const next = !conv.is_starred
    setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, is_starred: next } : c))
    if (isAuthenticated) {
      void getBrowserSupabase().from('conversations').update({ is_starred: next }).eq('id', conv.id)
    } else {
      const convs = lsGetConversations()
      const idx = convs.findIndex(c => c.id === conv.id)
      if (idx >= 0) { convs[idx].is_starred = next; localStorage.setItem('arcana_guest_conversations', JSON.stringify(convs)) }
    }
  }
}

function ConvCard({ conv, onOpen, onToggleStar }: { conv: Conversation; onOpen: (c: Conversation) => void; onToggleStar: () => void }) {
  const tInfo = TRADITION_LABELS[conv.tradition] || { icon: '✨', label: conv.tradition, color: '#9B93AB' }
  const dateStr = formatDate(conv.started_at)
  const timeStr = formatTime(conv.started_at)

  return (
    <div className="group flex items-start gap-4 p-5 rounded-2xl border border-white/8 bg-[#0f0f1a] hover:border-[#7B5EA7]/30 transition-all">
      <div
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg"
        style={{ backgroundColor: `${tInfo.color}18`, border: `1px solid ${tInfo.color}30` }}
      >
        {tInfo.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-medium" style={{ color: tInfo.color }}>{tInfo.label}</span>
          {conv.mode && (
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/10 text-[#5A5470]">
              {MODE_LABELS[conv.mode] || conv.mode}
            </span>
          )}
          {conv.daily_type && (
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#4ECDC4]/30 text-[#4ECDC4]">
              Daily
            </span>
          )}
        </div>
        <p className="text-sm text-[#E8E0F0] font-medium leading-snug">
          {conv.title || `${tInfo.label} Session`}
        </p>
        {conv.summary && (
          <p className="text-xs text-[#6B6382] mt-1 leading-relaxed line-clamp-2">{conv.summary}</p>
        )}
        <p className="text-[10px] text-[#3A3550] mt-1.5">
          {dateStr} at {timeStr} · {conv.message_count} message{conv.message_count !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <button onClick={onToggleStar}
          className={`text-lg transition-opacity ${conv.is_starred ? 'text-[#C9A84C]' : 'text-[#3A3550] opacity-0 group-hover:opacity-100'}`}
        >★</button>
        <button onClick={() => onOpen(conv)}
          className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-[#9B93AB] hover:text-[#E8E0F0] hover:border-white/20 transition-all opacity-0 group-hover:opacity-100">
          Open
        </button>
      </div>
    </div>
  )
}
