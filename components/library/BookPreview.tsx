'use client';

import React from 'react';
import Link from 'next/link';
import { useSiteI18n } from '@/lib/site-i18n';

const featuredBooks = [
  {
    key: 'kybalion',
    title: "home.library.book1.title",
    author: "home.library.book1.author",
    tradition: "home.library.book1.tradition",
    gradient: "linear-gradient(135deg, #1a1a3e 0%, #0f0f2a 50%, #0a0a0f 100%)",
    symbolColor: "#C9A84C",
    excerpt: "home.library.book1.excerpt",
    coverImage: "/images/library/kybalion.jpg",
  },
  {
    key: 'corpus',
    title: "home.library.book2.title",
    author: "home.library.book2.author",
    tradition: "home.library.book2.tradition",
    gradient: "linear-gradient(135deg, #065f46 0%, #034e34 50%, #0a0a0f 100%)",
    symbolColor: "#C9A84C",
    excerpt: "home.library.book2.excerpt",
    coverImage: "/images/library/corpus-hermeticum.jpg",
  },
  {
    key: 'tao',
    title: "home.library.book3.title",
    author: "home.library.book3.author",
    tradition: "home.library.book3.tradition",
    gradient: "linear-gradient(135deg, #0f4a3e 0%, #08332a 50%, #0a0a0f 100%)",
    symbolColor: "#4ECDC4",
    excerpt: "home.library.book3.excerpt",
    coverImage: "/images/library/tao-te-ching.jpg",
  },
  {
    key: 'law',
    title: "home.library.book4.title",
    author: "home.library.book4.author",
    tradition: "home.library.book4.tradition",
    gradient: "linear-gradient(135deg, #5c1a1a 0%, #2d0a0a 50%, #0a0a0f 100%)",
    symbolColor: "#C9A84C",
    excerpt: "home.library.book4.excerpt",
    coverImage: "/images/library/book-of-the-law.jpg",
  },
  {
    key: 'gita',
    title: "home.library.book5.title",
    author: "home.library.book5.author",
    tradition: "home.library.book5.tradition",
    gradient: "linear-gradient(135deg, #6b2d0a 0%, #3d1a05 50%, #0a0a0f 100%)",
    symbolColor: "#E8722A",
    excerpt: "home.library.book5.excerpt",
    coverImage: "/images/library/bhagavad-gita.jpg",
  },
  {
    key: 'gilgamesh',
    title: "home.library.book6.title",
    author: "home.library.book6.author",
    tradition: "home.library.book6.tradition",
    gradient: "linear-gradient(135deg, #4a3a1a 0%, #2a1f0a 50%, #0a0a0f 100%)",
    symbolColor: "#D4A84C",
    excerpt: "home.library.book6.excerpt",
    coverImage: "/images/library/epic-of-gilgamesh.jpg",
  },
];

