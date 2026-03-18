'use client';

import React from 'react';

const MOCK_POST = {
  title: "The Uncarved Block: Applying Wu Wei to Modern Decision Fatigue",
  slug: "what-tao-te-ching-says-about-uncertainty",
  tradition: "tao",
  publishedAt: "2025-03-15",
  excerpt: "In an era of relentless optimization, the ancient Taoist concept of non-action offers a radical strategy for high-stakes decision making.",
  readTime: 8,
  author: "The Tao Oracle",
  content: "Restoring the flow of ancient wisdom into modern systems..."
};

export default function BlogPostPage() {
  const post = MOCK_POST;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0] pb-32">
       <nav className="max-w-4xl mx-auto px-6 pt-32 pb-6">
        <a href="/blog" className="text-[#9B93AB] hover:text-[#C9A84C] transition-colors text-sm flex items-center gap-2 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to The Scroll
        </a>
      </nav>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16">
        <article className="prose prose-invert max-w-none">
          <header className="mb-12">
            <div className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] mb-4 font-bold">{post.tradition} Tradition</div>
            <h1 className="font-cinzel text-4xl md:text-6xl text-[#E8E0F0] leading-tight mb-6">{post.title}</h1>
            <div className="flex items-center gap-4 text-xs tracking-widest uppercase text-[#5A5468]">
              <span>By {post.author}</span>
              <span className="w-1 h-1 bg-[#5A5468] rounded-full" />
              <span>{post.publishedAt}</span>
              <span className="w-1 h-1 bg-[#5A5468] rounded-full" />
              <span>{post.readTime} min read</span>
            </div>
          </header>

          <div className="text-[#9B93AB] text-lg leading-relaxed space-y-8">
            <p className="first-letter:text-5xl first-letter:font-cinzel first-letter:text-[#C9A84C] first-letter:mr-3 first-letter:float-left">
              Most people quote the first chapter of the Tao Te Ching—"The Tao that can be told is not the eternal Tao"—as a mystical disclaimer. But for those navigating the high-velocity uncertainty of modern life, the Tao is less of a riddle and more of an operating system.
            </p>
            
            <h3 className="text-[#E8E0F0] font-cinzel text-2xl mt-12 mb-4">The Paradox of Effort</h3>
            <p>
              The core of Taoist wisdom lies in *Wu Wei*, often mistranslated as "doing nothing." In reality, Wu Wei is "effortless action" or "action in alignment with the flow of the universe." Think of a world-class athlete in a state of flow; they aren't "doing nothing," but they aren't forcing the result either.
            </p>
            
            <p>
              In our current culture of "hustle" and constant optimization, we are suffering from collective decision fatigue. We attempt to carve the "Uncarved Block" (Pu) into increasingly specific shapes before we even understand the grain of the wood. When we force a product launch, a career pivot, or a personal relationship based on frantic ego-will rather than timing, we create friction.
            </p>

            <h3 className="text-[#E8E0F0] font-cinzel text-2xl mt-12 mb-4">Chapter 67: The Three Treasures</h3>
            <p>
              Lao Tzu speaks of three treasures: Compassion, Frugality, and Humility. In a startup context, these translate directly:
              1. **Compassion:** Empathy for the user over the feature set.
              2. **Frugality:** Conservation of capital and mental energy.
              3. **Humility:** The "leading by following" mentioned in Chapter 67. The best leaders are those whose presence is barely felt, allowing the work to emerge from the team naturally.
            </p>
          </div>

          <section className="mt-20 p-12 glass-card rounded-2xl border border-[#7B5EA7]/20 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#7B5EA7]/5 to-transparent" />
             <h4 className="font-cinzel text-2xl mb-4 relative z-10">Deepen your understanding</h4>
             <p className="text-[#9B93AB] mb-8 relative z-10">Ask the Tao Oracle a specific question about applying Wu Wei to your current path.</p>
             <a href="/chat" className="inline-block bg-[#7B5EA7] text-white px-8 py-3 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 relative z-10 shadow-xl shadow-[#7B5EA7]/20">Consult the Oracle</a>
          </section>
        </article>

        <aside className="hidden lg:block">
           <div className="sticky top-32 space-y-12">
             <div>
               <h5 className="text-[10px] uppercase tracking-widest text-[#5A5468] mb-4 border-b border-white/5 pb-2">Table of Contents</h5>
               <nav className="flex flex-col gap-3 text-sm text-[#9B93AB]">
                 <a href="#" className="hover:text-[#C9A84C] transition-colors">The Paradox of Effort</a>
                 <a href="#" className="hover:text-[#C9A84C] transition-colors">The Three Treasures</a>
                 <a href="#" className="hover:text-[#C9A84C] transition-colors">Practicing the Uncarved Block</a>
               </nav>
             </div>

             <div>
               <h5 className="text-[10px] uppercase tracking-widest text-[#5A5468] mb-4 border-b border-white/5 pb-2">Related Scrolls</h5>
               <div className="flex flex-col gap-6">
                  <a href="#" className="group">
                    <div className="text-xs text-[#E8E0F0] group-hover:text-[#C9A84C] transition-colors mb-2">I Ching: The Binary Code of Ancient China</div>
                    <div className="text-[9px] uppercase tracking-widest text-[#5A5468]">5 min read</div>
                  </a>
                  <a href="#" className="group">
                    <div className="text-xs text-[#E8E0F0] group-hover:text-[#C9A84C] transition-colors mb-2">Zhuangzi's Butterfly and Quantum States</div>
                    <div className="text-[9px] uppercase tracking-widest text-[#5A5468]">7 min read</div>
                  </a>
               </div>
             </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
