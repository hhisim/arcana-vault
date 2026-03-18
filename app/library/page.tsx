'use client';

import React, { useState } from 'react';
import { useLang } from '@/lib/lang-context';
import { SITEDICT } from '@/lib/dictionary';

type Tradition = 'Tao' | 'Tarot' | 'Tantra' | 'Entheogens' | 'All';

interface Book {
  id: string;
  title: string;
  author: string;
  tradition: Exclude<Tradition, 'All'>;
  access: 'Free' | 'Adept+';
  url: string;
  type: 'embed' | 'link';
  color: string;
}

const BOOKS: Book[] = [
  // Tao
  { id: 'ttc', title: 'Tao Te Ching', author: 'Lao Tzu', tradition: 'Tao', access: 'Free', url: 'taotechingbylaot00laotuoft', type: 'embed', color: '#4ECDC4' },
  { id: 'zz', title: 'Zhuangzi', author: 'Chuang Tzu', tradition: 'Tao', access: 'Free', url: 'chuangtzu00zhua', type: 'embed', color: '#4ECDC4' },
  { id: 'ic', title: 'I Ching', author: 'Anonymous', tradition: 'Tao', access: 'Free', url: 'ichingorbookofch00wilh', type: 'embed', color: '#4ECDC4' },
  // Tarot
  { id: 'pfc', title: 'The Tarot', author: 'Paul Foster Case', tradition: 'Tarot', access: 'Adept+', url: 'tarotkeytowisdom00case', type: 'embed', color: '#7B5EA7' },
  { id: 'bot', title: 'The Book of Thoth', author: 'Aleister Crowley', tradition: 'Tarot', access: 'Adept+', url: 'bookofthothshort00crow', type: 'embed', color: '#7B5EA7' },
  { id: 'rp', title: '78 Degrees of Wisdom', author: 'Rachel Pollack', tradition: 'Tarot', access: 'Adept+', url: 'https://www.google.com/search?q=78+Degrees+of+Wisdom+Rachel+Pollack', type: 'link', color: '#7B5EA7' },
  // Tantra
  { id: 'osho', title: 'Tantra: The Supreme Understanding', author: 'Osho', tradition: 'Tantra', access: 'Adept+', url: 'tantrasupremeund00osho', type: 'embed', color: '#C9A84C' },
  { id: 'sp', title: 'The Serpent Power', author: 'Arthur Avalon', tradition: 'Tantra', access: 'Adept+', url: 'serpentpowertatt00wooduoft', type: 'embed', color: '#C9A84C' },
  { id: 'am', title: 'Kundalini', author: 'Ajit Mookerjee', tradition: 'Tantra', access: 'Adept+', url: 'https://www.google.com/search?q=Kundalini+Ajit+Mookerjee', type: 'link', color: '#C9A84C' },
  // Entheogens
  { id: 'pe', title: 'The Psychedelic Experience', author: 'Leary/Metzner/Alpert', tradition: 'Entheogens', access: 'Free', url: 'psychedelicexper00lear', type: 'embed', color: '#2D5A4A' },
  { id: 'dop', title: 'The Doors of Perception', author: 'Aldous Huxley', tradition: 'Entheogens', access: 'Free', url: 'doorsofperceptio00huxl_0', type: 'embed', color: '#2D5A4A' },
  { id: 'pog', title: 'Plants of the Gods', author: 'Schultes/Hofmann', tradition: 'Entheogens', access: 'Adept+', url: 'https://www.google.com/search?q=Plants+of+the+Gods+Schultes+Hofmann', type: 'link', color: '#2D5A4A' },
];

