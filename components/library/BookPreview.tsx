'use client';

import React from 'react';
import Link from 'next/link';

const featuredBooks = [
  {
    title: "The Divine Pymander",
    author: "Hermes Trismegistus",
    tradition: "Hermetics",
    gradient: "linear-gradient(135deg, #065f46 0%, #064e3b 40%, #0a0a0f 100%)",
    symbolColor: "#C9A84C",
    excerpt: "The foundational text of Hermetic philosophy — where mind meets cosmos and the human becomes divine.",
  },
  {
    title: "The Book of the Law",
    author: "Aleister Crowley",
    tradition: "Thelema",
    gradient: "linear-gradient(135deg, #7f1d1d 0%, #450a0a 40%, #0a0a0f 100%)",
    symbolColor: "#C9A84C",
    excerpt: "The central scripture of Thelema, received in Cairo in 1904 — 'Do what thou wilt shall be the whole of the law.'",
  },
  {
    title: "The Corpus Hermeticum",
    author: "Hermes Trismegistus",
    tradition: "Hermetics",
    gradient: "linear-gradient(135deg, #92400e 0%, #78350f 40%, #0a0a0f 100%)",
    symbolColor: "#C9A84C",
    excerpt: "Seventeen treatises on the nature of the divine, the cosmos, and the path of return. The seed-text of Western esotericism.",
  },
  {
    title: "The Kybalion",
    author: "Three Initiates",
    tradition: "Hermetics",
    gradient: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 40%, #0a0a0f 100%)",
    symbolColor: "#C9A84C",
    excerpt: "Seven Hermetic principles that govern all existence — Mentalism, Correspondence, Vibration, Polarity, Rhythm, Causation, and Gender.",
  },
  {
    title: "The Book of Abramelin",
    author: "Abraham of Worms",
    tradition: "Kabbalah",
    gradient: "linear-gradient(135deg, #92400e 0%, #78716c 30%, #0a0a0f 100%)",
    symbolColor: "#C9A84C",
    excerpt: "The most complete system of Holy Guardian Angel invocation — a 18-month operation for achieving真正的 Knowledge and Conversation with one's Holy Guardian Angel.",
  },
  {
    title: "The Tibetan Book of the Dead",
    author: "Padmasambhava",
    tradition: "Buddhism",
    gradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #0a0a0f 100%)",
    symbolColor: "#a5b4fc",
    excerpt: "The Bardo Thodol — guidance through the 49 states after death, designed to be read aloud to the dying so they may recognize the lights and be freed.",
  },
];

// SVG symbols for each tradition
function BookSymbol({ tradition, color }: { tradition: string; color: string }) {
  if (tradition === 'Hermetics') {
    // Eye of Hermes
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
  if (tradition === 'Thelema') {
    // Ouroboros (serpent eating tail)
    return (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="20" stroke={color} strokeWidth="2" fill="none" opacity="0.7"/>
        <path d="M52 32c0-5.5-4.5-10-10-10h-4" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="36" cy="20" r="2.5" fill={color}/>
        <path d="M32 52c-5.5 0-10-4.5-10-10v-4" stroke={color} strokeWidth="1.5" opacity="0.4"/>
      </svg>
    );
  }
  if (tradition === 'Kabbalah') {
    // Pentagram / golden pentagram
    return (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <path d="M32 6L38.5 25.5L58 25.5L42.5 37.5L48.5 57L32 44.5L15.5 57L21.5 37.5L6 25.5L25.5 25.5Z" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6"/>
        <circle cx="32" cy="32" r="6" stroke={color} strokeWidth="1.5" opacity="0.8"/>
      </svg>
    );
  }
  if (tradition === 'Buddhism') {
    // Dorje / thunderbolt
    return (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <path d="M32 8L20 32h10l-6 24 18-28H32l6-20z" stroke={color} strokeWidth="1.5" fill="none" opacity="0.7"/>
        <circle cx="32" cy="32" r="4" fill={color} opacity="0.5"/>
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
  return (
    <section className="py-16 bg-deep">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#7B5EA7] mb-3">Library</p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#E8E0F0]">
              Featured from the Archive
            </h2>
            <p className="mt-3 text-[#9B93AB] text-sm max-w-xl">
              Rare texts, verified editions, and living transmissions from the esoteric traditions.
            </p>
          </div>
          <Link
            href="/library"
            className="hidden md:inline-flex items-center gap-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 px-5 py-2.5 text-sm font-medium text-[#E8E0F0] transition-all"
          >
            View All Books →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredBooks.map((book) => (
            <div
              key={book.title}
              className="group rounded-3xl border border-white/5 bg-[#12121A] overflow-hidden hover:border-[rgba(201,168,76,0.3)] hover:shadow-[0_0_30px_rgba(201,168,76,0.08)] transition-all duration-500 hover:scale-[1.02]"
            >
              {/* Cover */}
              <div
                className="h-48 relative flex items-center justify-center overflow-hidden"
                style={{ background: book.gradient }}
              >
                <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-matter.png")' }} />
                <div className="relative transform group-hover:scale-110 transition-transform duration-700">
                  <BookSymbol tradition={book.tradition} color={book.symbolColor} />
                </div>
                {/* Tradition badge */}
                <div className="absolute top-4 right-4 rounded-full border border-white/15 bg-black/30 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/70">
                  {book.tradition}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-serif text-lg text-[#C9A84C] leading-tight mb-1">{book.title}</h3>
                <p className="text-xs italic text-[#7B5EA7] mb-4">{book.author}</p>
                <p className="text-sm leading-relaxed text-[#9B93AB] line-clamp-3">{book.excerpt}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/library"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-medium text-[#E8E0F0] transition-all"
          >
            View All Books →
          </Link>
        </div>
      </div>
    </section>
  );
}
