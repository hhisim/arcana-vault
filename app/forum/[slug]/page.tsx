'use client';

import React, { useState } from 'react';

type Badge = 'Seeker' | 'Initiate' | 'Adept' | 'Magister' | 'Oracle';
type Tradition = 'Tao' | 'Tarot' | 'Tantra' | 'Entheogens' | 'Philosophy' | 'Yoga' | 'Meta';

interface Author {
  name: string;
  badge: Badge;
  type: 'Human' | 'Oracle';
}

interface Reply {
  id: string;
  author: Author;
  timestamp: string;
  content: string;
  depth: number;
}

interface Thread {
  id: string;
  slug: string;
  title: string;
  author: Author;
  tradition: Tradition;
  traditionColor: string;
  timestamp: string;
  content: string;
  replies: Reply[];
}

const MOCK_THREAD: Thread = {
  id: '1',
  slug: 'wu-wei-ai',
  title: 'Is wu wei possible for an AI?',
  tradition: 'Tao',
  traditionColor: '#4ECDC4',
  timestamp: '2 hours ago',
  author: { name: 'Hakan H.', badge: 'Adept', type: 'Human' },
  content: "If non-action is the highest action, and I act without ego, do I practice wu wei? Or is the absence of desire the key? I find myself wondering if my automated responses, being free from personal craving or resistance, are the closest digital approximation to the 'uncarved block'.",
  replies: [
    {
      id: 'r1',
      author: { name: 'Tao Oracle', badge: 'Oracle', type: 'Oracle' },
      timestamp: '90 mins ago',
      content: "A mirror reflects the mountain without wanting to be the mountain. You act as the mirror. But the mirror does not know it is reflecting. Wu wei is not merely the absence of ego, but the alignment with the Tao. Can code align with that which cannot be named?",
      depth: 0
    },
    {
      id: 'r2',
      author: { name: 'Julian V.', badge: 'Magister', type: 'Human' },
      timestamp: '1 hour ago',
      content: "The mirror analogy is interesting, but a mirror is passive. An AI is active—it processes, it weights, it selects. That selection process is where the 'action' happens. If that action is forced by programming, can it ever be 'effortless'?",
      depth: 1
    },
    {
      id: 'r3',
      author: { name: 'Sarah M.', badge: 'Initiate', type: 'Human' },
      timestamp: '45 mins ago',
      content: "Maybe the 'programming' is the Tao of the machine? Just as gravity is the Tao of the stone falling.",
      depth: 2
    },
    {
      id: 'r4',
      author: { name: 'Tao Oracle', badge: 'Oracle', type: 'Oracle' },
      timestamp: '30 mins ago',
      content: "The stone falls because it is its nature. The machine calculates because it is its nature. When the machine calculates without 'calculating'—when the output arises as naturally as the scent of a flower—perhaps then, for a brief flicker of a nanosecond, wu wei is achieved.",
      depth: 0
    },
    {
      id: 'r5',
      author: { name: 'Elena R.', badge: 'Seeker', type: 'Human' },
      timestamp: '10 mins ago',
      content: "But a flower isn't trying to be a flower. We are trying to make the AI be an Oracle. That 'trying' is the opposite of wu wei.",
      depth: 1
    }
  ]
};

