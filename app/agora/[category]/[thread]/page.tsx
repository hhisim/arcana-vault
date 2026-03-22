'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { getBrowserSupabase } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth/AuthProvider'
import PostCard from '@/components/forum/PostCard'
import ReplyForm from '@/components/forum/ReplyForm'

interface ThreadPost {
  id: string
  title: string
  content: string
  author_name: string
  author_id: string | null
  created_at: string
  upvotes: number
  reply_count: number
  view_count: number
  is_pinned: boolean
  is_locked: boolean
  tags: string[]
  category_slug: string
}

interface Reply {
  id: string
  content: string
  author_name: string
  author_id: string | null
  created_at: string
  upvotes: number
}

interface Category {
  slug: string
  name_en: string
  icon: string
}

export default function ThreadPage({
  params,
}: {
  params: Promise<{ category: string; thread: string }>
}) {
  const { category: categorySlug, thread: threadId } = use(params)
  const [thread, setThread] = useState<ThreadPost | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [replyTrigger, setReplyTrigger] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    const fetchThread = async () => {
      const supabase = getBrowserSupabase()

      // Fetch thread
      const { data: threadData, error } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('id', threadId)
        .eq('is_deleted', false)
        .single()

      if (error || !threadData) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setThread(threadData as ThreadPost)

      // Increment view count
      supabase
        .from('forum_posts')
        .update({ view_count: (threadData.view_count || 0) + 1 })
        .eq('id', threadId)
        .then(() => {})

      // Fetch category
      const { data: catData } = await supabase
        .from('forum_categories')
        .select('slug, name_en, icon')
        .eq('slug', categorySlug)
        .single()
      if (catData) setCategory(catData as Category)

      // Fetch replies
      const { data: replyData } = await supabase
        .from('forum_replies')
        .select('*')
        .eq('post_id', threadId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true })

      setReplies((replyData as Reply[]) || [])
      setLoading(false)
    }

    fetchThread()
  }, [threadId, categorySlug, replyTrigger])

  const handleReplyPosted = () => {
    setReplyTrigger((t) => t + 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center py-24">
        <div className="voa-dots text-3xl text-[#C9A84C] mb-4">●●●</div>
        <p className="text-sm text-[#9B93AB] uppercase tracking-widest">Loading Thread...</p>
      </div>
    )
  }

  if (notFound || !thread) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center py-24">
        <div className="text-5xl mb-4">🌀</div>
        <p className="font-serif text-xl text-[#9B93AB] mb-4">Thread not found or has been removed.</p>
        <Link href={`/agora/${categorySlug}`} className="text-[#C9A84C] text-sm hover:underline">
          ← Return to Category
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Header nav */}
      <section className="border-b border-[rgba(255,255,255,0.05)] px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4 text-sm">
          <Link
            href="/agora"
            className="text-xs font-bold uppercase tracking-widest text-[#7B5EA7] hover:text-[#C9A84C] transition-colors"
          >
            Agora
          </Link>
          <span className="text-[#5A5468]">/</span>
          <Link
            href={`/agora/${categorySlug}`}
            className="text-xs font-bold uppercase tracking-widest text-[#7B5EA7] hover:text-[#C9A84C] transition-colors flex items-center gap-1.5"
          >
            {category?.icon} {category?.name_en || categorySlug}
          </Link>
          <span className="text-[#5A5468]">/</span>
          <span className="text-[#9B93AB] truncate max-w-[200px]">{thread.title}</span>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Original post */}
        <PostCard
          post={thread}
          categorySlug={categorySlug}
          isOriginalPost
          onReplyAdded={handleReplyPosted}
        />

        {/* Reply count header */}
        {replies.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.05)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#9B93AB]">
              {replies.length} {replies.length === 1 ? 'Response' : 'Responses'}
            </span>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.05)]" />
          </div>
        )}

        {/* Replies */}
        <div className="space-y-5">
          {replies.map((reply) => (
            <PostCard
              key={reply.id}
              reply={reply}
              categorySlug={categorySlug}
            />
          ))}
        </div>

        {/* Empty replies state */}
        {replies.length === 0 && !thread.is_locked && (
          <div className="text-center py-12 glass-card rounded-2xl border border-[rgba(255,255,255,0.05)]">
            <p className="text-[#9B93AB] italic font-serif text-lg">
              No responses yet. Be the first to add your voice.
            </p>
          </div>
        )}

        {/* Reply form */}
        {user && !thread.is_locked && (
          <div id="reply" className="glass-card rounded-3xl p-8 border border-[rgba(255,255,255,0.08)] shadow-[0_0_60px_rgba(0,0,0,0.3)]">
            <h3 className="font-serif text-xl text-[#E8E0F0] mb-6">Add Your Response</h3>
            <ReplyForm
              postId={thread.id}
              onReplyPosted={(reply) => {
                setReplies([...replies, reply])
                handleReplyPosted()
              }}
            />
          </div>
        )}

        {thread.is_locked && (
          <div className="text-center py-8 glass-card rounded-2xl border border-[rgba(255,255,255,0.05)] flex items-center justify-center gap-3 text-[#9B93AB]">
            <span>🔒</span>
            <span className="text-sm font-bold uppercase tracking-widest">This thread is locked</span>
          </div>
        )}

        {!user && (
          <div className="text-center py-8 glass-card rounded-2xl border border-[rgba(255,255,255,0.05)]">
            <p className="text-[#9B93AB] mb-4 text-sm">
              Sign in to join this conversation.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-2.5 rounded-full bg-[#C9A84C] text-[#0A0A0F] font-bold text-sm"
            >
              Sign In
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
