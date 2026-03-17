'use client';

const footerLinks = [
  { name: 'Home', href: '/' },
  { name: 'Chat', href: '/chat' },
  { name: 'Library', href: '/library' },
  { name: 'Pricing', href: '/pricing' },
];

export default function Footer() {
  return (
    <footer className="bg-[#12121A] border-t border-[rgba(255,255,255,0.06)] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo Column */}
          <div className="flex flex-col gap-4">
            <div className="font-cinzel text-2xl text-[#C9A84C] tracking-wide">
              Vault of Arcana
            </div>
            <p className="text-[#9B93AB] text-sm leading-relaxed max-w-xs">
              Ancient wisdom for the modern seeker. Journey into the depths of sacred traditions.
            </p>
          </div>

          {/* Links Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[#E8E0F0] font-medium uppercase tracking-wider text-xs">Navigation</h4>
            <nav className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-[#9B93AB] hover:text-[#C9A84C] transition-colors text-sm"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Credit Column */}
          <div className="flex flex-col gap-4 md:items-end">
            <p className="text-[#9B93AB] text-sm italic">
              Made with curiosity
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[rgba(255,255,255,0.06)] flex flex-col md:flex-row justify-between items-center gap-4 text-[#9B93AB] text-xs">
          <div>© 2025 Vault of Arcana</div>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-[#E8E0F0] transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-[#E8E0F0] transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
