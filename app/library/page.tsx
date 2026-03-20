'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSiteI18n } from '@/lib/site-i18n'
import { useAuth } from '@/components/auth/AuthProvider'

type Tradition = 'Tao' | 'Tarot' | 'Tantra' | 'Entheogens' | 'Sufism' | 'Dream' | 'Qabalah' | 'Spiritual Sovereignty' | 'All'

interface Book {
  id: string
  title: string
  author: string
  tradition: Exclude<Tradition, 'All'>
  access: 'Free' | 'Adept+'
  url: string
  type: 'embed' | 'link'
  color: string
}

const BOOKS: Book[] = [
  // Tao
  { id: 'ttc', title: 'Tao Te Ching', author: 'Lao Tzu', tradition: 'Tao', access: 'Free', url: 'taotechingbylaot00laotuoft', type: 'embed', color: '#4ECDC4' },
  { id: 'zz', title: 'Zhuangzi', author: 'Chuang Tzu', tradition: 'Tao', access: 'Free', url: 'chuangtzu00zhua', type: 'embed', color: '#4ECDC4' },
  { id: 'ic', title: 'I Ching', author: 'Anonymous', tradition: 'Tao', access: 'Free', url: 'ichingorbookofch00wilh', type: 'embed', color: '#4ECDC4' },
  
  // Tarot
  { id: 'pfc', title: 'The Tarot', author: 'Paul Foster Case', tradition: 'Tarot', access: 'Adept+', url: 'tarotkeytowisdom00case', type: 'embed', color: '#7B5EA7' },
  { id: 'bot', title: 'The Book of Thoth', author: 'Aleister Crowley', tradition: 'Tarot', access: 'Adept+', url: 'bookofthothshort00crow', type: 'embed', color: '#7B5EA7' },
  { id: 'rp', title: 'Pictorial Key to the Tarot', author: 'A.E. Waite', tradition: 'Tarot', access: 'Free', url: 'pictorialkeytota00wait', type: 'embed', color: '#7B5EA7' },
  
  // Tantra
  { id: 'osho', title: 'Tantra: The Supreme Understanding', author: 'Osho', tradition: 'Tantra', access: 'Adept+', url: 'tantrasupremeund00osho', type: 'embed', color: '#C9A84C' },
  { id: 'sp', title: 'The Serpent Power', author: 'Arthur Avalon', tradition: 'Tantra', access: 'Adept+', url: 'serpentpowertatt00wooduoft', type: 'embed', color: '#C9A84C' },
  { id: 'shakti', title: 'Shakti and Shakta', author: 'Arthur Avalon', tradition: 'Tantra', access: 'Free', url: 'shaktishakta00wood', type: 'embed', color: '#C9A84C' },
  
  // Entheogens
  { id: 'pe', title: 'The Psychedelic Experience', author: 'Leary/Metzner/Alpert', tradition: 'Entheogens', access: 'Free', url: 'psychedelicexper00lear', type: 'embed', color: '#2D5A4A' },
  { id: 'dop', title: 'The Doors of Perception', author: 'Aldous Huxley', tradition: 'Entheogens', access: 'Free', url: 'doorsofperceptio00huxl_0', type: 'embed', color: '#2D5A4A' },
  { id: 'pog', title: 'The Peyote Cult', author: 'Weston La Barre', tradition: 'Entheogens', access: 'Adept+', url: 'peyotecult00laba', type: 'embed', color: '#2D5A4A' },

  // Sufism
  { id: 'masnavi', title: 'The Masnavi', author: 'Rumi', tradition: 'Sufism', access: 'Free', url: 'masnaviofrumij01rumi', type: 'embed', color: '#E05C5C' },
  { id: 'sufis', title: 'The Sufis', author: 'Idries Shah', tradition: 'Sufism', access: 'Adept+', url: 'sufis00idri', type: 'embed', color: '#E05C5C' },
  { id: 'bezels', title: 'The Bezels of Wisdom', author: 'Ibn al-Arabi', tradition: 'Sufism', access: 'Adept+', url: 'bezelsofwisdom0000ibna', type: 'embed', color: '#E05C5C' },

  // Dream
  { id: 'lucid', title: 'Lucid Dreaming', author: 'Stephen LaBerge', tradition: 'Dream', access: 'Free', url: 'luciddreaming00labeg', type: 'embed', color: '#5C8FE0' },
  { id: 'astral', title: 'Projection of the Astral Body', author: 'Muldoon', tradition: 'Dream', access: 'Adept+', url: 'astralprojection00muldo', type: 'embed', color: '#5C8FE0' },
  { id: 'exploring', title: 'Exploring Lucid Dreaming', author: 'Stephen LaBerge', tradition: 'Dream', access: 'Adept+', url: 'exploringworldof00labe', type: 'embed', color: '#5C8FE0' },

  // Qabalah
  { id: 'unveiled', title: 'The Kabbalah Unveiled', author: 'S.L. Mathers', tradition: 'Qabalah', access: 'Free', url: 'kabbalahunveiled00math', type: 'embed', color: '#E05CE0' },
  { id: 'mystical', title: 'The Mystical Qabalah', author: 'Dion Fortune', tradition: 'Qabalah', access: 'Adept+', url: 'mysticalqabalah00fort', type: 'embed', color: '#E05CE0' },
  { id: 'ezra', title: 'The Zohar', author: 'Moses de Leon', tradition: 'Qabalah', access: 'Adept+', url: 'zohar0000deleo', type: 'embed', color: '#E05CE0' },

  // Spiritual Sovereignty
  { id: 'kybalion', title: 'The Kybalion', author: 'Three Initiates', tradition: 'Spiritual Sovereignty', access: 'Free', url: 'kybalion00threeuoft', type: 'embed', color: '#C9A84C' },
  { id: 'gnostic', title: 'The Gnostic Bible', author: ' Bentley Layton', tradition: 'Spiritual Sovereignty', access: 'Free', url: 'gnosticbible00pagel', type: 'embed', color: '#C9A84C' },
  { id: 'corpus', title: 'The Corpus Hermeticum', author: 'Hermes Trismegistus', tradition: 'Spiritual Sovereignty', access: 'Adept+', url: 'corpushermeticum00bjohnuoft', type: 'embed', color: '#C9A84C' },
  { id: 'selfmastery', title: 'The Law and the Mastery of Self', author: 'Charles F. Haanel', tradition: 'Spiritual Sovereignty', access: 'Adept+', url: 'selfmasterylaw00hilluoft', type: 'embed', color: '#C9A84C' },
  { id: 'sevenbreaths', title: 'The Seven Breaths of the Soul', author: 'Leonard LeRoy', tradition: 'Spiritual Sovereignty', access: 'Free', url: 'sevenbreathser00elil', type: 'embed', color: '#C9A84C' },
]

