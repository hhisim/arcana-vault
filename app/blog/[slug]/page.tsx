import { promises as fs } from 'fs';
import path from 'path';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';
import { posts } from '@/lib/posts';

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  try {
    const filePath = path.join(process.cwd(), 'content', 'blog', `${params.slug}.mdx`);
    const fileContent = await fs.readFile(filePath, 'utf8');

    // Robust frontmatter splitting
    const parts = fileContent.split('---');
    if (parts.length < 3) {
      throw new Error('Invalid frontmatter format');
    }

    const frontmatter = parts[1];
    const body = parts.slice(2).join('---').trim();

    // Manual extraction of title and tradition for the header
    const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/);
    const traditionMatch = frontmatter.match(/tradition:\s*["']?([^"'\n]+)["']?/);
    
    const title = titleMatch ? titleMatch[1] : 'Untitled Scroll';
    const tradition = traditionMatch ? traditionMatch[1] : 'Ancient';

    return (
      <article className="min-h-screen bg-[#0A0A0F]">
        {/* Header */}
        <header className="relative py-24 px-6 border-b border-[rgba(255,255,255,0.06)] bg-gradient-to-b from-[#12121A] to-[#0A0A0F]">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1 rounded-full bg-[#7B5EA7]/20 text-[#C9A84C] text-xs font-bold uppercase tracking-[0.2em] mb-6 border border-[#7B5EA7]/30">
              {tradition} tradition
            </span>
            <h1 className="font-cinzel text-4xl md:text-6xl text-[#E8E0F0] mb-8 leading-tight">
              {title}
            </h1>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto opacity-50" />
          </div>
        </header>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-20">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            components={{
              h2: ({node, ...props}) => <h2 className="text-3xl font-cinzel text-[#E8E0F0] mt-16 mb-8 border-b border-white/5 pb-2" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-2xl font-cinzel text-[#C9A84C] mt-10 mb-6" {...props} />,
              p: ({node, ...props}) => <p className="text-lg text-[#9B93AB] leading-relaxed mb-8" {...props} />,
              em: ({node, ...props}) => <em className="italic text-[#E8E0F0]" {...props} />,
              strong: ({node, ...props}) => <strong className="text-[#E8E0F0] font-semibold" {...props} />,
              hr: () => <hr className="border-[rgba(255,255,255,0.1)] my-16" />,
              blockquote: ({node, ...props}) => (
                <blockquote className="border-l-4 border-[#C9A84C] bg-[#12121A]/50 p-8 my-10 italic text-[#E8E0F0] rounded-r-lg shadow-inner" {...props} />
              ),
              ul: ({node, ...props}) => <ul className="text-[#9B93AB] space-y-4 my-8 list-disc pl-8 marker:text-[#7B5EA7]" {...props} />,
              ol: ({node, ...props}) => <ol className="text-[#9B93AB] space-y-4 my-8 list-decimal pl-8 marker:text-[#C9A84C]" {...props} />,
              a: ({node, ...props}) => <a className="text-[#C9A84C] hover:underline transition-colors font-medium" {...props} />,
            }}
          >
            {body}
          </ReactMarkdown>
        </div>

        {/* Oracle CTA */}
        <div className="max-w-3xl mx-auto px-6 pb-32">
          <div className="glass-card p-12 text-center rounded-3xl border border-[#7B5EA7]/20 bg-gradient-to-br from-[#12121A] to-[#0A0A0F] shadow-2xl">
            <h3 className="font-cinzel text-3xl text-[#E8E0F0] mb-6">Continue the Inquiry</h3>
            <p className="text-[#9B93AB] mb-10 text-lg">Deepen your understanding with the {tradition} Oracle</p>
            <a 
              href={`/chat?bot=${tradition.toLowerCase()}`} 
              className="inline-flex items-center justify-center px-10 py-4 bg-[#C9A84C] text-[#0A0A0F] font-bold rounded-xl hover:scale-105 hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] transition-all duration-300 uppercase tracking-widest text-sm"
            >
              Consult the Oracle
            </a>
          </div>
        </div>
        
        <style jsx global>{`
          .font-cinzel { font-family: 'Cinzel', serif; }
          .glass-card { background: rgba(18, 18, 26, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); }
        `}</style>
      </article>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    notFound();
  }
}
