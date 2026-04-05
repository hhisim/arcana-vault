import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sitemap — Vault of Arcana',
  description: 'Browse all pages and sections of the Vault of Arcana.',
  robots: { index: false, follow: true },
}

const pages = [
  { href: '/', label: 'Home' },
  { href: '/oracle', label: 'Oracle' },
  { href: '/chat', label: 'Chat' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/login', label: 'Login' },
]

export default function SitemapPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-8">Sitemap</h1>
        <nav className="space-y-4">
          {pages.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block text-xl text-[var(--primary-gold)] hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  )
}
