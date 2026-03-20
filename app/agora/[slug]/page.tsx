'use client'

import React, { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { getBrowserSupabase } from '@/lib/supabase/client'
import { useSiteI18n } from '@/lib/site-i18n'
import { useAuth } from '@/components/auth/AuthProvider'

interface Post {
  id: string
  title: string
  author_name: string
  reply_count: number
  view_count: number
  created_at: string
}

interface Category {
  slug: string
  name_en: string
  name_tr: string
  name_ru: string
}

export default function CategoryPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = use(paramsPromise)
  const [posts, setPosts] = useState<Post[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const { lang } = useSiteI18n()
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      const supabase = getBrowserSupabase()
      
      const { data: catData } = await supabase.from('forum_categories').select('*').eq('slug', params.slug).single()
      if (catData) setCategory(catData)

      const { data: postData } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('category_slug', params.slug)
        .order('created_at', { ascending: false })
      
      if (postData) setPosts(postData)
      setLoading(false)
    }
    fetchData()
  }, [params.slug])

  const createPost = async () => {
    if (!user || !newTitle || !newContent) return
    const supabase = getBrowserSupabase()
    const { data, error } = await supabase.from('forum_posts').insert({
      category_slug: params.slug,
      author_id: user.id,
      author_name: (user as any).user_metadata?.full_name || 'Seeker',
      title: newTitle,
      content: newContent
    }).select().single()

    if (data) {
      setPosts([data, ...posts])
      setNewTitle('')
      setNewContent('')
      setIsCreating(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-[#0A0A0F] py-20 text-center text-[#9B93AB]">Loading the Archives...</div>
  if (!category) return <div className="min-h-screen bg-[#0A0A0F] py-20 text-center">Category not found</div>

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 space-y-10">
      <div className="flex items-center justify-between gap-6">
        <div className="space-y-2">
          <Link href="/forum" className="text-xs uppercase font-bold tracking-[0.2em] text-[var(--primary-purple)]">← The Agora</Link>
          <h1 className="font-serif text-4xl text-[var(--text-primary)]">
            {lang === 'tr' ? category.name_tr : lang === 'ru' ? category.name_ru : category.name_en}
          </h1>
        </div>
        {user && !isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="rounded-full bg-[var(--primary-gold)] px-6 py-3 text-black font-bold text-sm shadow-[0_0_30px_rgba(201,168,76,0.2)]"
          >
            New Archive
          </button>
        )}
      </div>

      {isCreating && (
        <div className="glass-card p-8 rounded-3xl space-y-4 animate-fade-in-up">
          <h2 className="text-lg font-serif text-[var(--text-primary)]">New Discussion</h2>
          <input 
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 outline-none" 
            placeholder="Title" 
            value={newTitle} 
            onChange={(e) => setNewTitle(e.target.value)} 
          />
          <textarea 
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none h-40 resize-none" 
            placeholder="What is the transmission?" 
            value={newContent} 
            onChange={(e) => setNewContent(e.target.value)} 
          />
          <div className="flex gap-3">
            <button onClick={createPost} className="rounded-full bg-[var(--primary-gold)] px-6 py-3 text-black font-bold text-sm">Post Transmission</button>
            <button onClick={() => setIsCreating(false)} className="rounded-full border border-white/10 px-6 py-3 text-[var(--text-primary)] text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="py-20 text-center text-[#9B93AB] glass-card rounded-3xl italic">The silence here is waiting to be broken.</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="glass-card p-6 rounded-2xl flex items-center justify-between hover:shadow-[0_0_20px_rgba(255,255,255,0.02)] transition-all">
              <div className="space-y-1">
                <h3 className="text-xl font-medium text-[var(--text-primary)] line-clamp-1">{post.title}</h3>
                <div className="flex items-center gap-3 text-xs text-[#9B93AB]">
                  <span className="font-bold text-[var(--primary-gold)]">{post.author_name}</span>
                  <span>•</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-[var(--text-primary)]">{post.reply_count}</div>
                  <div className="text-[10px] uppercase tracking-widest text-[#9B93AB]">Replies</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
