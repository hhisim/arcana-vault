import { promises as fs } from 'fs';
import path from 'path';
import React from 'react';
import matter from 'gray-matter';
import { posts } from '@/lib/posts';
import BlogContent from '@/components/BlogContent';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;
    const baseDir = path.join(process.cwd(), 'content', 'blog');
    
    // Load main content (English default)
    const filePath = path.join(baseDir, `${slug}.mdx`);
    const fileSource = await fs.readFile(filePath, 'utf8');
    const { data: frontmatter, content: body } = matter(fileSource);

    // Load translations if they exist
    const translations: { tr?: string; ru?: string } = {};
    
    try {
      const trPath = path.join(baseDir, `${slug}.tr.mdx`);
      const trSource = await fs.readFile(trPath, 'utf8');
      translations.tr = matter(trSource).content;
    } catch (e) {}

    try {
      const ruPath = path.join(baseDir, `${slug}.ru.mdx`);
      const ruSource = await fs.readFile(ruPath, 'utf8');
      translations.ru = matter(ruSource).content;
    } catch (e) {}

    const title = (frontmatter.title as string) || 'Untitled Scroll';
    const tradition = (frontmatter.tradition as string) || 'Ancient';

    return (
      <article className="min-h-screen bg-[#0A0A0F]">
        <header className="relative py-32 px-6 border-b border-white/5 bg-gradient-to-b from-[#12121A] to-[#0A0A0F]">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1 rounded-full bg-[#7B5EA7]/20 text-[#C9A84C] text-[10px] uppercase font-bold tracking-[0.3em] mb-8 border border-[#7B5EA7]/30">
              {tradition} tradition
            </span>
            <h1 className="font-cinzel text-5xl md:text-7xl text-[#E8E0F0] mb-10 leading-tight">
              {title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-[#9B93AB] text-xs uppercase tracking-[0.2em] opacity-60">
              <span>{(frontmatter.author as string) || 'The Oracle'}</span>
              <span className="w-1 h-1 bg-[#C9A84C] rounded-full" />
              <span>{(frontmatter.publishedAt as string) || 'Unknown Date'}</span>
              <span className="w-1 h-1 bg-[#C9A84C] rounded-full" />
              <span>{(frontmatter.readTime as string) || '8 min'} read</span>
            </div>
          </div>
        </header>

        {/* Content & Logic (Client Component) */}
        <BlogContent body={body} tradition={tradition} translations={translations} />
        
      </article>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <h1 className="font-cinzel text-4xl text-[#E8E0F0] mb-6">Scroll Not Found</h1>
          <p className="text-[#9B93AB] text-lg mb-10 italic">
            This specific archive of knowledge is currently being transcribed or has been moved to a deeper vault.
          </p>
          <a href="/blog" className="inline-block px-10 py-3 bg-[#7B5EA7]/20 text-[#C9A84C] border border-[#C9A84C]/30 rounded-lg hover:bg-[#C9A84C]/10 transition-all font-bold tracking-widest uppercase text-xs">
            Return to The Scroll
          </a>
        </div>
      </div>
    );
  }
}
