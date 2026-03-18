import { POSTS } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { MDXComponents } from '@/components/mdx-components';
import React from 'react';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS.find(p => p.slug === params.slug) || POSTS[0];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0] pb-32">
      <div className="relative min-h-[40vh] flex items-center justify-center border-b border-white/5">
        <h1 className="font-cinzel text-5xl">{post.title}</h1>
      </div>
      
      {/* Target prose here - MDXRemote will inject our styled MDXComponents */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        <MDXRemote 
          source={post.content} 
          components={MDXComponents} 
        />
      </article>
      
      <section className="mt-16 p-8 glass-card rounded-2xl border border-[#7B5EA7]/20 text-center max-w-3xl mx-auto">
        <h4 className="font-cinzel text-2xl text-[#E8E0F0] mb-4">Consult the Oracle</h4>
        <a href={`/chat?bot=${post.tradition.toLowerCase()}`} className="inline-block bg-[#7B5EA7] text-white px-8 py-3 rounded-lg font-bold">
          Consult the Oracle
        </a>
      </section>
    </div>
  );
}
