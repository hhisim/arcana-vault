'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getBrowserSupabase } from '@/lib/supabase/client'
import { useSiteI18n } from '@/lib/site-i18n'

interface Category {
  slug: string
  name_en: string
  name_tr: string
  name_ru: string
  description_en: string
  description_tr: string
  description_ru: string
  icon: string
  post_count?: number
}

export default function ForumPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { lang, t } = useSiteI18n()

  useEffect(() => {
    const fetchCategories = async () => {
      const supabase = getBrowserSupabase()
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      
      if (data) setCategories(data)
      setLoading(false)
    }
    fetchCategories()
  }, [])

  if (loading) return <div className="min-h-screen bg-[#0A0A0F] py-20 text-center text-[#9B93AB]">Loading the Agora...</div>

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 space-y-12">
      <div className="space-y-4">
        <h1 className="font-serif text-5xl text-[var(--primary-gold)] tracking-tight">The Agora</h1>
        <p className="text-[#9B93AB] text-lg max-w-2xl leading-relaxed">
          The public square of the Vault. Engage in discourse on the mystical, the symbolic, and the collaboration of Human and Machine.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link 
            key={cat.slug} 
            href={`/forum/${cat.slug}`}
            className="glass-card p-8 rounded-3xl group hover:shadow-[0_0_40px_rgba(123,94,167,0.1)] transition-all flex flex-col space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="text-4xl grayscale group-hover:grayscale-0 transition-all duration-500">{cat.icon}</div>
              <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#9B93AB] opacity-0 group-hover:opacity-100 transition-opacity">Enter Archive</div>
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-[var(--text-primary)]">
                {lang === 'tr' ? cat.name_tr : lang === 'ru' ? cat.name_ru : cat.name_en}
              </h3>
              <p className="text-sm text-[#9B93AB] leading-6 line-clamp-3">
                {lang === 'tr' ? cat.description_tr : lang === 'ru' ? cat.description_ru : cat.description_en}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
