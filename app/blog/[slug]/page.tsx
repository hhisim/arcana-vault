import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { MDXComponents } from '@/components/mdx-components';
import { posts } from '@/lib/posts';
import { promises as fs } from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import React from 'react';

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

async function getPostContent(slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`);
    console.log('--- PATH DEBUG ---');
    console.log('Current CWD:', process.cwd());
    console.log('Searching for:', filePath);
    
    // Check file existence
    try {
      await fs.access(filePath);
      console.log('File found SUCCESSFULLY at:', filePath);
    } catch (e) {
      console.error('CRITICAL: File NOT FOUND at path:', filePath);
    }
    
    const source = await fs.readFile(filePath, 'utf8');
    return source;
  } catch (error) {
    console.error('FILESYSTEM ERROR:', error);
    return null;
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) {
    console.error('ROUTING ERROR: Slug not found in registry:', params.slug);
    notFound();
  }

  const source = await getPostContent(params.slug);
  if (!source) {
    console.error('CONTENT ERROR: No source found for slug:', params.slug);
    notFound();
  }

  try {
    const { content: mdxContent } = await compileMDX({ 
      source, 
      components: MDXComponents, 
      options: { parseFrontmatter: true } 
    });

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
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="prose prose-invert prose-lg max-w-none">
            {mdxContent}
          </div>
        </div>
      </article>
    );
  } catch (compileError) {
    console.error('MDX COMPILATION ERROR:', compileError);
    return (
      <div className="min-h-screen bg-black text-red-500 p-20">
        <h1>MDX Compile Failure</h1>
        <pre>{JSON.stringify(compileError, null, 2)}</pre>
      </div>
    );
  }
}
