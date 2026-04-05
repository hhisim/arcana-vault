'use client'

import React, { useState, useEffect } from 'react'
import { getBrowserSupabase } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth/AuthProvider'
import { useSiteI18n } from '@/lib/site-i18n'

function YouTubeEmbed({ content }: { content: string }) {
  const YOUTUBE_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})[^\s<]*/gi
  const urls: string[] = []
  let match
  while ((match = YOUTUBE_REGEX.exec(content)) !== null) {
    urls.push(match[0])
  }
  if (urls.length === 0) return null
  return (
    <div className="my-4 space-y-3">
      {urls.slice(0, 2).map((url, i) => {
        const idMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
        if (!idMatch) return null
        const videoId = idMatch[1]
        return (
          <div key={i} className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: '16/9', maxHeight: '50vh' }}>
            <iframe
              key={i}
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
              title={`Video ${i + 1}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
            />
          </div>
        )
      })}
    </div>
  )
}

interface PostCardProps {
  post?: {
    id: string
    title: string
    content: string
    author_name: string
    author_id?: string
    created_at: string
    upvotes: number
    reply_count: number
    view_count: number
    is_pinned?: boolean
    is_locked?: boolean
    tags?: string[]
  }
  reply?: {
    id: string
    content: string
    author_name: string
    author_id?: string
    created_at: string
    upvotes: number
  }
  depth?: number
  isOriginalPost?: boolean
  categorySlug: string
  onReplyAdded?: () => void
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString()
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function PostCard({
  post,
  reply,
  depth = 0,
  isOriginalPost = false,
  categorySlug,
  onReplyAdded,
}: PostCardProps) {
  const { user } = useAuth()
  const { t } = useSiteI18n()
  const supabase = getBrowserSupabase()

  const [hasUpvoted, setHasUpvoted] = useState(false)
  const [upvoteCount, setUpvoteCount] = useState(post?.upvotes ?? reply?.upvotes ?? 0)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [reactionsLoaded, setReactionsLoaded] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const targetId = post?.id || reply?.id
  const targetType = post ? 'post' : 'reply'
  const content = post?.content || reply?.content || ''
  const contentHtml = (post as any)?.content_html || (reply as any)?.content_html
  const authorName = post?.author_name || reply?.author_name || 'Seeker'
  const createdAt = post?.created_at || reply?.created_at || new Date().toISOString()

  useEffect(() => {
    if (!targetId) return
    const fetchReactionData = async () => {
      // Fetch total upvote count and user's reaction in parallel
      const [countResult, userResult] = await Promise.all([
        supabase
          .from('forum_reactions')
          .select('id', { count: 'exact', head: true })
          .eq(targetType === 'post' ? 'post_id' : 'reply_id', targetId)
          .eq('reaction_type', 'upvote'),
        user ? supabase
          .from('forum_reactions')
          .select('id')
          .eq('user_id', user.id)
          .eq(targetType === 'post' ? 'post_id' : 'reply_id', targetId)
          .maybeSingle() : Promise.resolve({ data: null }),
      ])
      if (countResult.count !== null) setUpvoteCount(countResult.count)
      if (userResult.data) setHasUpvoted(true)
      setReactionsLoaded(true)
    }
    fetchReactionData()
  }, [user, targetId, targetType])

  const handleUpvote = async () => {
    if (!user) return
    setHasUpvoted(!hasUpvoted)
    setUpvoteCount((c) => (hasUpvoted ? c - 1 : c + 1))
    await fetch('/api/forum/upvotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        post_id: targetType === 'post' ? targetId : undefined,
        reply_id: targetType === 'reply' ? targetId : undefined,
        type: 'upvote',
      }),
    })
  }

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !user || !post) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: post.id, content: replyText }),
      })
      if (res.ok) {
        setReplyText('')
        setShowReplyForm(false)
        onReplyAdded?.()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLocked = post?.is_locked
  const indentClass = depth === 1 ? 'ml-8' : depth === 2 ? 'ml-14' : ''

  return (
    <div className={`relative ${indentClass}`}>
      {/* Connector line for nested */}
      {depth > 0 && (
        <div className="absolute -left-6 top-0 bottom-1/2 w-4 border-l border-[rgba(255,255,255,0.06)] border-b border-b-[rgba(255,255,255,0.04)] rounded-bl-lg" />
      )}

      <div className={`
        rounded-2xl overflow-hidden transition-all duration-300
        ${isOriginalPost
          ? 'bg-gradient-to-br from-[rgba(22,22,34,0.98)] to-[rgba(14,14,22,0.95)] border border-[rgba(201,168,76,0.15)] shadow-[0_0_60px_rgba(201,168,76,0.05)]'
          : 'bg-[rgba(18,18,26,0.6)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.1)]'
        }
      `}>
        {post?.is_pinned && (
          <div className="px-5 pt-3 flex items-center gap-2 text-xs text-[#C9A84C] font-bold uppercase tracking-widest">
            📌 {t('agora.thread.pinned')}
          </div>
        )}

        {/* Author header */}
        <div className="flex items-center gap-4 px-6 py-5">
          {/* Avatar */}
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#C9A84C]/20 to-[#7B5EA7]/20 border border-[rgba(201,168,76,0.3)] flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-[#C9A84C] font-serif">
              {getInitials(authorName)}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-medium text-[#E8E0F0] text-sm">{authorName}</span>
              <span className="text-xs text-[#9B93AB]">•</span>
              <span className="text-xs text-[#9B93AB]">{timeAgo(createdAt)}</span>
              {post?.view_count !== undefined && (
                <>
                  <span className="text-xs text-[#9B93AB]">•</span>
                  <span className="text-xs text-[#9B93AB]">{t('agora.thread.views', { count: post.view_count })}</span>
                </>
              )}
            </div>
            {post?.tags && post.tags.length > 0 && (
              <div className="flex gap-1.5 mt-1.5">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-[rgba(123,94,167,0.12)] text-[#7B5EA7] text-[9px] font-bold uppercase tracking-wider border border-[rgba(123,94,167,0.15)]">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Upvote */}
          <button
            onClick={handleUpvote}
            disabled={!user}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all
              ${hasUpvoted
                ? 'bg-[rgba(201,168,76,0.15)] text-[#C9A84C] border border-[rgba(201,168,76,0.3)]'
                : 'bg-[rgba(255,255,255,0.04)] text-[#9B93AB] border border-[rgba(255,255,255,0.08)] hover:text-[#C9A84C] hover:border-[rgba(201,168,76,0.2)]'
              }
              ${!user ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <svg className="w-3.5 h-3.5" fill={hasUpvoted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            {upvoteCount}
          </button>
        </div>

        {/* Title for original post */}
        {isOriginalPost && post?.title && (
          <div className="px-6 pb-4">
            <h1 className="text-2xl md:text-3xl font-serif text-[#E8E0F0] leading-snug">
              {post.title}
            </h1>
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-5">
          {contentHtml ? (
            <div
              className="text-sm leading-relaxed text-[#C8C0D8] [&_iframe]:rounded-xl [&_iframe]:w-full [&_iframe]:max-w-full"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          ) : (
            <div className="text-sm leading-relaxed text-[#C8C0D8] whitespace-pre-wrap">
              {content}
            </div>
          )}
          <YouTubeEmbed content={content} />
        </div>

        {/* Actions */}
        <div className="px-6 pb-4 flex items-center gap-4 border-t border-[rgba(255,255,255,0.04)] pt-4">
          {user && !isLocked && post && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs font-bold uppercase tracking-widest text-[#9B93AB] hover:text-[#C9A84C] transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              {t('agora.thread.reply')}
            </button>
          )}
          {isLocked && (
            <span className="text-xs font-bold uppercase tracking-widest text-[#9B93AB]/60 flex items-center gap-1.5">
              🔒 {t('agora.thread.locked')}
            </span>
          )}
          {!user && (
            <span className="text-xs text-[#9B93AB]/60 italic">{t('agora.thread.sign_in_to_reply')}</span>
          )}
        </div>

        {/* Inline reply form */}
        {showReplyForm && (
          <div className="px-6 pb-5 space-y-3 animate-fade-in-up">
            <div className="flex gap-3">
              <div className="flex-1">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Add your voice to this thread..."
                  className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[#E8E0F0] placeholder:text-[#5A5468] focus:outline-none focus:border-[rgba(201,168,76,0.3)] resize-none transition-colors"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowReplyForm(false); setReplyText('') }}
                className="px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] text-xs font-bold uppercase tracking-widest text-[#9B93AB] hover:text-[#E8E0F0] transition-colors"
              >
                {t('agora.category.cancel')}
              </button>
              <button
                onClick={handleSubmitReply}
                disabled={!replyText.trim() || isSubmitting}
                className="px-5 py-2 rounded-lg bg-[#C9A84C] text-[#0A0A0F] text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(201,168,76,0.15)]"
              >
                {isSubmitting ? t('agora.thread.posting') : t('agora.thread.post_reply')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
