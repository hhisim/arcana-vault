'use client';

import React, { useState } from 'react';
import { useSiteI18n } from '@/lib/site-i18n';
import { posts } from '@/lib/posts';

const CATEGORY_KEYS = ['all', 'tao', 'tarot', 'tantra', 'entheogens'] as const;

export default function BlogPage() {
  const { t, lang } = useSiteI18n();
  const [filter, setFilter] = useState('all');

  const categoryLabel = (key: string) => {
    const labels: Record<string, { en: string; tr: string; ru: string }> = {
      all: { en: 'All', tr: 'Tümü', ru: 'Все' },
      tao: { en: 'Tao', tr: 'Tao', ru: 'Тао' },
      tarot: { en: 'Tarot', tr: 'Tarot', ru: 'Таро' },
      tantra: { en: 'Tantra', tr: 'Tantra', ru: 'Тантра' },
      entheogens: { en: 'Entheogens', tr: 'Enteojenler', ru: 'Энтеогены' },
    };
    return labels[key]?.[lang] ?? labels[key]?.en ?? key;
  };

  const filteredPosts = filter === 'all'
    ? posts
    : posts.filter(p => p.tradition === filter);

  const featured = posts.find(p => p.slug === 'dmt-hyperbolic-mind') || posts[0];
  const others = filteredPosts.filter(p => p.slug !== featured.slug);

  const title = { en: 'The Scroll', tr: 'Parşömen', ru: 'Свиток' }[lang];
  const featuredLabel = { en: 'Featured Scroll', tr: 'Öne Çıkan Yazı', ru: 'Избранный свиток' }[lang];
  const readMore = { en: 'Read more', tr: 'Devamını oku', ru: 'Читать далее' }[lang];
  const minRead = { en: 'min read', tr: 'dk okuma', ru: 'мин чтения' }[lang];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0] pb-24">
      <header className="max-w-7xl mx-auto px-6 pt-32 pb-12">
        <h1 className="font-cinzel text-5xl md:text-6xl mb-4 tracking-tighter text-[#E8E0F0]">{title}</h1>

        {/* Filter Tabs */}
        <div className="flex gap-4 mt-8 flex-wrap">
          {CATEGORY_KEYS.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`text-[10px] uppercase tracking-widest px-6 py-2 border rounded-full transition-all duration-300 ${
                filter === t
                  ? 'bg-[#7B5EA7] border-[#7B5EA7] text-white shadow-lg shadow-[#7B5EA7]/20'
                  : 'glass-card border-white/10 text-[#9B93AB] hover:border-white/30'
              }`}
            >
              {categoryLabel(t)}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-24">
        {/* Featured Post */}
        {featured && filter === 'all' && (
          <section className="relative h-96 w-full rounded-3xl overflow-hidden glass-card border border-white/10 shadow-2xl group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7B5EA7] to-[#12121A]" />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-all group-hover:backdrop-blur-sm" />
            <div className="relative h-full flex flex-col justify-end p-12">
              <span className="text-[#C9A84C] text-[10px] uppercase tracking-[0.2em] mb-4 font-bold bg-[#12121A]/50 px-3 py-1 rounded w-fit">{featuredLabel}</span>
              <h2 className="font-cinzel text-4xl md:text-6xl text-white max-w-4xl mb-6">
                <a href={`/blog/${featured.slug}`}>{featured.title}</a>
              </h2>
              <div className="flex items-center gap-4 text-xs tracking-widest uppercase text-white/70">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                    {featured.author.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <span>{featured.author}</span>
                </div>
                <span>• {featured.readTime} {minRead}</span>
                <span>• {new Date(featured.publishedAt).toLocaleDateString(lang === 'tr' ? 'tr-TR' : lang === 'ru' ? 'ru-RU' : 'en-US')}</span>
              </div>
              <a href={`/blog/${featured.slug}`} className="mt-6 inline-block text-[#C9A84C] uppercase tracking-widest text-xs hover:text-white transition-colors">
                {readMore} →
              </a>
            </div>
          </section>
        )}

        {/* Other Posts Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {others.map((post) => (
            <article key={post.slug} className="glass-card rounded-2xl overflow-hidden border border-white/10 group">
              <div className="h-48 bg-gradient-to-br from-[#7B5EA7] to-[#12121A] flex items-center justify-center">
                <span className="font-cinzel text-6xl text-white/20">{post.tradition[0].toUpperCase()}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-[#C9A84C] mb-3">
                  <span>{post.tradition}</span>
                  <span>•</span>
                  <span>{post.readTime} {minRead}</span>
                </div>
                <h3 className="font-cinzel text-lg text-white mb-3 leading-snug">
                  <a href={`/blog/${post.slug}`} className="hover:text-[#C9A84C] transition-colors">{post.title}</a>
                </h3>
                <p className="text-sm text-[#9B93AB] leading-relaxed mb-4">{post.excerpt}</p>
                <a href={`/blog/${post.slug}`} className="text-[10px] uppercase tracking-widest text-[#C9A84C] hover:text-white transition-colors">{readMore} →</a>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
