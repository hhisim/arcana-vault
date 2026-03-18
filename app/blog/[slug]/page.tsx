'use server';

import React from 'react';
import { POSTS } from '@/lib/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { MDXComponents } from '@/components/mdx-components';
import { compileMDX } from 'next-mdx-remote/rsc';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS.find(p => p.slug === params.slug) || POSTS[0];

  const { content } = await compileMDX({ 
    source: post.content, 
    components: MDXComponents, 
    options: { parseFrontmatter: true } 
  });

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0] pb-32">
      {/* ... Hero ... */}
      <div className="relative min-h-[40vh] flex items-center justify-center border-b border-white/5">
        <h1 className="font-cinzel text-5xl">{post.title}</h1>
      </div>
      
      <article className="max-w-3xl mx-auto px-6 py-16 prose prose-invert font-cinzel text-base">
        {content}
      </article>
      
      {/* ... rest ... */}
    </div>
  );
}