// SVG symbols for each tradition
function BookSymbol({ traditionKey, color }: { traditionKey: string; color: string }) {
  if (traditionKey === 'corpus' || traditionKey === 'kybalion') {
    return (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" stroke={color} strokeWidth="1.5" opacity="0.4"/>
        <circle cx="32" cy="32" r="18" stroke={color} strokeWidth="1.5" opacity="0.6"/>
        <circle cx="32" cy="32" r="8" fill={color} opacity="0.8"/>
        <circle cx="32" cy="32" r="3" fill="white" opacity="0.9"/>
        <path d="M32 4v8M32 52v8M4 32h8M52 32h8" stroke={color} strokeWidth="1.5" opacity="0.5"/>
      </svg>
    );
  }
  if (traditionKey === 'law') {
    return (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="20" stroke={color} strokeWidth="2" fill="none" opacity="0.7"/>
        <path d="M52 32c0-5.5-4.5-10-10-10h-4" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="36" cy="20" r="2.5" fill={color}/>
        <path d="M32 52c-5.5 0-10-4.5-10-10v-4" stroke={color} strokeWidth="1.5" opacity="0.4"/>
      </svg>
    );
  }
  if (traditionKey === 'tao') {
    return (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="24" stroke={color} strokeWidth="1.5" opacity="0.6"/>
        <path d="M32 8a24 24 0 0 1 0 48" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.15" opacity="0.8"/>
        <circle cx="32" cy="20" r="6" stroke={color} strokeWidth="1.5" opacity="0.9"/>
        <circle cx="32" cy="44" r="6" stroke={color} strokeWidth="1.5" opacity="0.5"/>
        <circle cx="32" cy="20" r="2.5" fill={color}/>
        <circle cx="32" cy="44" r="2.5" fill={color} fillOpacity="0.3"/>
      </svg>
    );
  }
  if (traditionKey === 'gita') {
    return (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <path d="M32 8L50 44H14Z" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5"/>
        <path d="M32 56L14 20H50Z" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5"/>
        <circle cx="32" cy="32" r="6" stroke={color} strokeWidth="1.5" opacity="0.8"/>
        <circle cx="32" cy="32" r="2.5" fill={color} opacity="0.8"/>
      </svg>
    );
  }
  if (traditionKey === 'gilgamesh') {
    return (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <rect x="10" y="12" width="44" height="40" rx="4" stroke={color} strokeWidth="1.5" opacity="0.5"/>
        <path d="M18 22h28M18 30h20M18 38h24M18 46h16" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
      </svg>
    );
  }
  return (
    <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="20" stroke={color} strokeWidth="1.5" opacity="0.5"/>
    </svg>
  );
}

export default function BookPreview() {
  const { t } = useSiteI18n();

  return (
    <section className="py-16 bg-deep">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#7B5EA7] mb-3">{t('home.library.eyebrow') || 'Library'}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#E8E0F0]">
              {t('home.library.featured_title')}
            </h2>
            <p className="mt-3 text-[#9B93AB] text-sm max-w-xl">
              {t('home.library.featured_subtitle')}
            </p>
          </div>
          <Link
            href="/library"
            className="hidden md:inline-flex items-center gap-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 px-5 py-2.5 text-sm font-medium text-[#E8E0F0] transition-all"
          >
            {t('home.library.view_all')} →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredBooks.map((book) => (
            <div
              key={book.key}
              className="group rounded-3xl border border-white/5 bg-[#12121A] overflow-hidden hover:border-[rgba(201,168,76,0.3)] hover:shadow-[0_0_30px_rgba(201,168,76,0.08)] transition-all duration-500 hover:scale-[1.02]"
            >
              {/* Cover */}
              <div
                className="h-48 relative flex items-center justify-center overflow-hidden"
                style={{ background: book.gradient }}
              >
                <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-matter.png")' }} />
                <div className="relative transform group-hover:scale-110 transition-transform duration-700">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={t(book.title)}
                      className="w-32 h-48 object-cover rounded-lg opacity-90 group-hover:opacity-100 transition-opacity shadow-xl"
                      style={{ boxShadow: `0 0 30px ${book.symbolColor}40` }}
                    />
                  ) : (
                    <BookSymbol traditionKey={book.key} color={book.symbolColor} />
                  )}
                </div>
                {/* Tradition badge */}
                <div className="absolute top-4 right-4 rounded-full border border-white/15 bg-black/30 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/70">
                  {t(book.tradition)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-serif text-lg text-[#C9A84C] leading-tight mb-1">{t(book.title)}</h3>
                <p className="text-xs italic text-[#7B5EA7] mb-4">{t(book.author)}</p>
                <p className="text-sm leading-relaxed text-[#9B93AB] line-clamp-3">{t(book.excerpt)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/library"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-medium text-[#E8E0F0] transition-all"
          >
            {t('home.library.view_all')} →
          </Link>
        </div>
      </div>
    </section>
  );
}