export default function LibraryPage() {
  const [activeFilter, setActiveFilter] = useState<Tradition>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { lang, t } = useLang();

  const filteredBooks = BOOKS.filter(book => {
    const matchesFilter = activeFilter === 'All' || book.tradition === activeFilter;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0]">
      {/* Hero Section */}
      <section className="h-96 relative bg-gradient-to-b from-[#1a0f2e] to-[#0A0A0F] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="stars-container absolute inset-0 opacity-30">
             {/* Simple CSS Stars Generated via inline styles for zero deps */}
             {[...Array(50)].map((_, i) => (
               <div 
                 key={i} 
                 className="absolute rounded-full bg-white animate-pulse"
                 style={{
                   width: Math.random() * 3 + 'px',
                   height: Math.random() * 3 + 'px',
                   top: Math.random() * 100 + '%',
                   left: Math.random() * 100 + '%',
                   animationDelay: Math.random() * 5 + 's',
                   animationDuration: (Math.random() * 3 + 2) + 's'
                 }}
               />
             ))}
          </div>
        </div>
        
        <div className="relative z-10 text-center px-6">
          <h1 className="font-cinzel text-5xl md:text-7xl text-[#E8E0F0] tracking-widest drop-shadow-2xl">{t(SITEDICT.hero.title)}</h1>
          <p className="text-[#9B93AB] text-xl mt-4 font-light tracking-wide">{t(SITEDICT.hero.subtitle)}</p>
        </div>
      </section>

      <div className="sticky top-20 z-40 glass-card mx-4 lg:mx-6 -mt-8 p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-[rgba(255,255,255,0.06)] shadow-2xl">
        <div className="flex flex-wrap items-center gap-2">
          {(['All', 'Tao', 'Tarot', 'Tantra', 'Entheogens'] as Tradition[]).map((trad) => (
            <button
              key={trad}
              onClick={() => setActiveFilter(trad)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === trad 
                ? 'bg-[#7B5EA7] text-white shadow-[0_0_15px_rgba(123,94,167,0.4)]' 
                : 'text-[#9B93AB] hover:text-[#E8E0F0] bg-white/5'
              }`}
            >
              {trad === 'All' ? t(SITEDICT.hero.filterAll) : trad}
            </button>
          ))}
        </div>
        
        <div className="w-full md:w-80 relative">
          <input 
            type="text"
            placeholder={t(SITEDICT.hero.search)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0A0F]/50 border border-[rgba(255,255,255,0.06)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#7B5EA7]/50 transition-colors"
          />
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div 
              key={book.id}
              className="glass-card rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_0_30px_rgba(123,94,167,0.15)] hover:scale-[1.02] border border-[rgba(255,255,255,0.06)] group"
            >
              <div 
                className="h-56 flex items-center justify-center relative overflow-hidden"
                style={{ background: `linear-gradient(to bottom right, ${book.color}44, #0A0A0F)` }}
              >
                 <div className="text-white opacity-20 transform group-hover:scale-110 transition-transform duration-500">
                    {/* Placeholder large icon based on tradition */}
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                      {book.tradition === 'Tao' && <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>}
                      {book.tradition === 'Tarot' && <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>}
                      {book.tradition === 'Tantra' && <path d="M12 2L1 21h22L12 2zm0 4.12l8.34 14.88H3.66L12 6.12z"/>}
                      {book.tradition === 'Entheogens' && <path d="M17 8C8 8 3 13 3 13s5 5 14 5c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM5.5 13c1.38 0 2.5 1.12 2.5 2.5S6.88 18 5.5 18 3 16.88 3 15.5 4.12 13 5.5 13z"/>}
                    </svg>
                 </div>
                 <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0A0A0F] to-transparent">
                   <h3 className="font-cinzel text-lg text-[#E8E0F0] leading-tight truncate">{book.title}</h3>
                 </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <p className="text-[#9B93AB] text-sm italic">{book.author}</p>
                <div className="mt-auto flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-[10px] uppercase px-2 py-0.5 rounded font-bold tracking-widest"
                      style={{ backgroundColor: `${book.color}33`, color: book.color }}
                    >
                      {book.tradition}
                    </span>
                    <span className={`text-[10px] font-bold flex items-center gap-1 ${book.access === 'Free' ? 'text-teal-400' : 'text-[#C9A84C]'}`}>
                      {book.access === 'Adept+' && (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {book.access === 'Free' ? t(SITEDICT.library.free) : t(SITEDICT.library.adept)}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => book.type === 'embed' ? setSelectedBook(book) : window.open(book.url, '_blank')}
                    className={`mt-4 w-full py-2.5 rounded text-sm font-bold transition-all duration-200 outline-none ${
                      book.access === 'Free' 
                      ? 'bg-white/10 hover:bg-white/20 text-[#E8E0F0]' 
                      : 'bg-[#C9A84C] hover:bg-[#B1933E] text-[#0A0A0F] shadow-[0_0_20px_rgba(201,168,76,0.2)]'
                    }`}
                  >
                    {book.access === 'Free' ? t(SITEDICT.library.read) : t(SITEDICT.library.unlock)}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Reader Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-fade-in">
          <div 
            className="absolute inset-0 bg-[#0A0A0F]/95 backdrop-blur-xl"
            onClick={() => setSelectedBook(null)}
          />
          
          <div className="relative z-10 w-full max-w-5xl h-[90vh] bg-[#12121A] border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-fade-in-up">
            <header className="px-6 py-4 flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] bg-[#1A1A28]">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedBook.color }} />
                <h2 className="font-cinzel text-lg md:text-xl text-[#E8E0F0] truncate max-w-[200px] md:max-w-md">{selectedBook.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedBook(null)}
                className="p-2 text-[#9B93AB] hover:text-white transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>
            
            <div className="flex-1 bg-white">
              <iframe 
                src={`https://archive.org/embed/${selectedBook.url}`}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
