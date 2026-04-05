'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useSiteI18n } from '@/lib/site-i18n'
import { useAuth } from '@/components/auth/AuthProvider'
import PostCard from '@/components/forum/PostCard'

interface Thread {
  id: string
  title: string
  content: string
  content_html?: string
  author_name: string
  author_id?: string
  reply_count: number
  view_count: number
  created_at: string
  is_pinned: boolean
  is_locked: boolean
  tags: string[]
  upvotes: number
  category_slug: string
}

interface Reply {
  id: string
  content: string
  content_html?: string
  author_name: string
  author_id?: string
  created_at: string
  upvotes: number
}

export default function ThreadPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>
}) {
  const { category: categorySlug, id: threadId } = use(params)
  const [thread, setThread] = useState<Thread | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t, lang } = useSiteI18n()
  const { user } = useAuth()

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const res = await fetch(`/api/forum/threads/${threadId}`)
        if (res.status === 404) {
          setNotFound(true)
          return
        }
        if (!res.ok) throw new Error('Failed to load thread')

        const data = await res.json()
        setThread(data.thread)
        setReplies(data.replies || [])
      } catch (err) {
        console.error('[ThreadPage]', err)
        setError('Could not load this thread.')
      } finally {
        setLoading(false)
      }
    }
    fetchThread()
  }, [threadId])

  const handleReplyAdded = () => {
    // Refresh thread and replies
    fetch(`/api/forum/threads/${threadId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.thread) setThread(data.thread)
        if (data.replies) setReplies(data.replies)
      })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center py-24">
        <div className="voa-dots text-3xl text-[#C9A84C] mb-4">●●●</div>
        <p className="text-sm text-[#9B93AB] uppercase tracking-widest">{t('agora.thread.loading')}</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center py-24">
        <div className="text-5xl mb-4">🌌</div>
        <p className="text-[#9B93AB] font-serif text-xl mb-4">{t('agora.thread.not_found')}</p>
        <Link href={`/agora`} className="text-[#C9A84C] text-sm hover:underline">
          ← {t('agora.thread.return')}
        </Link>
      </div>
    )
  }

  if (error || !thread) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center py-24">
        <div className="text-4xl mb-4 text-red-400/60">⚠</div>
        <p className="text-[#9B93AB] font-serif text-lg mb-4">{error || 'Unknown error'}</p>
        <Link href={`/agora/${categorySlug}`} className="text-[#C9A84C] text-sm hover:underline">
          ← {t('agora.thread.return')}
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
            href={`/agora/${categorySlug}`}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7B5EA7] hover:text-[#C9A84C] transition-colors mb-8"
          >
            ← {t('agora.thread.back')}
          </Link>

          <div className="flex items-center gap-3 text-xs text-[#9B93AB] mb-4 flex-wrap">
            <span className="text-[#C9A84C] font-bold capitalize">{categorySlug}</span>
            <span className="opacity-40">•</span>
            <span>{thread.view_count} views</span>
            <span className="opacity-40">•</span>
            <span>{thread.reply_count} replies</span>
          </div>

          <h1 className="font-serif text-3xl md:text-5xl text-[#E8E0F0] mb-4 leading-tight">
            {thread.title}
          </h1>

          {thread.tags && thread.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {thread.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-[rgba(123,94,167,0.12)] text-[#7B5EA7] text-[10px] font-bold uppercase tracking-wider border border-[rgba(123,94,167,0.2)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Original post + replies */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="space-y-6">
          {/* Original post */}
          <PostCard
            post={{
              id: thread.id,
              title: thread.title,
              content: thread.content,
              content_html: thread.content_html,
              author_name: thread.author_name,
              author_id: thread.author_id,
              created_at: thread.created_at,
              upvotes: thread.upvotes,
              reply_count: thread.reply_count,
              view_count: thread.view_count,
              is_pinned: thread.is_pinned,
              is_locked: thread.is_locked,
              tags: thread.tags,
            }}
            isOriginalPost={true}
            categorySlug={categorySlug}
            onReplyAdded={handleReplyAdded}
          />

          {/* Replies header */}
          {replies.length > 0 && (
            <div className="flex items-center gap-4 pt-4 pb-2">
              <div className="text-xs font-bold uppercase tracking-widest text-[#9B93AB]">
                {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
              </div>
              <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
            </div>
          )}

          {/* Reply list */}
          {replies.map((reply) => (
            <PostCard
              key={reply.id}
              reply={{
                id: reply.id,
                content: reply.content,
                content_html: reply.content_html,
                author_name: reply.author_name,
                author_id: reply.author_id,
                created_at: reply.created_at,
                upvotes: reply.upvotes,
              }}
              categorySlug={categorySlug}
              onReplyAdded={handleReplyAdded}
            />
          ))}

          {/* Empty replies state */}
          {replies.length === 0 && (
            <div className="text-center py-12 rounded-2xl bg-[rgba(18,18,26,0.4)] border border-[rgba(255,255,255,0.04)]">
              <p className="text-[#9B93AB] text-sm italic">
                No replies yet. Be the first to add your voice.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
