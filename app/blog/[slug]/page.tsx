'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { POSTS } from '@/lib/posts';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = POSTS.find(p => p.slug === slug) || POSTS[0];

  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const tocRef = useRef<HTMLDivElement>(null);

  // Extract headings from content
  useEffect(() => {
    const h2Pattern = /^##\s+(.+)$/gm;
    const matches = [...post.content.matchAll(h2Pattern)];
    
    const extractedHeadings = matches.map((match, index) => ({
      id: match[1].toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      text: match[1],
      level: 2
    }));
    
    setHeadings(extractedHeadings);
  }, [post.content]);

  // Handle scroll spy for TOC highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('article h2');
      let current = '';
      
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < 200) {
          current = section.id;
        }
      });
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Generate related posts (same tradition, different slug)
  const relatedPosts = POSTS.filter(p => p.tradition === post.tradition && p.slug !== slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-32">
      
      {/* HERO SECTION */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7B5EA7]/20 via-[#12121A] to-[#0A0A0F]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZycvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSIvPjwvc3ZnPg==')] opacity-20" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Tradition Badge */}
          <div className="flex items-center justify-center gap-2 mb-6 animate-fade-in">
            <span className="px-4 py-1 bg-[#7B5EA7]/30 border border-[#7B5EA7]/50 rounded-full text-[#C9A84C] text-xs tracking-[0.2em] uppercase font-bold">
              {post.tradition} Tradition
            </span>
          </div>

          {/* Title */}
          <h1 className="font-cinzel text-4xl md:text-6xl lg:text-7xl text-[#E8E0F0] leading-tight mb-8 animate-fade-in-up">
            {post.title}
          </h1>

          {/* Meta Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-[#9B93AB] animate-fade-in-up">
            {/* Author Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7B5EA7] to-[#5A5468] flex items-center justify-center text-[#E8E0F0] font-bold text-base">
                {post.author.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-[#E8E0F0] font-medium">{post.author}</span>
            </div>
            
            <div className="flex items-center gap-2 text-[#5A5468]">
              <span className="w-1 h-1 bg-[#C9A84C] rounded-full" />
              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            
            <div className="flex items-center gap-2 text-[#5A5468]">
              <span className="w-1 h-1 bg-[#C9A84C] rounded-full" />
              <span>{post.readTime} min read</span>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 animate-bounce">
            <button 
              onClick={() => document.querySelector('article')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex flex-col items-center gap-2 text-[#9B93AB] hover:text-[#C9A84C] transition-colors"
            >
              <span className="text-xs tracking-[0.2em] uppercase">Begin Reading</span>
              <svg className="w-5 h-5 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-6xl mx-auto px-6 lg:grid lg:grid-cols-[1fr_280px] gap-16">
        
        {/* ARTICLE BODY */}
        <article className="max-w-3xl mx-auto px-6 py-16">
          <div className="text-lg leading-relaxed space-y-8" style={{ color: '#9B93AB' }}>
            {post.content.split('\n\n').map((block, i) => {
              // H2 Headings
              if (block.startsWith('## ')) {
                const title = block.replace('## ', '');
                const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                
                return (
                  <div key={i} id={id} className="scroll-mt-32">
                    <h2 className="font-cinzel text-3xl text-[#E8E0F0] mt-12 mb-6">
                      {title}
                    </h2>
                    
                    {/* Next blocks belonging to this section */}
                    {block.slice(block.indexOf('\n') + 1) || ''}
                  </div>
                );
              }

              // H3 Headings  
              if (block.startsWith('### ')) {
                const title = block.replace('### ', '');
                return (
                  <h3 key={i} className="font-cinzel text-2xl text-[#C9A84C] mt-8 mb-4">
                    {title}
                  </h3>
                );
              }

              // Blockquotes
              if (block.startsWith('> ')) {
                const quote = block.replace('> ', '').slice(1);
                return (
                  <blockquote 
                    key={i} 
                    className="border-l-4 border-[#C9A84C] bg-[#12121A]/50 p-6 italic text-[#E8E0F0] my-8 rounded-r-lg"
                  >
                    {quote}
                  </blockquote>
                );
              }

              // Lists
              if (block.startsWith('- ') || block.startsWith('• ') || /^\d+\./.test(block)) {
                const items = block.split('\n').filter(line => line.trim());
                return (
                  <ul key={i} className="space-y-2 my-6 list-disc pl-6" style={{ color: '#9B93AB' }}>
                    {items.map((item, idx) => (
                      <li key={idx} className="marker:text-[#7B5EA7]">
                        {item.startsWith('- ') || item.startsWith('• ') ? item.slice(2) : item}
                      </li>
                    ))}
                  </ul>
                );
              }

              // Strong text (simplified - would use proper MDX parser in production)
              const processedPara = block
                .replace(/__(.+?)__/g, '<strong>$1</strong>')
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

              return (
                <p 
                  key={i} 
                  className="text-lg leading-relaxed mb-6"
                  dangerouslySetInnerHTML={{ __html: processedPara }}
                />
              );
            })}
          </div>

          {/* "ASK THE ORACLE" CTA */}
          <section className="mt-16 p-8 glass-card rounded-2xl border border-[#7B5EA7]/20 text-center relative overflow-hidden bg-[#12121A]/60 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#7B5EA7]/10 to-transparent animate-pulse" />
            <h4 className="font-cinzel text-2xl text-[#E8E0F0] mb-4 relative z-10">
              <span className="text-[#C9A84C]">{post.tradition}</span> Oracle Awaits
            </h4>
            <p className="text-[#9B93AB] mb-8 max-w-md mx-auto relative z-10">
              Deepen your inquiry. Consult the ancient wisdom directly.
            </p>
            <a 
              href={`/chat?bot=${post.tradition.toLowerCase()}`} 
              className="inline-block bg-[#7B5EA7] text-[#E8E0F0] px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#7B5EA7]/30 relative z-10"
            >
              Consult the Oracle
            </a>
          </section>
        </article>

        {/* TOC SIDEBAR (Desktop Only) */}
        <aside className="hidden lg:block">
          <div ref={tocRef} className="sticky top-24 space-y-8">
            
            {/* Table of Contents */}
            {headings.length > 0 && (
              <div className="group">
                <h5 className="text-[10px] uppercase tracking-widest text-[#5A5468] mb-4 border-b border-white/5 pb-2">
                  Table of Contents
                </h5>
                <nav className="flex flex-col gap-2 text-sm">
                  {headings.map((heading) => (
                    <button
                      key={heading.id}
                      onClick={() => scrollToSection(heading.id)}
                      className={`text-left transition-all duration-200 py-1.5 px-2 rounded-md ${
                        activeSection === heading.id 
                          ? 'text-[#C9A84C] bg-[#7B5EA7]/10 font-semibold' 
                          : 'text-[#9B93AB] hover:text-[#C9A84C] hover:bg-white/5'
                      }`}
                    >
                      {heading.text}
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div>
                <h5 className="text-[10px] uppercase tracking-widest text-[#5A5468] mb-4 border-b border-white/5 pb-2">
                  Further Reading
                </h5>
                <div className="flex flex-col gap-4">
                  {relatedPosts.map((related) => (
                    <a 
                      key={related.slug} 
                      href={`/blog/${related.slug}`}
                      className="group block p-3 rounded-lg hover:bg-white/5 transition-all"
                    >
                      <div className="text-[#E8E0F0] group-hover:text-[#C9A84C] transition-colors text-sm mb-1 line-clamp-2">
                        {related.title}
                      </div>
                      <div className="text-[8px] uppercase tracking-widest text-[#5A5468]">
                        {new Date(related.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {related.readTime} min
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* GLOBAL STYLES FOR CINZEL FONT & ANIMATIONS */}
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

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #0A0A0F;
        }

        ::-webkit-scrollbar-thumb {
          background: #5A5468;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #7B5EA7;
        }

        /* Line clamp utility */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
