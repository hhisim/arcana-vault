import CorrespondenceEngine from '../components/CorrespondenceEngine';

export const metadata = {
  title: 'Correspondence Engine — Vault of Arcana',
  description: 'A multi-dimensional correspondence engine for symbols, planets, letters, frequencies, chakras, alchemical processes, and more.',
};

export default function Page() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {/* Codex quick-start guide */}
      <div className="mb-8 rounded-2xl border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.05)] p-6">
        <h2 className="font-serif text-2xl text-[var(--primary-gold)] mb-3">How to Use the Codex</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-[var(--primary-gold)] text-sm font-bold mb-1">1. Explore the Web</p>
            <p className="text-[var(--text-secondary)] text-sm">Browse 577 nodes across 12 dimensions — planets, archetypes, letters, symbols, and more. Click any node to see its correspondences.</p>
          </div>
          <div>
            <p className="text-[var(--primary-gold)] text-sm font-bold mb-1">2. Follow the Threads</p>
            <p className="text-[var(--text-secondary)] text-sm">Each node links to related nodes across traditions. See how Venus connects to the Pentagram, the Heart Chakra, and the Hebrew letter Daleth.</p>
          </div>
          <div>
            <p className="text-[var(--primary-gold)] text-sm font-bold mb-1">3. Discover Patterns</p>
            <p className="text-[var(--text-secondary)] text-sm">The Codex reveals hidden correspondences between traditions. This is the cross-reference intelligence unique to the Vault.</p>
          </div>
        </div>
      </div>
      <CorrespondenceEngine initialSlug="venus" />
    </section>
  );
}
