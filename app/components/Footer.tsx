export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-deep/95">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr,1fr,1fr]">
          <div>
            <div className="text-sm uppercase tracking-[0.28em] text-[var(--primary-gold)]">
              Vault of Arcana
            </div>
            <p className="mt-4 max-w-xl leading-8 text-text-secondary">
              A living mystery school built from rare archives, curated datasets, symbolic intelligence,
              and the evolving collaboration of Hakan Hisim + PRIME.
            </p>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-text-primary">Explore</h3>
            <div className="mt-4 flex flex-col gap-3 text-text-secondary">
              <a href="/chat" className="hover:text-text-primary">Portal</a>
              <a href="/library" className="hover:text-text-primary">Library</a>
              <a href="/blog" className="hover:text-text-primary">The Scroll</a>
              <a href="/forum" className="hover:text-text-primary">Agora</a>
              <a href="/about" className="hover:text-text-primary">About</a>
            </div>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.2em] text-text-primary">Vision</h3>
            <p className="mt-4 leading-8 text-text-secondary">
              Begin with four living gateways. Grow into a larger constellation of traditions, agents,
              correspondences, archives, and human–AI dialogue.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/8 pt-6 text-sm text-text-secondary">
          © {new Date().getFullYear()} Vault of Arcana · Rare wisdom, living dialogue.
        </div>
      </div>
    </footer>
  );
}
