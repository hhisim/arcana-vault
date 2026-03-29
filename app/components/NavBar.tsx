'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useLang } from '@/lib/lang-context'
import { SITEDICT } from '@/lib/dictionary'
import { useAuth } from '@/components/auth/AuthProvider'
import { PLAN_CONFIG } from '@/lib/plans'

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const exploreRef = useRef<HTMLDivElement>(null)
  const { lang, setLang, t } = useLang()
  const auth = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const navLinks = [
    { href: '/', label: t(SITEDICT.nav.home) },
    { href: '/chat', label: t(SITEDICT.nav.chat) },
    { href: '/traditions', label: 'Traditions' },
    { href: '/library', label: t(SITEDICT.nav.library) },
    { href: '/blog', label: t(SITEDICT.nav.scroll) },
    { href: '/pricing', label: 'Pricing' },
  ]

  const exploreLinks = [
    { href: '/daily', label: 'Daily Practice' },
    { href: '/journal', label: 'Journal' },
    { href: '/inquiry', label: 'Inquiry' },
    { href: '/correspondence-engine', label: t(SITEDICT.nav.codex) },
    { href: '/agora', label: t(SITEDICT.nav.agora) },
  ]

  const planName = auth.isAuthenticated ? PLAN_CONFIG[auth.plan]?.name : null
  const user = auth.user

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-[rgba(255,255,255,0.06)] px-4 md:px-6">
      <div className="max-w-7xl mx-auto h-20 flex items-center justify-between gap-4">
        <a href="/" className="focus:outline-none flex-shrink-0 flex items-center">
          <img src="/logo.svg" alt="Vault of Arcana" className="h-12 md:h-14 w-auto" />
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
          {/* Explore dropdown */}
          <div className="relative" ref={exploreRef}>
            <button
              onClick={() => setExploreOpen(!exploreOpen)}
              className="text-[#9B93AB] hover:text-[#E8E0F0] transition-colors duration-200 text-sm font-medium focus:outline-none flex items-center gap-1"
            >
              Explore
              <svg className={`w-3 h-3 transition-transform ${exploreOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {exploreOpen && (
              <div className="absolute right-0 mt-3 w-48 rounded-xl border border-white/10 bg-[#1a1a2e]/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50">
                {exploreLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2.5 text-sm text-[#9B93AB] hover:text-[#E8E0F0] hover:bg-white/5 transition-colors"
                    onClick={() => setExploreOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side: language + auth */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
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

          {/* Auth Avatar Dropdown */}
          {auth.isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-[var(--primary-gold)]/30 hover:border-[var(--primary-gold)] transition-colors p-1 focus:outline-none"
                aria-label="Account menu"
              >
                <div className="w-8 h-8 rounded-full bg-[#7B5EA7] flex items-center justify-center text-white text-sm font-bold uppercase">
                  {(user?.full_name?.[0] || user?.email?.[0] || '?')}
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-[#1a1a2e]/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50">
                  {/* User info */}
                  <div className="px-4 py-4 border-b border-white/10">
                    <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {user?.full_name || 'Vault Member'}
                    </div>
                    <div className="text-xs text-[#9B93AB] truncate mt-0.5">{user?.email}</div>
                    {planName && (
                      <div className="mt-2 inline-flex items-center rounded-full border border-[var(--primary-gold)]/40 px-2.5 py-0.5 text-xs text-[var(--primary-gold)]">
                        {planName}
                      </div>
                    )}
                  </div>

                  {/* Menu items */}
                  <div className="py-2">
                    <Link
                      href="/account"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#9B93AB] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span>👤</span> Account
                    </Link>
                    <Link
                      href="/membership"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#9B93AB] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span>🔮</span> Membership
                    </Link>
                    <Link
                      href="/chat"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#9B93AB] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span>✨</span> Oracle
                    </Link>
                  </div>

                  {/* Upgrade / billing */}
                  {auth.plan === 'free' && (
                    <div className="px-4 py-2 border-t border-white/10">
                      <Link
                        href="/pricing"
                        className="block w-full text-center rounded-xl bg-[var(--primary-gold)] px-4 py-2 text-sm font-bold text-black hover:opacity-90 transition-opacity"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Upgrade Plan
                      </Link>
                    </div>
                  )}

                  {/* Logout */}
                  <div className="px-4 py-2 border-t border-white/10">
                    <button
                      onClick={async () => {
                        setDropdownOpen(false)
                        await auth.logout()
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#E05C5C] hover:bg-white/5 transition-colors rounded"
                    >
                      <span>🚪</span> Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm text-[#9B93AB] hover:text-[var(--text-primary)] transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/chat"
                className="hidden md:inline-block bg-[#C9A84C] text-[#0A0A0F] px-4 py-2 rounded-md hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all duration-200 font-bold text-sm focus:outline-none"
              >
                {t(SITEDICT.nav.cta)}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#9B93AB] hover:text-[#E8E0F0] p-1 focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[rgba(255,255,255,0.06)] bg-[#12121A]/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-[#9B93AB] hover:text-[#E8E0F0] py-2 text-lg font-medium transition-colors focus:outline-none" onClick={() => setMobileOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="border-t border-white/10 pt-3 mt-1">
              <div className="text-xs text-[#9B93AB] uppercase tracking-wider mb-2">Explore</div>
              {exploreLinks.map((link) => (
                <a key={link.href} href={link.href} className="block text-[#9B93AB] hover:text-[#E8E0F0] py-1.5 text-sm transition-colors" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </a>
              ))}
            </div>
            {auth.isAuthenticated ? (
              <>
                <div className="border-t border-white/10 pt-3 mt-1">
                  <div className="text-xs text-[#9B93AB] uppercase tracking-wider mb-2">Account</div>
                  <Link href="/account" className="block text-[#9B93AB] hover:text-[var(--text-primary)] py-1.5 text-sm" onClick={() => setMobileOpen(false)}>Account</Link>
                  <Link href="/membership" className="block text-[#9B93AB] hover:text-[var(--text-primary)] py-1.5 text-sm" onClick={() => setMobileOpen(false)}>Membership</Link>
                  <button onClick={() => { setMobileOpen(false); auth.logout() }} className="block text-[#E05C5C] py-1.5 text-sm mt-1">Log out</button>
                </div>
              </>
            ) : (
              <Link href="/login" className="text-[#9B93AB] hover:text-[var(--text-primary)] py-2 text-lg font-medium" onClick={() => setMobileOpen(false)}>Log in</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
