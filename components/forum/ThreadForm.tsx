'use client'

import React, { useState } from 'react'
import { getBrowserSupabase } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth/AuthProvider'
import { useSiteI18n } from '@/lib/site-i18n'

interface Category {
  slug: string
  name_en: string
  name_tr: string
  name_ru: string
  icon: string
}

interface ThreadFormProps {
  defaultCategory?: string
  onSuccess?: (thread: any) => void
  onCancel?: () => void
}

export default function ThreadForm({ defaultCategory = '', onSuccess, onCancel }: ThreadFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState('')
  const { t } = useSiteI18n()
  const [content, setContent] = useState('')
  const [categorySlug, setCategorySlug] = useState(defaultCategory)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = getBrowserSupabase()
      const { data } = await supabase
        .from('forum_categories')
        .select('slug, name_en, name_tr, name_ru, icon')
        .eq('is_active', true)
        .order('sort_order')
      if (data) setCategories(data)
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !categorySlug || !user) return

    setIsSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/forum/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_slug: categorySlug,
          title,
          content,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create thread')
      }
      const thread = await res.json()
      setTitle('')
      setContent('')
      setTags('')
      onSuccess?.(thread)
      router.push(`/agora/${categorySlug}/${thread.id}`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Category selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-[#9B93AB]">
          Category
        </label>
        <div className="relative">
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            required
            className="w-full appearance-none rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]
              px-5 py-3.5 text-sm text-[#E8E0F0]
              focus:outline-none focus:border-[rgba(201,168,76,0.35)]
              transition-all cursor-pointer"
          >
            <option value="">Select a category...</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.icon} {cat.name_en}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#9B93AB]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-[#9B93AB]">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What is the transmission?"
          maxLength={200}
          required
          className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]
            px-5 py-3.5 text-sm text-[#E8E0F0] placeholder:text-[#5A5468]
            focus:outline-none focus:border-[rgba(201,168,76,0.35)]
            transition-all"
        />
        <div className="text-right text-[10px] text-[#5A5468]">{title.length}/200</div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-[#9B93AB]">
          Body
        </label>
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your inquiry, reflection, or discovery..."
            rows={8}
            maxLength={5000}
            required
            className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]
              px-5 py-4 text-sm text-[#E8E0F0] placeholder:text-[#5A5468]
              focus:outline-none focus:border-[rgba(201,168,76,0.35)]
              resize-none transition-all leading-relaxed"
          />
          <div className="absolute bottom-3 right-4 text-[10px] text-[#5A5468]">
            {content.length}/5000
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-[#9B93AB]">
          Tags <span className="normal-case font-normal opacity-60">(optional, comma separated)</span>
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="tao, wu-wei, consciousness..."
          className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]
            px-5 py-3.5 text-sm text-[#E8E0F0] placeholder:text-[#5A5468]
            focus:outline-none focus:border-[rgba(201,168,76,0.35)]
            transition-all"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-[#9B93AB]/60 italic">
          {user ? `Posting as ${user.user_metadata?.full_name || user.email?.split('@')[0] || 'Seeker'}` : 'Sign in to post'}
        </div>
        <div className="flex gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-xl border border-[rgba(255,255,255,0.08)] text-xs font-bold uppercase tracking-widest text-[#9B93AB] hover:text-[#E8E0F0] hover:border-[rgba(255,255,255,0.15)] transition-all"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={!title.trim() || !content.trim() || !categorySlug || isSubmitting}
            className="px-8 py-3 rounded-xl bg-[#C9A84C] text-[#0A0A0F] text-xs font-bold uppercase tracking-widest
              hover:brightness-110 transition-all
              disabled:opacity-40 disabled:cursor-not-allowed
              shadow-[0_0_30px_rgba(201,168,76,0.2)]"
          >
            {isSubmitting ? 'Opening Thread...' : 'Open Thread'}
          </button>
        </div>
      </div>
    </form>
  )
}
