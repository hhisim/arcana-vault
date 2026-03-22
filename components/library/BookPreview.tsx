'use client';

import React from 'react';
import Link from 'next/link';

const featuredBooks = [
  {
    title: "The Kybalion",
    author: "Three Initiates, 1908",
    tradition: "Hermetic Philosophy",
    gradient: "linear-gradient(135deg, #1a1a3e 0%, #0f0f2a 50%, #0a0a0f 100%)",
    symbolColor: "#C9A84C",
    excerpt: "The seven universal principles underlying all existence — Mentalism, Correspondence, Vibration, Polarity, Rhythm, Causation, and Gender.",
  },
  {
    title: "The Corpus Hermeticum",
    author: "Hermes Trismegistus, c. 100–300 CE",
    tradition: "Hermeticism",
    gradient: "linear-gradient(135deg, #065f46 0%, #034e34 50%, #0a0a0f 100%)",
    symbolColor: "#C9A84C",
    excerpt: "The divine dialogues on the nature of the One — seventeen treatises on mind, cosmos, and the path of return to divine consciousness.",
  },
  {
    title: "Tao Te Ching",
    author: "Lao Tzu, c. 4th century BCE",
    tradition: "Taoism",
    gradient: "linear-gradient(135deg, #0f4a3e 0%, #08332a 50%, #0a0a0f 100%)",
    symbolColor: "#4ECDC4",
    excerpt: "Lao Tzu's 81 verses on the uncarved block — the effortless path of water, stillness, and returning to the source.",
  },
  {
    title: "The Book of the Law",
    author: "Aleister Crowley, 1904",
    tradition: "Thelema",
    gradient: "linear-gradient(135deg, #5c1a1a 0%, #2d0a0a 50%, #0a0a0f 100%)",
    symbolColor: "#C9A84C",
    excerpt: "Aleister Crowley's reception text on divine selfhood — 'Do what thou wilt shall be the whole of the law.'",
  },
  {
    title: "The Bhagavad Gita",
    author: "Vyasa, c. 2nd century BCE",
    tradition: "Yoga",
    gradient: "linear-gradient(135deg, #6b2d0a 0%, #3d1a05 50%, #0a0a0f 100%)",
    symbolColor: "#E8722A",
    excerpt: "The eternal song of the Self on the battlefield of dharma — Krishna's teaching to Arjuna on action, devotion, and the nature of consciousness.",
  },
  {
    title: "The Epic of Gilgamesh",
    author: "Unknown Babylonian Scribe, c. 2100 BCE",
    tradition: "Ancient",
    gradient: "linear-gradient(135deg, #4a3a1a 0%, #2a1f0a 50%, #0a0a0f 100%)",
    symbolColor: "#D4A84C",
    excerpt: "Humanity's oldest story of seeking immortality — the Sumerian king's journey through grief, friendship, and the limits of mortal ambition.",
  },
];

// SVG symbols for each tradition
function BookSymbol({ tradition, color }: { tradition: string; color: string }) {
  if (tradition === 'Hermetic Philosophy' || tradition === 'Hermeticism') {
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
  if (tradition === 'Taoism') {
    // Yin-Yang
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
  if (tradition === 'Yoga') {
    // Sri Yantra / triangles
    return (
      <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
        <path d="M32 8L50 44H14Z" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5"/>
        <path d="M32 56L14 20H50Z" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5"/>
        <circle cx="32" cy="32" r="6" stroke={color} strokeWidth="1.5" opacity="0.8"/>
        <circle cx="32" cy="32" r="2.5" fill={color} opacity="0.8"/>
      </svg>
    );
  }
  if (tradition === 'Ancient') {
    // Cuneiform tablet / wedge
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
