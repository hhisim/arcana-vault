'use client';

import React, { useState } from 'react';

const POSTS = [
  {
    title: "The Uncarved Block: Applying Wu Wei to Modern Decision Fatigue",
    slug: "what-tao-te-ching-says-about-uncertainty",
    tradition: "tao",
    publishedAt: "2025-03-15",
    excerpt: "In an era of relentless optimization, the ancient Taoist concept of non-action offers a radical strategy for high-stakes decision making.",
    readTime: 8,
    author: "The Tao Oracle",
    featured: true
  },
  {
    title: "As Above, So Below: Why Hermeticism Resonates with Silicon Valley",
    slug: "seven-hermetic-principles-silicon-valley",
    tradition: "philosophy",
    publishedAt: "2025-03-12",
    excerpt: "From systems thinking to recursive algorithms, the Seven Hermetic Principles provide a ancient framework for the digital age.",
    readTime: 10,
    author: "Hermetic Oracle",
    featured: false
  },
  {
    title: "Chaos Magick: Belief as a Recursive Technology",
    slug: "chaos-magick-not-what-you-think",
    tradition: "philosophy",
    publishedAt: "2025-03-10",
    excerpt: "Is it magick or just a very aggressive A/B test? Exploring the postmodern tech of belief and sigil-crafting.",
    readTime: 9,
    author: "Chaos Oracle",
    featured: false
  }
];

export default function BlogPage() {
  const [filter, setFilter] = useState('all');
  
  const filteredPosts = filter === 'all' ? POSTS : POSTS.filter(p => p.tradition === filter);
  const featured = POSTS.find(p => p.featured);
  const others = filteredPosts.filter(p => !p.featured || filter !== 'all');

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0] pb-24">
      <header className="max-w-7xl mx-auto px-6 pt-32 pb-12">
        <h1 className="font-cinzel text-5xl md:text-6xl mb-4 tracking-tighter">THE SCROLL</h1>
        <div className="flex gap-4 mt-8">
          {['all', 'tao', 'philosophy'].map(t => (
            <button 
              key={t}
              onClick={() => setFilter(t)}
              className={`text-xs uppercase tracking-widest px-4 py-2 border rounded transition-all ${filter === t ? 'border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/5' : 'border-white/10 text-[#9B93AB] hover:border-white/30'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-24">
        {/* Featured Post */}
        {featured && filter === 'all' && (
          <section className="group relative glass-card rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
            <div className="md:flex h-[500px]">
              <div className="md:w-1/2 bg-gradient-to-br from-[#1a0f2e] to-[#0A0A0F] p-12 flex flex-col justify-center">
                <span className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] mb-4 font-bold">Featured Scroll</span>
                <h2 className="font-cinzel text-3xl md:text-5xl mb-6 group-hover:text-[#C9A84C] transition-colors leading-tight">
                  <a href={`/blog/${featured.slug}`}>{featured.title}</a>
                </h2>
                <p className="text-[#9B93AB] text-lg mb-8 line-clamp-3">{featured.excerpt}</p>
                <div className="mt-auto flex items-center gap-4 text-xs tracking-widest uppercase text-[#5A5468]">
                  <span>{featured.author}</span>
                  <span className="w-1 h-1 bg-[#5A5468] rounded-full" />
                  <span>{featured.readTime} min read</span>
                </div>
              </div>
              <div className="md:w-1/2 bg-[#12121A] relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#7B5EA7] via-transparent to-transparent animate-pulse" />
                 <div className="font-cinzel text-9xl opacity-5 text-white select-none">TAO</div>
              </div>
            </div>
          </section>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {others.map((post) => (
            <article key={post.slug} className="glass-card group rounded-xl border border-white/5 overflow-hidden flex flex-col transition-all hover:border-[#7B5EA7]/30 hover:shadow-[0_0_30px_rgba(123,94,167,0.1)]">
              <div className="h-48 bg-gradient-to-br from-[#12121A] to-[#0A0A0F] flex items-center justify-center">
                <div className="font-cinzel text-4xl opacity-10 group-hover:opacity-20 transition-opacity">{post.tradition.toUpperCase()}</div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="font-cinzel text-xl mb-4 group-hover:text-[#C9A84C] transition-colors leading-snug">
                  <a href={`/blog/${post.slug}`}>{post.title}</a>
                </h3>
                <p className="text-[#9B93AB] text-sm line-clamp-3 mb-6 flex-1">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-auto">
                   <span className="text-[10px] uppercase tracking-widest text-[#5A5468]">{post.publishedAt}</span>
                   <a href={`/blog/${post.slug}`} className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-bold">Read Scroll →</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
