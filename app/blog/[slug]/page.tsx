'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { POSTS } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { MDXComponents } from '@/components/mdx-components';
import remarkGfm from 'remark-gfm';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = POSTS.find(p => p.slug === slug) || POSTS[0];

  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  
  useEffect(() => {
    // Generate headings for TOC
    const h2Pattern = /^##\s+(.+)$/gm;
    const matches = [...post.content.matchAll(h2Pattern)];
    const extractedHeadings = matches.map((match) => ({
      id: match[1].toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      text: match[1],
      level: 2
    }));
    setHeadings(extractedHeadings);
  }, [post.content]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0] pb-32">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7B5EA7]/20 via-[#12121A] to-[#0A0A0F]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <span className="px-4 py-1 bg-[#7B5EA7]/30 border border-[#7B5EA7]/50 rounded-full text-[#C9A84C] text-xs tracking-[0.2em] uppercase font-bold">
              {post.tradition} Tradition
            </span>
          <h1 className="font-cinzel text-4xl md:text-6xl lg:text-7xl text-[#E8E0F0] leading-tight mt-6 mb-8">
            {post.title}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16 py-16">
        <article className="max-w-3xl mx-auto prose prose-invert">
          <MDXRemote 
            source={post.content} 
            components={MDXComponents} 
            options={{ 
              mdxOptions: { 
                remarkPlugins: [remarkGfm], 
                format: 'mdx' 
              } 
            }} 
          />
          
          <section className="mt-16 p-8 glass-card rounded-2xl border border-[#7B5EA7]/20 text-center">
            <h4 className="font-cinzel text-2xl text-[#E8E0F0] mb-4">Consult the Oracle</h4>
            <a href={`/chat?bot=${post.tradition.toLowerCase()}`} className="inline-block bg-[#7B5EA7] text-white px-8 py-3 rounded-lg font-bold">
              Consult the Oracle
            </a>
          </section>
        </article>

        <aside className="hidden lg:block relative">
            <div className="sticky top-24 space-y-8">
              <h5 className="text-[10px] uppercase tracking-widest text-[#5A5468] border-b border-white/5 pb-2">Table of Contents</h5>
              <div className="flex flex-col gap-2">
                {headings.map(h => (
                    <a key={h.id} href={`#${h.id}`} className="text-[#9B93AB] hover:text-[#C9A84C] text-sm">{h.text}</a>
                ))}
              </div>
            </div>
        </aside>
      </div>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .glass-card { background: rgba(18, 18, 26, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); }
      `}</style>
    </div>
  );
}
