'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { getBrowserSupabase } from '@/lib/supabase/client'
import { useSiteI18n } from '@/lib/site-i18n'
import { useAuth } from '@/components/auth/AuthProvider'
import ThreadRow from '@/components/forum/ThreadRow'
import ThreadForm from '@/components/forum/ThreadForm'

interface Category {
  slug: string
  name_en: string
  name_tr: string
  name_ru: string
  description_en: string
  description_tr: string
  description_ru: string
  icon: string
}

interface Thread {
  id: string
  title: string
  content: string
  author_name: string
  author_id: string | null
  reply_count: number
  view_count: number
  created_at: string
  last_reply_at: string | null
  last_reply_by: string | null
  is_pinned: boolean
  is_locked: boolean
  tags: string[]
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: categorySlug } = use(params)
  const [category, setCategory] = useState<Category | null>(null)
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [showNewThread, setShowNewThread] = useState(false)
  const limit = 20
  const { t, lang } = useSiteI18n()
  const { user } = useAuth()

  const getName = (cat: Category) =>
    lang === 'tr' ? cat.name_tr : lang === 'ru' ? cat.name_ru : cat.name_en

  const getDesc = (cat: Category) =>
    lang === 'tr' ? cat.description_tr : lang === 'ru' ? cat.description_ru : cat.description_en

  useEffect(() => {
    const fetchData = async () => {
      const supabase = getBrowserSupabase()

      const [{ data: catData }, { data: threadData, count }] = await Promise.all([
        supabase.from('forum_categories').select('*').eq('slug', categorySlug).single(),
        supabase
          .from('forum_posts')
          .select('*', { count: 'exact' })
          .eq('category_slug', categorySlug)
          .eq('is_deleted', false)
          .order('is_pinned', { ascending: false })
          .order('last_reply_at', { ascending: false })
          .order('created_at', { ascending: false })
          .range((page - 1) * limit, page * limit - 1),
      ])

      if (catData) setCategory(catData)
      if (threadData) {
        setThreads(threadData as Thread[])
        setTotal(count || 0)
      }
      setLoading(false)
    }
    fetchData()
  }, [categorySlug, page])

  const totalPages = Math.ceil(total / limit)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center py-24">
        <div className="voa-dots text-3xl text-[#C9A84C] mb-4">●●●</div>
        <p className="text-sm text-[#9B93AB] uppercase tracking-widest">{t('agora.category.loading')}</p>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center py-24">
        <p className="text-[#9B93AB] font-serif text-xl">{t('agora.category.not_found')}</p>
        <Link href="/agora" className="mt-4 text-[#C9A84C] text-sm hover:underline">
          {t('agora.category.return')}
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Header */}
      <section className="relative overflow-hidden py-16 px-6 border-b border-[rgba(255,255,255,0.05)]">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(123,94,167,0.04)] to-transparent" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <Link
            href="/agora"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7B5EA7] hover:text-[#C9A84C] transition-colors mb-8"
          >
            {t('agora.category.back')}
          </Link>
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="text-4xl mb-3">{category.icon}</div>
              <h1 className="font-serif text-4xl md:text-5xl text-[#E8E0F0] mb-3">
                {getName(category)}
              </h1>
              <p className="text-[#9B93AB] max-w-lg leading-relaxed">
                {getDesc(category)}
              </p>
            </div>
            {user && !showNewThread && (
              <button
                onClick={() => setShowNewThread(true)}
                className="shrink-0 px-8 py-3.5 rounded-full bg-[#C9A84C] text-[#0A0A0F] font-bold text-sm shadow-[0_0_40px_rgba(201,168,76,0.2)] hover:brightness-110 transition-all"
              >
                ✦ {t('agora.category.new_thread')}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-6">
        {/* New thread form */}
        {showNewThread && (
          <div className="glass-card rounded-3xl p-8 border border-[rgba(201,168,76,0.15)] shadow-[0_0_60px_rgba(201,168,76,0.05)] animate-fade-in-up">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl text-[#E8E0F0]">{t('agora.category.open_thread')}</h2>
              <button
                onClick={() => setShowNewThread(false)}
                className="text-[#9B93AB] hover:text-[#E8E0F0] transition-colors text-sm font-bold uppercase tracking-widest"
              >
                {t('agora.category.cancel')}
              </button>
            </div>
            <ThreadForm
              defaultCategory={categorySlug}
              onSuccess={(thread) => {
                setThreads([thread, ...threads])
                setShowNewThread(false)
              }}
              onCancel={() => setShowNewThread(false)}
            />
          </div>
        )}

        {/* Thread list */}
        {threads.length === 0 && !showNewThread ? (
          <div className="text-center py-24 glass-card rounded-3xl border border-[rgba(255,255,255,0.06)]">
            <div className="text-5xl mb-4">🌌</div>
            <p className="font-serif text-xl text-[#9B93AB] italic mb-2">
              {t('agora.category.empty_title')}
            </p>
            <p className="text-sm text-[#5A5468]">
              {t('agora.category.empty_body')}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {threads.map((thread) => (
                <ThreadRow
                  key={thread.id}
                  id={thread.id}
                  title={thread.title}
                  authorName={thread.author_name}
                  replyCount={thread.reply_count}
                  viewCount={thread.view_count}
                  createdAt={thread.created_at}
                  isPinned={thread.is_pinned}
                  isLocked={thread.is_locked}
                  tags={thread.tags}
                  categorySlug={categorySlug}
                  lastReplyBy={thread.last_reply_by || undefined}
                  lastReplyAt={thread.last_reply_at || undefined}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-5 py-2 rounded-xl border border-[rgba(255,255,255,0.08)] text-xs font-bold uppercase tracking-widest text-[#9B93AB] hover:text-[#E8E0F0] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {t('agora.pagination.prev')}
                </button>
                <div className="flex items-center gap-2 text-xs text-[#9B93AB]">
                  {t('agora.pagination.page_of', { page, total: totalPages })}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-5 py-2 rounded-xl border border-[rgba(255,255,255,0.08)] text-xs font-bold uppercase tracking-widest text-[#9B93AB] hover:text-[#E8E0F0] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {t('agora.pagination.next')}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
