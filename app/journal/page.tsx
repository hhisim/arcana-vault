'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { getBrowserSupabase } from '@/lib/supabase/client'
import { useLang } from '@/lib/lang-context'
import { SITEDICT } from '@/lib/dictionary'
import CrossRefPanel from '@/components/CrossRefPanel'
import type { ChatMessage } from '@/lib/oracle-ui'

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
  tao:         { label: 'Tao Oracle',         icon: '☯',  color: '#4ECDC4' },
  tarot:       { label: 'Tarot Oracle',        icon: '🌟', color: '#7B5EA7' },
  tantra:      { label: 'Tantra Oracle',       icon: '🔮', color: '#E87EA1' },
  entheogen:   { label: 'Entheogen Oracle',    icon: '🧬', color: '#2D5A4A' },
  sufi:        { label: 'Sufi Oracle',         icon: '🌀', color: '#D4A574' },
  dreamwalker: { label: 'Dreamwalker',          icon: '🌙', color: '#5C8FE0' },
  'chaos-magick': { label: 'Paradigm Hacker',  icon: '✴',  color: '#E83E8C' },
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
  const { isAuthenticated, user, loading: authLoading } = useAuth()
  const { t } = useLang()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [traditionFilter, setTraditionFilter] = useState<string>('all')
  const [modeFilter, setModeFilter] = useState<string>('all')
  const [starredOnly, setStarredOnly] = useState(false)
  const [search, setSearch] = useState('')
  const [viewingConv, setViewingConv] = useState<Conversation | null>(null)
  const [convMessages, setConvMessages] = useState<any[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [expandedQAs, setExpandedQAs] = useState<Set<number>>(new Set())
  const [rightPanelTab, setRightPanelTab] = useState<'messages' | 'crossref'>('messages')

  useEffect(() => {
    // Wait for auth to fully resolve before loading conversations.
    // isAuthenticated can be true while user is still null on first load
    // due to async /api/account/me call in AuthProvider.
    if (authLoading) return
    if (!isAuthenticated) {
      const localConvs = lsGetConversations().filter(c => !c.is_archived)
      setConversations(localConvs as unknown as Conversation[])
      setLoading(false)
      return
    }
    if (!user) {
      // isAuthenticated is true but user not yet populated — stay in loading
      // state and let the re-render when user resolves trigger the fetch.
      return
    }
    const load = async () => {
      try {
        const supabase = getBrowserSupabase()
        const res = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_archived', false)
          .order('last_message_at', { ascending: false })
          .limit(100)
        if (res.data) setConversations(res.data as Conversation[])
        if (res.error) console.error('[Journal] Conversations query error:', res.error)
      } catch (e: any) {
        console.error('[Journal] Load failed:', e)
      } finally { setLoading(false) }
    }
    void load()
  }, [isAuthenticated, user, authLoading])

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
        const raw = await res.json()
        // Map 'assistant' → 'oracle' for CrossRefPanel compatibility
        const mapped: ChatMessage[] = raw.map((m: any) => ({
          id: m.id,
          role: m.role === 'assistant' ? 'oracle' : m.role as 'user' | 'oracle' | 'system',
          text: m.content,
        }))
        setConvMessages(mapped.reverse())
      }
    } catch {} finally { setLoadingMessages(false) }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0] flex items-center justify-center px-6 pt-20">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">📓</div>
          <p className="text-[#5A5470] text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0] flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-md pt-20">
          <div className="text-5xl mb-6">📓</div>
          <h1 className="font-cinzel text-3xl text-[#E8E0F0] mb-4">{t(SITEDICT.nav.journal.guest_title)}</h1>
          <p className="text-[#9B93AB] mb-8 leading-relaxed">
            {t(SITEDICT.nav.journal.guest_body)}
          </p>
          <Link href="/login" className="inline-block px-8 py-3.5 rounded-xl bg-[#C9A84C] text-[#0A0A0F] font-bold text-sm uppercase tracking-widest hover:bg-[#B1933E] transition-colors">
            {t(SITEDICT.nav.journal.sign_in)}
          </Link>
        </div>
      </div>
    )
  }

  // Conversation viewer modal
  if (viewingConv) {
    const tInfo = TRADITION_LABELS[viewingConv.tradition] || { icon: '✨', label: viewingConv.tradition, color: '#9B93AB' }
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0] font-sans antialiased pt-20">
        {/* Sticky filter bar */}
        <div className="sticky top-20 z-10 border-b border-white/8 bg-[#0A0A0F]/95 backdrop-blur-xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => { setViewingConv(null); setRightPanelTab('messages') }} className="text-[#9B93AB] hover:text-[#E8E0F0] transition-colors">
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
              <p className="text-xs text-[#5A5470] mt-0.5">{formatDate(viewingConv.started_at)} · {viewingConv.message_count} {t(SITEDICT.nav.journal.messages_count)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {viewingConv.is_starred && <span className="text-[#C9A84C]">★</span>}
            <Link
              href={`/chat?conversation=${viewingConv.id}`}
              className="px-4 py-2 rounded-xl bg-[#C9A84C] text-[#0A0A0F] font-bold text-xs uppercase tracking-wider hover:bg-[#B1933E] transition-colors"
            >
              {t(SITEDICT.nav.journal.continue_btn)}
            </Link>
          </div>
        </div>

        {/* Tab bar */}
        <div className="sticky top-[72px] z-10 border-b border-white/8 bg-[#0A0A0F]/90 backdrop-blur-xl px-6 flex items-center gap-0">
          <button
            onClick={() => setRightPanelTab('messages')}
            className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
              rightPanelTab === 'messages'
                ? 'border-[#C9A84C] text-[#C9A84C]'
                : 'border-transparent text-[#5A5470] hover:text-[#9B93AB]'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setRightPanelTab('crossref')}
            className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
              rightPanelTab === 'crossref'
                ? 'border-[#C9A84C] text-[#C9A84C]'
                : 'border-transparent text-[#5A5470] hover:text-[#9B93AB]'
            }`}
          >
            Cross References
          </button>
        </div>

        {/* Split content */}
        <div className="flex h-[calc(100vh-144px)]">
          {/* Left: Messages */}
          <div className={`flex-1 overflow-y-auto px-6 py-8 ${rightPanelTab === 'crossref' ? 'hidden md:block' : ''}`}>
            <div className="max-w-3xl mx-auto">
              {viewingConv.title && (
                <div className="mb-8 text-center">
                  <h1 className="font-cinzel text-xl text-[#E8E0F0] mb-2">{viewingConv.title}</h1>
                  {viewingConv.summary && (
                    <p className="text-sm text-[#6B6382] italic leading-relaxed">{viewingConv.summary}</p>
                  )}
                </div>
              )}
              {loadingMessages ? (
                <div className="text-center py-20 text-[#5A5470]">{t(SITEDICT.nav.journal.loading_conv)}</div>
              ) : (
                <div className="space-y-4">
                  {convMessages.map((msg, i) => {
                    if (msg.role === 'user') {
                      const answer = convMessages[i + 1]
                      const qaIndex = i
                      const isExpanded = expandedQAs.has(qaIndex)
                      return (
                        <div key={i} className="rounded-2xl border transition-all" style={{ borderColor: isExpanded ? tInfo.color + '60' : 'rgba(255,255,255,0.08)', backgroundColor: isExpanded ? tInfo.color + '08' : '#0f0f1a' }}>
                          <button
                            className="w-full text-left px-5 py-4 flex items-start gap-3"
                            onClick={() => {
                              setExpandedQAs(prev => {
                                const next = new Set(prev)
                                if (next.has(qaIndex)) next.delete(qaIndex)
                                else next.add(qaIndex)
                                return next
                              })
                            }}
                          >
                            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#7B5EA7]/20 border border-[#7B5EA7]/30 flex items-center justify-center text-xs text-[#7B5EA7] mt-0.5">Q</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-[#9B93AB] mb-1 line-clamp-2">{msg.content}</div>
                              {answer && !isExpanded && (
                                <div className="text-[10px] text-[#3A3550] mt-1">Tap to expand answer →</div>
                              )}
                            </div>
                            <span className="flex-shrink-0 text-[#5A5470] text-sm mt-0.5 transition-transform" style={{ transform: isExpanded ? 'rotate(90deg)' : 'none' }}>›</span>
                          </button>
                          {isExpanded && answer && (
                            <div className="px-5 pb-5 pt-0 border-t" style={{ borderColor: tInfo.color + '30' }}>
                              <div className="pt-4 space-y-3">
                                <div className="flex items-start gap-3">
                                  <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs mt-0.5" style={{ backgroundColor: tInfo.color + '18', border: `1px solid ${tInfo.color}30`, color: tInfo.color }}>
                                    {answer.role === 'system' ? '◆' : 'A'}
                                  </span>
                                  <p className="text-sm text-[#E8E0F0] leading-relaxed whitespace-pre-wrap flex-1">{answer.content}</p>
                                </div>
                                {answer.metadata?.cards && (
                                  <div className="flex flex-wrap gap-1 ml-10">
                                    {answer.metadata.cards.map((card: string, ci: number) => (
                                      <span key={ci} className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-[#9B93AB]">{card}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              )}
              <div className="mt-10 text-center">
                <Link
                  href={`/chat?conversation=${viewingConv.id}`}
                  className="inline-block px-8 py-4 rounded-xl bg-[#C9A84C] text-[#0A0A0F] font-bold text-sm uppercase tracking-widest hover:bg-[#B1933E] transition-colors"
                >
                  {t(SITEDICT.nav.journal.continue_conv)}
                </Link>
              </div>
            </div>
          </div>

          {/* Right: CrossRefPanel */}
          <div className={`w-full md:w-[380px] border-l border-white/8 overflow-hidden flex-shrink-0 ${rightPanelTab === 'crossref' ? '' : 'hidden md:block'}`}>
            <CrossRefPanel
              messages={convMessages.map(m => ({ role: m.role, text: m.content }))}
              indexReady={!loadingMessages && convMessages.length > 0}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0] font-sans antialiased pt-16 pb-20">
      {/* Hero */}
      <section className="border-b border-white/8 bg-gradient-to-b from-[#1a0f2e]/40 to-transparent">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="font-cinzel text-4xl text-[#E8E0F0] mb-3">{t(SITEDICT.nav.journal.title)}</h1>
          <p className="text-[#9B93AB] text-sm">
            {conversations.length} session{conversations.length !== 1 ? 's' : ''} recorded
            {starred.length > 0 && ` · ${starred.length} starred`}
          </p>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        {loading ? (
          <div className="text-center py-20 text-[#5A5470]">{t(SITEDICT.nav.journal.loading)}</div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-6">📓</div>
            <h2 className="font-cinzel text-xl text-[#E8E0F0] mb-3">{t(SITEDICT.nav.journal.empty_title)}</h2>
            <p className="text-[#6B6382] mb-8 max-w-sm mx-auto text-sm leading-relaxed">
              {t(SITEDICT.nav.journal.empty_body)}
            </p>
            <Link href="/chat" className="inline-block px-8 py-3.5 rounded-xl bg-[#C9A84C] text-[#0A0A0F] font-bold text-sm uppercase tracking-widest hover:bg-[#B1933E] transition-colors">
              {t(SITEDICT.nav.journal.begin_session)}
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
                  placeholder={t(SITEDICT.nav.journal.search_placeholder)}
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
                <span className="text-[10px] uppercase tracking-widest text-[#5A5470] mr-1">{t(SITEDICT.nav.journal.filter_tradition)}</span>
                {['all', ...Object.keys(TRADITION_LABELS)].map(f => (
                  <button key={f} onClick={() => setTraditionFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${traditionFilter === f ? 'bg-[#7B5EA7] text-white' : 'border border-white/10 text-[#9B93AB] hover:text-[#E8E0F0]'}`}>
                    {f === 'all' ? t(SITEDICT.nav.journal.filter_all) : (TRADITION_LABELS[f] ? TRADITION_LABELS[f].icon + ' ' + f : f)}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#5A5470] mr-1">{t(SITEDICT.nav.journal.filter_mode)}</span>
                {['all', 'oracle', 'seeker', 'shadow', 'reading', 'deepstudy', 'pathwork'].map(f => (
                  <button key={f} onClick={() => setModeFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${modeFilter === f ? 'bg-[#7B5EA7] text-white' : 'border border-white/10 text-[#9B93AB] hover:text-[#E8E0F0]'}`}>
                    {f === 'all' ? t(SITEDICT.nav.journal.filter_all) : (MODE_LABELS[f] || f)}
                  </button>
                ))}
                <button onClick={() => setStarredOnly(v => !v)}
                  className={`ml-auto px-3 py-1.5 rounded-full text-xs font-medium transition-all ${starredOnly ? 'bg-[#C9A84C] text-[#0A0A0F]' : 'border border-white/10 text-[#9B93AB] hover:text-[#E8E0F0]'}`}>
                  {t(SITEDICT.nav.journal.filter_starred)}
                </button>
              </div>
            </div>

            {/* Results */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-[#5A5470]">
                {t(SITEDICT.nav.journal.no_results)}
                <button onClick={() => { setTraditionFilter('all'); setModeFilter('all'); setStarredOnly(false); setSearch('') }}
                  className="block mx-auto mt-2 text-xs text-[#7B5EA7] hover:underline">{t(SITEDICT.nav.journal.clear_filters)}</button>
              </div>
            ) : (
              <>
                {/* Starred first */}
                {starred.length > 0 && !starredOnly && (
                  <div className="mb-10">
                    <h2 className="font-cinzel text-xs uppercase tracking-widest text-[#C9A84C] mb-4">{t(SITEDICT.nav.journal.starred_label)}</h2>
                    <div className="space-y-3">
                      {starred.map(conv => <ConvCard key={conv.id} conv={conv} onOpen={openConversation} onToggleStar={() => toggleStar(conv)} t={t} />)}
                    </div>
                  </div>
                )}

                {/* Daily sessions */}
                {daily.length > 0 && !starredOnly && (
                  <div className="mb-10">
                    <h2 className="font-cinzel text-xs uppercase tracking-widest text-[#5A5470] mb-4">{t(SITEDICT.nav.journal.daily_label)}</h2>
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
                      {group.items.map(conv => <ConvCard key={conv.id} conv={conv} onOpen={openConversation} onToggleStar={() => toggleStar(conv)} t={t} />)}
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

function ConvCard({ conv, onOpen, onToggleStar, t }: { conv: Conversation; onOpen: (c: Conversation) => void; onToggleStar: () => void; t: ReturnType<typeof useLang> }) {
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
              {t(SITEDICT.nav.journal.daily_label)}
            </span>
          )}
        </div>
        <p className="text-sm text-[#E8E0F0] font-medium leading-snug">
          {conv.title || `${tInfo.label} ${t(SITEDICT.nav.journal.session_label)}`}
        </p>
        {conv.summary && (
          <p className="text-xs text-[#6B6382] mt-1 leading-relaxed line-clamp-2">{conv.summary}</p>
        )}
        <p className="text-[10px] text-[#3A3550] mt-1.5">
          {dateStr} at {timeStr} · {conv.message_count} {t(SITEDICT.nav.journal.messages_count)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <button onClick={onToggleStar}
          className={`text-lg transition-opacity ${conv.is_starred ? 'text-[#C9A84C]' : 'text-[#3A3550] opacity-0 group-hover:opacity-100'}`}
        >★</button>
        <button onClick={() => onOpen(conv)}
          className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-[#9B93AB] hover:text-[#E8E0F0] hover:border-white/20 transition-all opacity-0 group-hover:opacity-100">
          {t(SITEDICT.nav.journal.open_btn)}
        </button>
      </div>
    </div>
  )
}
