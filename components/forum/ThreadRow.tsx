'use client'

import React from 'react'
import Link from 'next/link'

interface ThreadRowProps {
  id: string
  title: string
  authorName: string
  authorBadge?: string
  replyCount: number
  viewCount: number
  createdAt: string
  isPinned?: boolean
  isLocked?: boolean
  tags?: string[]
  categorySlug: string
  lastReplyBy?: string
  lastReplyAt?: string
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

export default function ThreadRow({
  id,
  title,
  authorName,
  replyCount,
  createdAt,
  isPinned,
  isLocked,
  tags,
  lastReplyBy,
  lastReplyAt,
  categorySlug,
}: ThreadRowProps) {
  return (
    <div className="group relative">
      <Link
        href={`/agora/${categorySlug}/${id}`}
        className="flex items-center gap-5 p-5 rounded-2xl transition-all duration-300
          bg-[rgba(18,18,26,0.6)] border border-[rgba(255,255,255,0.05)]
          hover:bg-[rgba(24,24,36,0.8)] hover:border-[rgba(255,255,255,0.1)]
          hover:shadow-[0_0_30px_rgba(123,94,167,0.08)]
          hover:-translate-x-0.5"
      >
        {/* Status icons */}
        <div className="flex flex-col items-center gap-2 shrink-0 w-8">
          {isPinned && (
            <span className="text-[#C9A84C]" title="Pinned">📌</span>
          )}
          {isLocked && (
            <span className="text-[#9B93AB]" title="Locked">🔒</span>
          )}
          {tags && tags.some(t => t.toLowerCase().includes('video')) && (
            <span className="text-[#7B5EA7]" title="Contains Video">🎬</span>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-2">
          <h3 className="text-lg font-medium text-[#E8E0F0] group-hover:text-[#C9A84C] transition-colors line-clamp-1 leading-snug">
            {title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#9B93AB]">
            <span className="font-bold text-[#C9A84C]/80">{authorName}</span>
            <span className="opacity-40">•</span>
            <span>{timeAgo(createdAt)}</span>
            {tags && tags.length > 0 && (
              <>
                <span className="opacity-40">•</span>
                <div className="flex gap-1.5">
                  {tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-[rgba(123,94,167,0.15)] text-[#7B5EA7] text-[10px] font-bold uppercase tracking-wider border border-[rgba(123,94,167,0.2)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-8 shrink-0">
          <div className="text-center min-w-[50px]">
            <div className="text-base font-bold text-[#E8E0F0]">{replyCount}</div>
            <div className="text-[9px] uppercase tracking-widest text-[#9B93AB]">Replies</div>
          </div>
          {lastReplyAt && (
            <div className="text-right min-w-[80px] hidden md:block">
              <div className="text-xs text-[#9B93AB]">{timeAgo(lastReplyAt)}</div>
              {lastReplyBy && (
                <div className="text-[10px] text-[#7B5EA7] font-medium truncate max-w-[80px]">{lastReplyBy}</div>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
