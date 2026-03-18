import { notFound } from 'next/navigation';
import { posts } from '@/lib/posts';
import { promises as fs } from 'fs';
import path from 'path';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MDXComponents } from '@/components/mdx-components';

async function getPostContent(slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`);
    return await fs.readFile(filePath, 'utf8');
  } catch (error) { return null; }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const source = await getPostContent(params.slug);
  if (!source) notFound();

  return (
    <article className="min-h-screen bg-[#0A0A0F]">
      <header className="relative py-24 px-6 border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-[#7B5EA7]/20 text-[#7B5EA7] text-sm mb-6 uppercase tracking-wider">
            {post.tradition}
          </span>
          <h1 className="font-cinzel text-4xl md:text-6xl text-[#E8E0F0] mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-[#9B93AB] text-sm italic">
            <span>{post.author}</span>
            <span>•</span>
            <span>{post.publishedAt}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={MDXComponents}
          >
            {source}
          </ReactMarkdown>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto px-6 pb-24">
        <div className="glass-card p-8 text-center rounded-2xl border border-[#7B5EA7]/20">
          <h3 className="font-cinzel text-2xl text-[#E8E0F0] mb-4">
            Continue the Inquiry
          </h3>
          <p className="text-[#9B93AB] mb-6">
            Deepen your understanding with the {post.tradition} Oracle
          </p>
          <a href={`/chat?bot=${post.tradition}`} className="inline-flex items-center justify-center px-8 py-4 bg-[#C9A84C] text-[#0A0A0F] font-bold rounded-lg hover:shadow-xl hover:shadow-[#C9A84C]/20 transition-all duration-300">
            Consult the Oracle
          </a>
        </div>
      </div>
    </article>
  );
}
