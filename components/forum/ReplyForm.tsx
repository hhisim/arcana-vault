'use client'

import React, { useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'

interface ReplyFormProps {
  postId: string
  onReplyPosted?: (reply: any) => void
  onCancel?: () => void
  placeholder?: string
  autoFocus?: boolean
}

export default function ReplyForm({
  postId,
  onReplyPosted,
  onCancel,
  placeholder = 'Add your voice to this thread...',
  autoFocus = false,
}: ReplyFormProps) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !user) return

    setIsSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, content }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to post reply')
      }
      const reply = await res.json()
      setContent('')
      onReplyPosted?.(reply)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          rows={4}
          className="w-full rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]
            px-5 py-4 text-sm text-[#E8E0F0] placeholder:text-[#5A5468]
            focus:outline-none focus:border-[rgba(201,168,76,0.35)]
            resize-none transition-all leading-relaxed"
        />
        <div className="absolute bottom-3 right-3 text-[10px] text-[#5A5468]">
          {content.length}/2000
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-[#9B93AB]/60 italic">
          {user ? `Posting as ${user.user_metadata?.full_name || user.email?.split('@')[0] || 'Seeker'}` : 'Sign in to reply'}
        </div>
        <div className="flex gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] text-xs font-bold uppercase tracking-widest text-[#9B93AB] hover:text-[#E8E0F0] hover:border-[rgba(255,255,255,0.15)] transition-all"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-[#C9A84C] text-[#0A0A0F] text-xs font-bold uppercase tracking-widest
              hover:brightness-110 transition-all
              disabled:opacity-40 disabled:cursor-not-allowed
              shadow-[0_0_25px_rgba(201,168,76,0.2)]"
          >
            {isSubmitting ? 'Posting...' : 'Post Reply'}
          </button>
        </div>
      </div>
    </form>
  )
}
