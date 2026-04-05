'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { getBrowserSupabase } from '@/lib/supabase/client'
import { useSiteI18n } from '@/lib/site-i18n'
import { useAuth } from '@/components/auth/AuthProvider'
import PostCard from '@/components/forum/PostCard'
import ReplyForm from '@/components/forum/ReplyForm'

interface Reply {
  id: string
  content: string
  author_name: string
  author_id: string | null
  created_at: string
  upvotes: number
}

interface Post {
  id: string
  title: string
  content: string
  content_html?: string
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

export default function ThreadPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>
}) {
  const { category: categorySlug, id: threadId } = use(params)
  const [post, setPost] = useState<Post | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const { t, lang } = useSiteI18n()
  const { user } = useAuth()

  useEffect(() => {
    const fetchThread = async () => {
      const supabase = getBrowserSupabase()

      const [{ data: postData }, { data: repliesData }] = await Promise.all([
        supabase
          .from('forum_posts')
          .select('*')
          .eq('id', threadId)
          .eq('is_deleted', false)
          .single(),
        supabase
          .from('forum_replies')
          .select('*')
          .eq('post_id', threadId)
          .eq('is_deleted', false)
          .order('created_at', { ascending: true }),
      ])

      if (!postData) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setPost(postData as Post)
      setReplies((repliesData || []) as Reply[])

      // Increment view count
      if (postData) {
        await supabase
          .from('forum_posts')
          .update({ view_count: (postData.view_count || 0) + 1 })
          .eq('id', threadId)
      }

      setLoading(false)
    }

    fetchThread()
  }, [threadId])

  const handleReplyAdded = async () => {
    const supabase = getBrowserSupabase()
    const { data } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('post_id', threadId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })
    setReplies((data || []) as Reply[])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center py-24">
        <div className="voa-dots text-3xl text-[#C9A84C] mb-4">●●●</div>
        <p className="text-sm text-[#9B93AB] uppercase tracking-widest">{t('agora.thread.loading')}</p>
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center py-24">
        <p className="text-[#9B93AB] font-serif text-xl">{t('agora.thread.not_found')}</p>
        <Link href={`/agora/${categorySlug}`} className="mt-4 text-[#C9A84C] text-sm hover:underline">
          {t('agora.thread.return')}
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Header */}
      <section className="relative overflow-hidden py-12 px-6 border-b border-[rgba(255,255,255,0.05)]">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(123,94,167,0.04)] to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <Link
            href={`/agora/${categorySlug}`}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7B5EA7] hover:text-[#C9A84C] transition-colors mb-6"
          >
            ← {t('agora.thread.back')}
          </Link>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#5A5468] mb-4">
            <Link href="/agora" className="hover:text-[#9B93AB] transition-colors">{t('agora.hero.title')}</Link>
            <span>/</span>
            <span className="capitalize">{categorySlug}</span>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#9B93AB]">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#C9A84C]/20 to-[#7B5EA7]/20 border border-[rgba(201,168,76,0.3)] flex items-center justify-center">
                <span className="text-[8px] font-bold text-[#C9A84C]">
                  {post.author_name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                </span>
              </div>
              <span className="font-medium text-[#E8E0F0]">{post.author_name}</span>
            </div>
            <span>•</span>
            <span>{new Date(post.created_at).toLocaleDateString(lang === 'tr' ? 'tr-TR' : lang === 'ru' ? 'ru-RU' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>•</span>
            <span>{post.view_count} views</span>
            <span>•</span>
            <span>{replies.length} replies</span>
            {post.is_locked && (
              <>
                <span>•</span>
                <span className="text-[#9B93AB]/60">🔒 {t('agora.thread.locked')}</span>
              </>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mt-3">
              {post.tags.map((tag: string) => (
                <span key={tag} className="px-2.5 py-1 rounded-full bg-[rgba(123,94,167,0.12)] text-[#7B5EA7] text-[10px] font-bold uppercase tracking-wider border border-[rgba(123,94,167,0.15)]">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Original post */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <PostCard
          post={post}
          categorySlug={categorySlug}
          isOriginalPost={true}
          onReplyAdded={handleReplyAdded}
        />

        {/* Replies header */}
        {replies.length > 0 && (
          <div className="mt-10 mb-6">
            <h2 className="font-serif text-xl text-[#E8E0F0]">
              {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
            </h2>
            <div className="mt-2 h-px bg-gradient-to-r from-[rgba(201,168,76,0.2)] via-transparent to-transparent" />
          </div>
        )}

        {/* Replies */}
        <div className="space-y-4">
          {replies.map((reply) => (
            <PostCard
              key={reply.id}
              reply={reply}
              categorySlug={categorySlug}
              onReplyAdded={handleReplyAdded}
            />
          ))}
        </div>

        {/* Reply form */}
        {!post.is_locked && (
          <div className="mt-10">
            {user ? (
              <div className="glass-card rounded-3xl p-8 border border-[rgba(123,94,167,0.15)]">
                <h3 className="font-serif text-lg text-[#E8E0F0] mb-6">{t('agora.thread.add_reply')}</h3>
                <ReplyForm
                  postId={post.id}
                  onSuccess={handleReplyAdded}
                />
              </div>
            ) : (
              <div className="text-center py-10 glass-card rounded-3xl border border-[rgba(255,255,255,0.06)]">
                <p className="text-[#9B93AB] font-serif text-lg mb-4">{t('agora.thread.sign_in_to_reply')}</p>
                <Link
                  href="/login"
                  className="inline-block px-8 py-3 rounded-full bg-[#C9A84C] text-[#0A0A0F] font-bold text-sm hover:brightness-110 transition-all"
                >
                  {t('agora.cta.sign_in')}
                </Link>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