export default function LibraryPage() {
  const [activeFilter, setActiveFilter] = useState<Tradition>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const { t } = useSiteI18n()
  const { isAuthenticated, plan } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const filteredBooks = BOOKS.filter(book => {
    const matchesFilter = activeFilter === 'All' || book.tradition === activeFilter
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         book.author.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const canAccess = (book: Book) => {
    if (book.access === 'Free') return true
    return plan === 'seeker' || plan === 'full'
  }

  if (!mounted) return <div className="min-h-screen bg-[#0A0A0F]" />

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0] font-sans antialiased pb-20">
      {/* Hero Section */}
      <section className="h-[400px] relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f2e] to-[#0A0A0F] opacity-50" />
        <div className="relative z-10 text-center px-6 space-y-4">
          <h1 className="font-serif text-6xl md:text-8xl text-[var(--primary-gold)] tracking-tighter drop-shadow-2xl">Vault of Arcana</h1>
          <p className="text-[#9B93AB] text-xl font-light tracking-wide uppercase">{t('nav.library')}</p>
        </div>
      </section>

      <div className="sticky top-[72px] z-40 mx-4 lg:mx-6 -mt-12 p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-white/5 bg-[rgba(10,10,15,0.85)] backdrop-blur-2xl rounded-3xl shadow-2xl">
        <div className="flex flex-wrap items-center gap-2">
          {(['All', 'Tao', 'Tarot', 'Tantra', 'Entheogens', 'Sufism', 'Dream', 'Qabalah', 'Spiritual Sovereignty'] as Tradition[]).map((trad) => (
            <button
              key={trad}
              onClick={() => setActiveFilter(trad)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
                activeFilter === trad 
                ? 'bg-[var(--primary-purple)] text-white' 
                : 'text-[#9B93AB] hover:text-[#E8E0F0] hover:bg-white/5'
              }`}
            >
              {trad}
            </button>
          ))}
        </div>
        
        <div className="w-full md:w-80 relative">
          <input 
            type="text"
            placeholder={t('hero.search') || 'Search the archives...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0A0F]/50 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-[var(--primary-purple)] transition-colors"
          />
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredBooks.map((book) => (
            <div 
              key={book.id}
              className="glass-card rounded-3xl overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_0_40px_rgba(123,94,167,0.1)] hover:-translate-y-1 border border-white/5 group"
            >
              <div 
                className="h-64 flex items-center justify-center relative overflow-hidden"
                style={{ background: `linear-gradient(to bottom right, ${book.color}33, #0A0A0F)` }}
              >
                 <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
                 <div className="text-white opacity-20 transform group-hover:scale-110 transition-transform duration-700">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                      {book.tradition === 'Tao' && <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>}
                      {book.tradition === 'Tarot' && <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>}
                      {book.tradition === 'Tantra' && <path d="M12 2L1 21h22L12 2zm0 4.12l8.34 14.88H3.66L12 6.12z"/>}
                      {book.tradition === 'Entheogens' && <path d="M17 8C8 8 3 13 3 13s5 5 14 5c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM5.5 13c1.38 0 2.5 1.12 2.5 2.5S6.88 18 5.5 18 3 16.88 3 15.5 4.12 13 5.5 13z"/>}
                      {['Sufism', 'Dream', 'Qabalah'].includes(book.tradition) && <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>}
                    </svg>
                 </div>
                 <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0A0A0F] to-transparent">
                   <h3 className="font-serif text-xl text-[#E8E0F0] leading-tight line-clamp-2">{book.title}</h3>
                 </div>
              </div>

              <div className="p-8 flex flex-col flex-1">
                <p className="text-[#9B93AB] text-sm italic mb-6 line-clamp-1">{book.author}</p>
                <div className="mt-auto flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-[10px] uppercase px-3 py-1 rounded-full font-bold tracking-[0.2em]"
                      style={{ backgroundColor: `${book.color}22`, color: book.color }}
                    >
                      {book.tradition}
                    </span>
                    {!canAccess(book) && (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--primary-gold)] uppercase tracking-widest">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Adept+
                      </span>
                    )}
                  </div>
                  
                  {canAccess(book) ? (
                    <button
                      onClick={() => book.type === 'embed' ? setSelectedBook(book) : window.open(book.url, '_blank')}
                      className="w-full rounded-2xl bg-white/5 hover:bg-white/10 py-3.5 text-sm font-bold text-[#E8E0F0] transition-all border border-white/5"
                    >
                      {t('library.read') || 'Begin Reading'}
                    </button>
                  ) : (
                    <Link
                      href={isAuthenticated ? "/pricing" : "/signup"}
                      className="w-full rounded-2xl bg-[var(--primary-gold)] hover:bg-[#B1933E] py-3.5 text-sm font-bold text-[#0A0A0F] text-center shadow-[0_0_30px_rgba(201,168,76,0.15)] transition-all"
                    >
                      {t('library.unlock') || 'Unlock Archive'}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Reader Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-fade-in">
          <div className="absolute inset-0 bg-[#0A0A0F]/95 backdrop-blur-3xl" onClick={() => setSelectedBook(null)} />
          <div className="relative z-10 w-full h-full bg-[#12121A] border border-white/5 rounded-[40px] overflow-hidden flex flex-col shadow-2xl animate-fade-in-up">
            <header className="px-10 py-6 flex items-center justify-between border-b border-white/5 bg-[#1A1A28]/50">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedBook.color }} />
                <h2 className="font-serif text-2xl text-[#E8E0F0] line-clamp-1">{selectedBook.title}</h2>
              </div>
              <button onClick={() => setSelectedBook(null)} className="p-3 bg-white/5 rounded-full text-[#9B93AB] hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>
            <div className="flex-1 bg-white">
              <iframe src={`https://archive.org/embed/${selectedBook.url}`} width="100%" height="100%" frameBorder="0" allowFullScreen className="w-full h-full" />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  )
}
