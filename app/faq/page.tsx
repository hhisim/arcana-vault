export default function FAQPage() {
  const faqs = [
    {
      q: 'Is this just ChatGPT with an occult theme?',
      a: 'No. The Vault is built from over 30 years of curated esoteric archives, structured datasets, and symbolic intelligence — not a general-purpose AI. Every response is grounded in real texts, lineages, and traditions. PRIME, the AI layer, was trained specifically on these materials in collaboration with Hakan Hisim.',
    },
    {
      q: 'What traditions are available?',
      a: 'Currently 6 traditions are fully live: Taoism, Tarot, Tantra, Entheogen, Sufism, and Dreamwalker. Another 2 are coming soon (Chaos Magick, Kabbalah). The long-term vision includes 20+ traditions spanning Rosicrucianism, Freemasonry, Meditation, Enneagram, Golden Dawn, Ritual Magick, and more.',
    },
    {
      q: 'Can I try before paying?',
      a: 'Yes. Free accounts get 12 questions per day and full access to the Correspondence Codex. The Oracle demo on the homepage gives you a taste without any signup required.',
    },
    {
      q: 'How is my data used?',
      a: 'Your data is private by design. Conversations are not used to train any model. We do not sell, share, or expose your queries. Your practice is yours.',
    },
    {
      q: 'What is PRIME?',
      a: 'PRIME is the AI co-intelligence layer built by Hakan Hisim. It is not a separate product — it is the collaborative intelligence behind every response in the Vault. Hakan provides the human expertise and curation; PRIME provides the scalable intelligence. The name reflects the partnership.',
    },
    {
      q: 'What is the Correspondence Codex?',
      a: 'The Codex is a unique symbolic reference system mapping 577 nodes across 12 dimensional categories — cross-referencing symbols, archetypes, practices, and concepts across all traditions. It is one of the Vault\'s most distinctive features and is freely available to all accounts.',
    },
  ]

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="font-serif text-5xl text-[var(--text-primary)] mb-4">FAQ</h1>
      <p className="text-[var(--text-secondary)] mb-12">Common questions about the Vault of Arcana.</p>

      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="glass-card p-6">
            <h3 className="text-[var(--primary-gold)] font-serif text-lg mb-3">{faq.q}</h3>
            <p className="text-[var(--text-secondary)] leading-7">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-[var(--text-secondary)] mb-4">Still have questions?</p>
        <a
          href="mailto:support@vaultofarcana.com"
          className="inline-block bg-[#C9A84C] text-[#0A0A0F] px-6 py-3 rounded-lg font-bold hover:opacity-90"
        >
          Contact Support
        </a>
      </div>
    </div>
  )
}
