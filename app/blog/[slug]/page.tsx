'use client';

import React, { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { posts } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = posts.find((p) => p.slug === slug);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      if (!slug) return;
      try {
        const response = await fetch(`/api/blog-content?slug=${slug}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setContent(data.content);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    }
    fetchContent();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-[#9B93AB] font-cinzel text-xl">
      Summoning Scroll...
    </div>
  );
  if (!post || !content) return notFound();

  return (
    <article className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0]">
      <header className="py-24 px-6 border-b border-white/5 text-center">
        <span className="inline-block px-3 py-1 bg-[#7B5EA7]/20 text-[#7B5EA7] text-xs uppercase tracking-widest rounded-full mb-6 italic">
          {post.tradition} Tradition
        </span>
        <h1 className="font-cinzel text-4xl md:text-6xl mb-6">{post.title}</h1>
        <div className="text-[#9B93AB] text-sm italic">
          {post.author} • {post.publishedAt} • {post.readTime}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({node, ...props}) => <h2 className="text-3xl font-cinzel text-[#E8E0F0] mt-12 mb-6" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-2xl font-cinzel text-[#C9A84C] mt-8 mb-4" {...props} />,
            p: ({node, ...props}) => <p className="text-lg text-[#9B93AB] leading-relaxed mb-6" {...props} />,
            em: ({node, ...props}) => <em className="italic text-[#E8E0F0]" {...props} />,
            strong: ({node, ...props}) => <strong className="text-[#E8E0F0] font-semibold" {...props} />,
            hr: () => <hr className="border-white/10 my-12" />,
            blockquote: ({node, ...props}) => (
              <blockquote className="border-l-4 border-[#C9A84C] bg-[#12121A]/50 p-6 my-8 italic text-[#E8E0F0] rounded-r-xl" {...props} />
            ),
            ul: ({node, ...props}) => <ul className="text-[#9B93AB] space-y-3 my-6 list-disc pl-6 marker:text-[#7B5EA7]" {...props} />,
            ol: ({node, ...props}) => <ol className="text-[#9B93AB] space-y-3 my-6 list-decimal pl-6 marker:text-[#C9A84C]" {...props} />,
            a: ({node, ...props}) => <a className="text-[#C9A84C] hover:underline" {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-24">
        <div className="glass-card p-12 text-center rounded-2xl border border-white/5">
          <h3 className="font-cinzel text-2xl mb-4">Continue the Inquiry</h3>
          <p className="text-[#9B93AB] mb-8 italic">Ask the {post.tradition} Oracle your next question.</p>
          <a href={`/chat?bot=${post.tradition.toLowerCase()}`} className="inline-block px-10 py-4 bg-[#C9A84C] text-[#0A0A0F] font-bold rounded-lg hover:scale-105 transition-all">
            Consult the Oracle
          </a>
        </div>
      </div>
    </article>
  );
}
