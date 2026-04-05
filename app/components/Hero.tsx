'use client';

import { useLang } from '@/lib/lang-context';
import { SITEDICT } from '@/lib/dictionary';

export default function Hero() {
  const { t } = useLang();

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden bg-gradient-to-b from-[#0A0A0F] via-[#1a1025] to-[#0A0A0F]">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Title */}
        <h1 className="font-cinzel text-4xl md:text-6xl lg:text-7xl text-[#E8E0F0] mb-6 animate-fade-in-up">
          {t(SITEDICT.hero.titleMain)} <br />
          <span className="text-[#C9A84C]">{t(SITEDICT.hero.titleSub)}</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-[#9B93AB] max-w-2xl mx-auto mb-10 animate-fade-in-up animate-delay-1">
          {t(SITEDICT.hero.description)}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up animate-delay-2">
          <a
            href="/chat"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#C9A84C] text-[#0A0A0F] font-medium rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.4)] hover:scale-105"
          >
            {t(SITEDICT.hero.ctaPrimary)}
          </a>
          <a
            href="#traditions"
            className="inline-flex items-center justify-center px-8 py-4 border border-[#C9A84C]/50 text-[#C9A84C] font-medium rounded-lg transition-all duration-300 hover:bg-[#C9A84C]/10"
          >
            {t(SITEDICT.hero.ctaSecondary)}
          </a>
        </div>

        {/* Sigils - FIXED SIZE */}
        <div className="flex justify-center items-center gap-8 animate-fade-in-up animate-delay-3">
          <div className="w-12 h-12 text-[#7B5EA7] opacity-60 hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
              <circle cx="24" cy="24" r="20"/>
              <path d="M24 4c8 0 12 8 12 20s-4 20-12 20-12-8-12-20 4-20 12-20z"/>
              <circle cx="24" cy="16" r="4" fill="currentColor"/>
              <circle cx="24" cy="32" r="4" fill="currentColor"/>
            </svg>
          </div>
          <div className="w-12 h-12 text-[#7B5EA7] opacity-60 hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
              <polygon points="24,6 28,20 42,20 32,28 36,42 24,34 12,42 16,28 6,20 20,20"/>
              <circle cx="24" cy="26" r="6" fill="currentColor"/>
            </svg>
          </div>
          <div className="w-12 h-12 text-[#7B5EA7] opacity-60 hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
              <polygon points="24,8 40,40 8,40"/>
              <polygon points="24,40 8,8 40,8"/>
            </svg>
          </div>
          <div className="w-12 h-12 text-[#7B5EA7] opacity-60 hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
              <path d="M24 44c0-20-10-25-15-30s-5-10 0-15c5 5 15 10 15 30"/>
              <path d="M24 44c0-20 10-25 15-30s5-10 0-15c-5 5-15 10-15 30"/>
              <line x1="24" y1="44" x2="24" y2="20"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
