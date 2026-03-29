import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact · Vault of Arcana',
  description: 'Get in touch with the Vault of Arcana team.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#9B93AB] mb-4">
            [ Vault of Arcana ]
          </p>
          <h1 className="font-cinzel text-4xl md:text-5xl text-[var(--primary-gold)] mb-6">
            Contact
          </h1>
          <p className="text-[#9B93AB] text-lg">
            Reach out through the appropriate channel below.
          </p>
        </div>

        <div className="glass-card p-8 space-y-8">
          {[
            {
              icon: '✉️',
              title: 'General Inquiries',
              desc: 'For general questions about the Vault, the Oracle, or Universal Transmissions.',
              action: 'hello@vaultofarcana.com',
              href: 'mailto:hello@vaultofarcana.com',
            },
            {
              icon: '🛒',
              title: 'Order Support',
              desc: 'Questions about your prints, books, or digital products.',
              action: 'support@vaultofarcana.com',
              href: 'mailto:support@vaultofarcana.com',
            },
            {
              icon: '💎',
              title: 'Press & Partnerships',
              desc: 'Media inquiries, collaborations, and institutional partnerships.',
              action: 'press@vaultofarcana.com',
              href: 'mailto:press@vaultofarcana.com',
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h3 className="font-cinzel text-[var(--primary-gold)] mb-1">{item.title}</h3>
                <p className="text-[#9B93AB] text-sm mb-2">{item.desc}</p>
                <a
                  href={item.href}
                  className="text-sm text-[#C9A84C] hover:underline"
                >
                  {item.action}
                </a>
              </div>
            </div>
          ))}

          <div className="border-t border-white/10 pt-6">
            <p className="text-[#9B93AB] text-sm text-center">
              Response time is typically 2–3 business days. For urgent matters, please include "URGENT" in your subject line.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
