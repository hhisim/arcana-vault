'use client';

import React, { useState, useMemo } from 'react';
import { useSiteI18n } from '@/lib/site-i18n';
import { posts } from '@/lib/posts';
import { postsI18n } from '@/lib/posts-i18n';
import AdinkraIcon from '@/components/AdinkraIcon';

const CATEGORY_KEYS = ['all', 'tao', 'tarot', 'tantra', 'entheogens', 'alchemy', 'hermetics', 'philosophy', 'yoga', 'sufism', 'gnosticism', 'dreamwalker', 'science', 'linguistics'] as const;

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
      alchemy: { en: 'Alchemy', tr: 'Simya', ru: 'Алхимия' },
      hermetics: { en: 'Hermetics', tr: 'Hermetik', ru: 'Герметика' },
      philosophy: { en: 'Philosophy', tr: 'Felsefe', ru: 'Философия' },
      yoga: { en: 'Yoga', tr: 'Yoga', ru: 'Йога' },
      sufism: { en: 'Sufism', tr: 'Sufizm', ru: 'Суфизм' },
      gnosticism: { en: 'Gnosticism', tr: 'Gnostik', ru: 'Гностицизм' },
      dreamwalker: { en: 'Dreamwalker', tr: 'Rüya Gezgini', ru: 'Сновидец' },
      science: { en: 'Science', tr: 'Bilim', ru: 'Наука' },
      linguistics: { en: 'Linguistics', tr: 'Dilbilim', ru: 'Лингвистика' },
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

  // Sidebar i18n labels
  const subjectsLabel = { en: 'Subjects', tr: 'Konular', ru: 'Предметы' }[lang];
  const datesLabel = { en: 'Dates', tr: 'Tarihler', ru: 'Даты' }[lang];
  const articlesLabel = { en: 'articles', tr: 'yazı', ru: 'статей' }[lang];

  // Resolve i18n title/excerpt
  const getTitle = (slug: string, fallback: string) => {
    if (lang === 'tr') return postsI18n[slug]?.title_tr ?? fallback;
    if (lang === 'ru') return postsI18n[slug]?.title_ru ?? fallback;
    return fallback;
  };
  const getExcerpt = (slug: string, fallback: string) => {
    if (lang === 'tr') return postsI18n[slug]?.excerpt_tr ?? fallback;
    if (lang === 'ru') return postsI18n[slug]?.excerpt_ru ?? fallback;
    return fallback;
  };

  // Compute tradition counts from all posts
  const traditionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const post of posts) {
      counts[post.tradition] = (counts[post.tradition] ?? 0) + 1;
    }
    return counts;
  }, []);

  // Group posts by month/year (most recent first)
  const postsByDate = useMemo(() => {
    const groups: Record<string, typeof posts> = {};
    for (const post of posts) {
      const d = new Date(post.publishedAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString(lang === 'tr' ? 'tr-TR' : lang === 'ru' ? 'ru-RU' : 'en-US', { month: 'long', year: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(post);
    }
    return Object.entries(groups)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, groupPosts]) => {
        const d = new Date(key + '-01');
        const label = d.toLocaleDateString(lang === 'tr' ? 'tr-TR' : lang === 'ru' ? 'ru-RU' : 'en-US', { month: 'long', year: 'numeric' });
        return { key, label, posts: groupPosts };
      });
  }, [lang]);

  // All traditions that appear in posts
  const allTraditions = Object.keys(traditionCounts).sort();

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0] pb-24">
      <header className="max-w-7xl mx-auto px-6 pt-32 pb-12">
        <h1 className="font-cinzel text-5xl md:text-6xl mb-4 tracking-tighter text-[#E8E0F0] flex items-center gap-3">
          <AdinkraIcon name="adinkra-1" size={36} color="gold" alt="Adinkra symbol" />
          {title}
        </h1>

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

      <main className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-24">
            {/* Featured Post */}
            {featured && filter === 'all' && (
              <section className="relative h-96 w-full rounded-3xl overflow-hidden glass-card border border-white/10 shadow-2xl group cursor-pointer">
                {featured.hero ? (
                  <img src={featured.hero} alt={featured.title} className="absolute inset-0 w-full h-full object-contain" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7B5EA7] to-[#12121A]" />
                )}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-all group-hover:backdrop-blur-sm" />
                <div className="relative h-full flex flex-col justify-end p-12">
                  <span className="text-[#C9A84C] text-[10px] uppercase tracking-[0.2em] mb-4 font-bold bg-[#12121A]/50 px-3 py-1 rounded w-fit">{featuredLabel}</span>
                  <h2 className="font-cinzel text-4xl md:text-6xl text-white max-w-4xl mb-6">
                    <a href={`/blog/${featured.slug}`}>{getTitle(featured.slug, featured.title)}</a>
                  </h2>
                  <div className="flex items-center gap-4 text-xs tracking-widest uppercase text-white/70">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                        {featured.author.split(' ').map((n: string) => n[0]).join('')}
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
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {others.map((post) => (
                <article key={post.slug} className="glass-card rounded-2xl overflow-hidden border border-white/10 group">
                  {post.hero ? (
                    <div className="h-44 overflow-hidden flex items-center justify-center bg-[#0A0A0F]">
                      <img
                        src={post.hero}
                        alt={post.title}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-[#7B5EA7] to-[#12121A] flex items-center justify-center">
                      <span className="font-cinzel text-6xl text-white/20">{post.tradition[0].toUpperCase()}</span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-[#C9A84C] mb-3">
                      <span>{post.tradition}</span>
                      <span>•</span>
                      <span>{post.readTime} {minRead}</span>
                    </div>
                    <h3 className="font-cinzel text-lg text-white mb-3 leading-snug">
                      <a href={`/blog/${post.slug}`} className="hover:text-[#C9A84C] transition-colors">{getTitle(post.slug, post.title)}</a>
                    </h3>
                    <p className="text-sm text-[#9B93AB] leading-relaxed mb-4">{getExcerpt(post.slug, post.excerpt)}</p>
                    <a href={`/blog/${post.slug}`} className="text-[10px] uppercase tracking-widest text-[#C9A84C] hover:text-white transition-colors">{readMore} →</a>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 sticky top-28 space-y-6">
            {/* Subjects Section */}
            <div className="glass-card rounded-2xl border border-white/10 p-6">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-bold mb-5">{subjectsLabel}</h3>
              <ul className="space-y-3">
                {allTraditions.map((tradition) => {
                  const count = traditionCounts[tradition];
                  const isActive = filter === tradition;
                  return (
                    <li key={tradition}>
                      <button
                        onClick={() => setFilter(isActive ? 'all' : tradition)}
                        className={`w-full flex items-center justify-between text-sm transition-all duration-200 group hover:text-[#C9A84C] ${
                          isActive ? 'text-[#C9A84C]' : 'text-[#9B93AB]'
                        }`}
                      >
                        <span className="capitalize">{categoryLabel(tradition)}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                          isActive
                            ? 'bg-[#7B5EA7] border-[#7B5EA7] text-white'
                            : 'border-white/10 text-[#9B93AB] group-hover:border-[#C9A84C]/30'
                        }`}>
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Dates Section */}
            <div className="glass-card rounded-2xl border border-white/10 p-6">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-bold mb-5">{datesLabel}</h3>
              <ul className="space-y-4">
                {postsByDate.map(({ key, label, posts: monthPosts }) => (
                  <li key={key}>
                    <span className="text-xs text-[#9B93AB] font-medium block mb-2 capitalize">{label}</span>
                    <ul className="space-y-2 ml-2">
                      {monthPosts.map((post) => (
                        <li key={post.slug}>
                          <a
                            href={`/blog/${post.slug}`}
                            className="text-xs text-[#9B93AB] hover:text-white transition-colors leading-snug line-clamp-2"
                          >
                            {getTitle(post.slug, post.title)}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
