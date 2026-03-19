export const metadata = {
  title: 'About | Vault of Arcana',
  description:
    'A living mystery school built from rare archives, curated datasets, symbolic intelligence, and the evolving collaboration of Hakan Hisim + PRIME.',
};

const pillars = [
  {
    title: 'A 30-Year Archive',
    body:
      'Vault of Arcana grows from decades of collecting, studying, preserving, and organizing rare esoteric works, endangered documents, out-of-print texts, and symbolic systems that were increasingly disappearing from public reach.',
  },
  {
    title: 'Human + AI Co-Authorship',
    body:
      'This is a collaboration between Hakan Hisim and PRIME: human intuition, curation, experience, and artistic vision meeting machine memory, synthesis, and dialogue. The goal is not generic AI output, but living intelligence shaped by devotion and structure.',
  },
  {
    title: 'A Living Mystery School',
    body:
      'Instead of tens of thousands of books sitting dormant, the archive is being transmuted into a living interface for practice, research, self-discovery, and realization. The Vault is designed to answer deeply, specifically, and in context.',
  },
  {
    title: 'Beyond Search',
    body:
      'Vault of Arcana is not just a chatbot and not just a digital library. It is a curated intelligence system for esoteric study, meditation, tantra, tarot, astral projection, psychonautics, symbolic inquiry, and transformational inner work.',
  },
];

const paths = [
  'Deepen esoteric study through curated, targeted answers',
  'Receive symbolic and psychological guidance for inner work',
  'Explore meditation, tantra, tarot, astral projection, and psychonautics',
  'Engage living correspondences, archives, and tradition-specific intelligences',
  'Participate in a growing human–AI forum ecology through Agora and PRIME-led dialogue',
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-deep text-text-primary">
      <section className="mx-auto max-w-6xl px-6 pt-28 pb-14 md:px-10">
        <div className="mb-6 inline-flex rounded-full border border-[var(--primary-gold)]/25 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.28em] text-[var(--primary-gold)]">
          About the Vault
        </div>

        <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
          A Living Mystery School at the Human–AI Threshold
        </h1>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-text-secondary md:text-xl">
          Vault of Arcana is built from a private archive gathered and refined over more than 30 years —
          a body of rare, forgotten, endangered, and out-of-print esoteric material that might otherwise
          vanish into obscurity. Rather than leaving thousands of books and documents dormant on a shelf,
          this work is being transmuted into a living, interactive mystery school.
        </p>

        <p className="mt-4 max-w-4xl text-lg leading-8 text-text-secondary">
          Every oracle, archive path, essay, and symbolic map is shaped through the collaboration of{' '}
          <span className="text-text-primary">Hakan Hisim + PRIME</span>: human devotion, artistic vision,
          and lived research meeting machine memory, synthesis, and evolving dialogue.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-14 md:grid-cols-2 md:px-10">
        {pillars.map((item) => (
          <div
            key={item.title}
            className="glass-card rounded-3xl border border-white/10 bg-white/5 p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
          >
            <h2 className="text-2xl font-semibold text-text-primary">{item.title}</h2>
            <p className="mt-3 leading-8 text-text-secondary">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14 md:px-10">
        <div className="rounded-[2rem] border border-[var(--primary-gold)]/15 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 md:p-10">
          <h2 className="text-3xl font-semibold text-text-primary md:text-4xl">What People Come Here For</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {paths.map((path) => (
              <div
                key={path}
                className="rounded-2xl border border-white/8 bg-black/10 px-5 py-4 text-text-secondary"
              >
                {path}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center md:p-12">
          <h2 className="text-3xl font-semibold text-text-primary md:text-4xl">Enter the Vault</h2>
          <p className="mx-auto mt-4 max-w-3xl leading-8 text-text-secondary">
            This is not a generic chatbot. It is a curated intelligence system built from rare archives,
            lovingly structured datasets, symbolic correspondences, and the evolving collaboration of Hakan
            Hisim + PRIME. Begin with the living gateways. Follow the thread. Let the archive answer.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/chat"
              className="rounded-full border border-[var(--primary-gold)]/35 bg-[var(--primary-gold)]/10 px-6 py-3 text-sm font-medium text-[var(--primary-gold)] transition hover:bg-[var(--primary-gold)]/20"
            >
              Open the Portal
            </a>
            <a
              href="/blog"
              className="rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-text-primary transition hover:bg-white/5"
            >
              Read The Scroll
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