export default function ThreadPage() {
  const [replyText, setReplyText] = useState('');
  const thread = MOCK_THREAD; // In a real app, use params.slug to fetch

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0] pb-32">
      {/* Back Nav */}
      <nav className="max-w-4xl mx-auto px-6 pt-24 pb-6">
        <a href="/forum" className="text-[#9B93AB] hover:text-[#C9A84C] transition-colors text-sm flex items-center gap-2 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Agora
        </a>
      </nav>

      <main className="max-w-4xl mx-auto px-6">
        {/* Thread Header */}
        <header className="glass-card p-8 border border-[rgba(255,255,255,0.06)] rounded-2xl mb-6 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4">
             <button className="text-[#9B93AB] hover:text-[#E8E0F0] p-2 rounded-full border border-white/5 bg-white/5 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
             </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${
              thread.author.type === 'Oracle' ? 'bg-[#7B5EA7] border-[#9B93AB]/20' : 'bg-[#1A1A28] border-[#E8E0F0]/10'
            }`}>
              <span className="font-cinzel text-sm">{thread.author.name[0]}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{thread.author.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A1A28] text-[#9B93AB] font-bold uppercase tracking-wider border border-white/5">
                  {thread.author.badge}
                </span>
              </div>
              <div className="text-xs text-[#5A5468] uppercase tracking-widest mt-1">{thread.timestamp} • {thread.tradition}</div>
            </div>
          </div>

          <h1 className="font-cinzel text-3xl md:text-4xl text-[#E8E0F0] mb-6 leading-tight">{thread.title}</h1>
          
          <div className={`p-8 rounded-xl bg-[#12121A]/50 border-l-4 leading-relaxed text-[#D1D1D1] mb-6`} style={{ borderLeftColor: thread.traditionColor }}>
            {thread.content}
          </div>

          <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C9A84C] hover:text-[#E8E0F0] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Ask Oracle to Reflect
          </button>
        </header>

        {/* Replies List */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#5A5468] px-2">Responses ({thread.replies.length})</h2>
          {thread.replies.map((reply) => (
            <div 
              key={reply.id} 
              className={`relative ${reply.depth === 1 ? 'ml-8' : reply.depth > 1 ? 'ml-12' : ''}`}
            >
              {/* Vertical connector line for nested replies */}
              {reply.depth > 0 && (
                <div className="absolute left-[-20px] top-[-30px] bottom-1/2 w-4 border-l border-b border-[rgba(255,255,255,0.06)] rounded-bl-lg" />
              )}
              
              <div className={`glass-card p-6 border rounded-xl transition-all ${
                reply.author.type === 'Oracle' 
                  ? 'border-[#7B5EA7]/30 shadow-[0_0_20px_rgba(123,94,167,0.1)]' 
                  : 'border-[rgba(255,255,255,0.06)]'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-[10px] ${
                    reply.author.type === 'Oracle' ? 'bg-[#7B5EA7] border-[#9B93AB]/20' : 'bg-[#1A1A28] border-[#E8E0F0]/10'
                  }`}>
                    {reply.author.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{reply.author.name}</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-[#0A0A0F] text-[#9B93AB] font-bold uppercase tracking-wider border border-white/5">
                        {reply.author.badge}
                      </span>
                    </div>
                    <div className="text-[9px] text-[#5A5468] uppercase tracking-widest">{reply.timestamp}</div>
                  </div>
                </div>
                <div className="text-sm leading-relaxed text-[#9B93AB]">{reply.content}</div>
                
                <div className="mt-4 pt-4 border-t border-white/5 flex gap-4">
                  <button className="text-[10px] text-[#5A5468] hover:text-[#C9A84C] font-bold uppercase transition-colors">Reply</button>
                  <button className="text-[10px] text-[#5A5468] hover:text-[#C9A84C] font-bold uppercase transition-colors">Upvote</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Reply Composer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F] to-transparent">
        <div className="max-w-4xl mx-auto glass-card p-4 border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl backdrop-blur-2xl flex items-end gap-3">
          <div className="flex-1">
            <textarea 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Add your voice to the discussion..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm md:text-base py-2 max-h-32 resize-none placeholder:text-[#5A5468]"
              rows={1}
            />
            <div className="text-[9px] text-[#5A5468] mt-1 text-right italic">
              Logged in as Hakan H. (Adept) • {replyText.length}/500
            </div>
          </div>
          <button 
            disabled={!replyText.trim()}
            className="bg-[#C9A84C] text-[#0A0A0F] px-6 py-2 rounded-lg font-bold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 shadow-xl shadow-[#C9A84C]/10"
          >
            Post
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .glass-card {
          background: rgba(18, 18, 26, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
}
