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
      try {
        const response = await fetch(`/api/blog-content?slug=${slug}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setContent(data.content);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchContent();
  }, [slug]);

  if (!post && !loading) notFound();
  if (loading) return <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-[#9B93AB] font-cinzel">Summoning Scroll...</div>;
  if (!content) return notFound();

  return (
    <article className="min-h-screen bg-[#0A0A0F]">
      <header className="relative py-24 px-6 border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-[#7B5EA7]/20 text-[#7B5EA7] text-sm mb-6 uppercase tracking-wider">
            {post?.tradition} Tradition
          </span>
          <h1 className="font-cinzel text-4xl md:text-6xl text-[#E8E0F0] mb-6 leading-tight">
            {post?.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-[#9B93AB] text-sm">
            <span>{post?.author}</span>
            <span>•</span>
            <span>{post?.publishedAt}</span>
            <span>•</span>
            <span>{post?.readTime}</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({node, ...props}) => <h2 className="text-3xl font-cinzel text-[#E8E0F0] mt-12 mb-6" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-2xl font-cinzel text-[#C9A84C] mt-8 mb-4" {...props} />,
              p: ({node, ...props}) => <p className="text-lg text-[#9B93AB] leading-relaxed mb-6" {...props} />,
              em: ({node, ...props}) => <em className="italic text-[#E8E0F0]" {...props} />,
              strong: ({node, ...props}) => <strong className="text-[#E8E0F0] font-semibold" {...props} />,
              hr: () => <hr className="border-[rgba(255,255,255,0.1)] my-12" />,
              blockquote: ({node, ...props}) => (
                <blockquote className="border-l-4 border-[#C9A84C] bg-[#12121A]/50 p-6 my-8 italic text-[#E8E0F0] rounded-r-lg" {...props} />
              ),
              ul: ({node, ...props}) => <ul className="text-[#9B93AB] space-y-3 my-6 list-disc pl-6 marker:text-[#7B5EA7]" {...props} />,
              ol: ({node, ...props}) => <ol className="text-[#9B93AB] space-y-3 my-6 list-decimal pl-6 marker:text-[#C9A84C]" {...props} />,
              a: ({node, ...props}) => <a className="text-[#C9A84C] hover:underline transition-colors" {...props} />,
              code: ({node, inline, ...props}: any) => inline ? (
                <code className="bg-[#12121A] px-2 py-1 rounded text-[#C9A84C] text-sm" {...props} />
              ) : (
                <pre className="bg-[#12121A] p-4 rounded-lg overflow-x-auto my-6"><code {...props} /></pre>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto px-6 pb-24">
        <div className="glass-card p-8 text-center rounded-2xl border border-[#7B5EA7]/20">
          <h3 className="font-cinzel text-2xl text-[#E8E0F0] mb-4">Continue the Inquiry</h3>
          <p className="text-[#9B93AB] mb-6">Deepen your understanding with the {post?.tradition} Oracle</p>
          <a href={`/chat?bot=${post?.tradition.toLowerCase()}`} className="inline-flex items-center justify-center px-8 py-4 bg-[#C9A84C] text-[#0A0A0F] font-bold rounded-lg hover:shadow-xl hover:shadow-[#C9A84C]/20 transition-all duration-300">
            Consult the Oracle
          </a>
        </div>
      </div>
    </article>
  );
}
