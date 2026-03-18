'use client'

import { useState } from 'react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/chat', label: 'Chat' },
  { href: '/library', label: 'Library' },
  { href: '/correspondence-engine', label: 'Correspondence Codex' },
  { href: '/forum', label: 'Agora' },
  { href: '/blog', label: 'The Scroll' },
]

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-[rgba(255,255,255,0.06)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="font-cinzel text-xl text-[#C9A84C] tracking-wide focus:outline-none">
          Vault of Arcana
        </a>

        <div className="hidden md:flex items-center gap-8">
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

        <a
          href="#traditions"
          className="hidden md:inline-block bg-[#C9A84C] text-[#0A0A0F] px-6 py-2 rounded-md hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all duration-200 font-medium text-sm focus:outline-none"
        >
          Begin Your Journey
        </a>

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
