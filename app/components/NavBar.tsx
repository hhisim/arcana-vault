'use client';

import { useState } from 'react';
import { useLang } from '@/lib/lang-context';
import { SITEDICT } from '@/lib/dictionary';

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, t } = useLang();
  const [mounted, setMounted] = useState(false);

  useState(() => {
    if (typeof window !== 'undefined') setMounted(true);
  });

  const navLinks = [
    { href: '/', label: t(SITEDICT.nav.home) },
    { href: '/chat', label: t(SITEDICT.nav.chat) },
    { href: '/library', label: t(SITEDICT.nav.library) },
    { href: '/correspondence-engine', label: t(SITEDICT.nav.codex) },
    { href: '/forum', label: t(SITEDICT.nav.agora) },
    { href: '/blog', label: t(SITEDICT.nav.scroll) },
    { href: '/pricing', label: 'Pricing' },
    { href: '/login', label: 'Login' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-[rgba(255,255,255,0.06)] px-4 md:px-6">
      <div className="max-w-7xl mx-auto h-20 flex items-center justify-between gap-4">
        <a href="/" className="focus:outline-none flex-shrink-0 flex items-center">
          <img src="/voa-logo.svg" alt="Vault of Arcana" className="h-12 md:h-14 w-auto" />
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[#9B93AB] hover:text-[#E8E0F0] transition-colors duration-200 text-sm font-medium focus:outline-none"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Language Switcher & Desktop CTA */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 border-r border-white/5 pr-4 mr-2">
            {(['en', 'tr', 'ru'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition ${
                  lang === l ? 'bg-[#7B5EA7] text-white' : 'text-[#9B93AB] hover:text-white'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          
          <a
            href="/chat"
            className="hidden md:inline-block bg-[#C9A84C] text-[#0A0A0F] px-4 py-2 rounded-md hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all duration-200 font-bold text-sm focus:outline-none"
          >
            {t(SITEDICT.nav.cta)}
          </a>
        </div>

        <button
          className="md:hidden text-[#9B93AB] hover:text-[#E8E0F0] p-1 focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[rgba(255,255,255,0.06)] bg-[#12121A]/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[#9B93AB] hover:text-[#E8E0F0] py-2 text-lg font-medium transition-colors focus:outline-none"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#traditions"
              className="bg-[#C9A84C] text-[#0A0A0F] px-6 py-3 rounded-md text-center font-bold mt-2 shadow-lg active:scale-95 transition-all focus:outline-none"
              onClick={() => setMobileOpen(false)}
            >
              Begin Your Journey
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
