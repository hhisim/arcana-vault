'use client'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/chat', label: 'Chat' },
  { href: '/library', label: 'Library' },
  { href: '/pricing', label: 'Pricing' },
]

export default function Footer() {
  return (
    <footer className="bg-card border-t border-[rgba(255,255,255,0.06)] py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-cinzel text-lg text-gold">Vault of Arcana</h3>
            <p className="text-text-secondary text-sm mt-2">
              Ancient wisdom for the modern seeker
            </p>
          </div>

          <div>
            <h4 className="text-text-primary text-sm font-medium mb-3">Navigation</h4>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-text-secondary text-sm hover:text-text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-text-secondary text-sm">
              Made with curiosity
            </p>
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.06)] mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-xs">
            © 2025 Vault of Arcana
          </p>
          <div className="flex gap-6">
            <a href="/privacy" className="text-text-muted text-xs hover:text-text-secondary transition-colors">
              Privacy
            </a>
            <a href="/terms" className="text-text-muted text-xs hover:text-text-secondary transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
