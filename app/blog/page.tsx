'use client';

import React, { useState } from 'react';
import { posts } from '@/lib/posts';

export default function BlogPage() {
  const [filter, setFilter] = useState('all');
  
  const categories = ['all', 'Tao', 'Tarot', 'Tantra', 'Entheogens'];

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(p => p.tradition === filter);
  
  const featured = posts.find(p => p.slug === 'dmt-hyperbolic-mind') || posts[0];
  const others = filteredPosts.filter(p => p.slug !== featured.slug);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0] pb-24">
      <header className="max-w-7xl mx-auto px-6 pt-32 pb-12">
        <h1 className="font-cinzel text-5xl md:text-6xl mb-4 tracking-tighter text-[#E8E0F0]">THE SCROLL</h1>
        
        {/* Filter Tabs */}
        <div className="flex gap-4 mt-8 flex-wrap">
          {categories.map((t) => (
            <button 
              key={t}
              onClick={() => setFilter(t)}
              className={`text-[10px] uppercase tracking-widest px-6 py-2 border rounded-full transition-all duration-300 ${
                filter === t 
                  ? 'bg-[#7B5EA7] border-[#7B5EA7] text-white shadow-lg shadow-[#7B5EA7]/20' 
                  : 'glass-card border-white/10 text-[#9B93AB] hover:border-white/30'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-24">
        {/* Featured Post */}
        {featured && filter === 'all' && (
          <section className="relative h-96 w-full rounded-3xl overflow-hidden glass-card border border-white/10 shadow-2xl group cursor-pointer">
            <div className={`absolute inset-0 bg-gradient-to-br from-[#7B5EA7] to-[#12121A]`} />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-all group-hover:backdrop-blur-sm" />
            <div className="relative h-full flex flex-col justify-end p-12">
              <span className="text-[#C9A84C] text-[10px] uppercase tracking-[0.2em] mb-4 font-bold bg-[#12121A]/50 px-3 py-1 rounded w-fit">Featured Scroll</span>
              <h2 className="font-cinzel text-4xl md:text-6xl text-white max-w-4xl mb-6">
                <a href={`/blog/${featured.slug}`}>{featured.title}</a>
              </h2>
              <div className="flex items-center gap-4 text-xs tracking-widest uppercase text-white/70">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                    {featured.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span>{featured.author}</span>
                </div>
                <span>• {featured.readTime} min read</span>
                <span>• {new Date(featured.publishedAt).toLocaleDateString()}</span>
                <span className="px-2 py-0.5 rounded border border-white/20 text-[9px]">{featured.tradition}</span>
              </div>
            </div>
          </section>
        )}

        {/* Grid */}
        {others.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {others.map((post) => (
              <article key={post.slug} className="glass-card group rounded-2xl border border-white/10 overflow-hidden flex flex-col transition-all duration-300 hover:border-[#7B5EA7]/50 hover:shadow-[0_0_40px_rgba(123,94,167,0.15)] hover:-translate-y-2">
                {/* Image Area */}
                <div className="h-48 w-full bg-gradient-to-br from-[#7B5EA7] to-[#5A5468] relative opacity-90 transition-opacity group-hover:opacity-100">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-cinzel text-xl text-[#E8E0F0] mb-3 group-hover:text-[#C9A84C] transition-colors leading-snug line-clamp-2">
                    <a href={`/blog/${post.slug}`}>{post.title}</a>
                  </h3>
                  <p className="text-sm text-[#9B93AB] line-clamp-3 mt-2 mb-6 flex-1">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    <span className="px-2 py-1 rounded bg-[#7B5EA7]/20 text-[#C9A84C] text-[9px] uppercase tracking-wider font-bold">
                      {post.tradition}
                    </span>
                    <span className="text-[10px] tracking-widest text-[#5A5468] uppercase text-right">
                       {post.readTime} min • {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-[#5A5468] opacity-60">
            <span className="text-6xl mb-6">📜</span>
            <p className="text-xl font-cinzel tracking-widest">No scrolls found in this tradition</p>
          </div>
        )}
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&display=swap');

        .font-cinzel {
          font-family: 'Cinzel', serif;
        }

        .glass-card {
          background: rgba(18, 18, 26, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
