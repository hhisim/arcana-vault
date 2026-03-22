'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getBrowserSupabase } from '@/lib/supabase/client'
import { useSiteI18n } from '@/lib/site-i18n'
import { useAuth } from '@/components/auth/AuthProvider'
import CategoryCard from '@/components/forum/CategoryCard'

interface Category {
  slug: string
  name_en: string
  name_tr: string
  name_ru: string
  description_en: string
  description_tr: string
  description_ru: string
  icon: string
  post_count: number
}

export default function AgoraPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { lang } = useSiteI18n()
  const { user } = useAuth()

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = getBrowserSupabase()
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (data) {
        // Fetch post counts
        const { count } = await supabase
          .from('forum_posts')
          .select('category_slug', { count: 'exact', head: true })
          .eq('is_deleted', false)

        const countMap: Record<string, number> = {}
        if (count) {
          // Group by category_slug manually since we need a raw query
          const { data: allPosts } = await supabase
            .from('forum_posts')
            .select('category_slug')
            .eq('is_deleted', false)
          allPosts?.forEach((p: any) => {
            countMap[p.category_slug] = (countMap[p.category_slug] || 0) + 1
          })
        }

        setCategories(
          (data as Category[]).map((c) => ({
            ...c,
            post_count: countMap[c.slug] || 0,
          }))
        )
      }
      setLoading(false)
    }
    fetchCategories()
  }, [])

  const getName = (cat: Category) =>
    lang === 'tr' ? cat.name_tr : lang === 'ru' ? cat.name_ru : cat.name_en

  const getDesc = (cat: Category) =>
    lang === 'tr' ? cat.description_tr : lang === 'ru' ? cat.description_ru : cat.description_en

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-6 text-center">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(201,168,76,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Radial glow */}
        <div className="absolute inset-0 bg-gradient-radial from-[rgba(123,94,167,0.08)] via-transparent to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A84C] mb-4 opacity-80">
            The Vault of Arcana
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-[#E8E0F0] mb-6 tracking-tight">
            The Agora
          </h1>
          <p className="text-lg text-[#9B93AB] max-w-2xl mx-auto leading-relaxed">
            The public square of the Vault. Where seekers gather to share wisdom,
            debate symbolism, and explore the great questions — together.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            {user ? (
              <Link
                href="/agora/new"
                className="px-8 py-3 rounded-full bg-[#C9A84C] text-[#0A0A0F] font-bold text-sm shadow-[0_0_40px_rgba(201,168,76,0.25)] hover:brightness-110 transition-all"
              >
                ✦ Begin a New Thread
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-8 py-3 rounded-full bg-[rgba(255,255,255,0.08)] text-[#E8E0F0] font-bold text-sm border border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.12)] transition-all"
              >
                Sign in to Post
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="voa-dots text-3xl text-[#C9A84C]">●●●</div>
            <p className="text-sm text-[#9B93AB] uppercase tracking-widest">Loading the Agora...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-24 glass-card rounded-3xl border border-[rgba(255,255,255,0.06)]">
            <div className="text-5xl mb-4">🌌</div>
            <p className="text-[#9B93AB] italic font-serif text-xl">The Agora awaits its first voices.</p>
          </div>
        ) : (
          <>
            {/* Stats bar */}
            <div className="glass-card rounded-2xl p-6 mb-10 border border-[rgba(255,255,255,0.06)] flex flex-wrap gap-8 justify-center">
              <div className="text-center">
                <div className="text-2xl font-serif text-[#C9A84C]">{categories.length}</div>
                <div className="text-[10px] uppercase tracking-widest text-[#9B93AB]">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-serif text-[#C9A84C]">
                  {categories.reduce((sum, c) => sum + c.post_count, 0)}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[#9B93AB]">Threads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-serif text-[#7B5EA7]">∞</div>
                <div className="text-[10px] uppercase tracking-widest text-[#9B93AB]">Perspectives</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.slug}
                  slug={cat.slug}
                  icon={cat.icon}
                  name={getName(cat)}
                  description={getDesc(cat)}
                  postCount={cat.post_count}
                  lang={lang}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
