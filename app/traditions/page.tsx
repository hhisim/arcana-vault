import Link from 'next/link'
import { traditions, liveTraditions, upcomingTraditions, horizonTraditions } from '@/lib/tradition-config'

export const metadata = {
  title: 'The Traditions — Vault of Arcana',
  description:
    'Browse the living traditions of the Vault — each a curated archive, a distinct Oracle voice, and a gateway into a lineage of wisdom.',
}

export default function TraditionsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a10]">
      {/* ─── Hero ───────────────────────────────────────────── */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-[#C9A84C]">✦ The Gateways ✦</p>
          <h1 className="font-serif text-5xl text-[#E8E0F0] md:text-6xl">The Traditions</h1>
          <div className="mx-auto mt-6 h-px w-16 bg-[#C9A84C]/40" />
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[#9B93AB]">
            Each tradition is a living gateway — trained on a curated archive and guided by
            a distinct voice. Begin anywhere. Follow the thread.
          </p>
        </div>
      </section>

      {/* ─── Live Traditions ─────────────────────────────────── */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="mb-10 text-xs uppercase tracking-[0.4em] text-[#C9A84C]">Active Gateways</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveTraditions.map((tradition) => (
              <Link
                key={tradition.slug}
                href={`/traditions/${tradition.slug}`}
                className="group flex flex-col rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]"
              >
                <div className="flex items-start justify-between mb-5">
                  <span className="text-3xl">{tradition.icon}</span>
                  <span
                    className="mt-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-emerald-400"
                  >
                    Live
                  </span>
                </div>

                <h2 className="mb-2 font-serif text-xl text-[#E8E0F0] group-hover:text-[#C9A84C] transition-colors">
                  {tradition.name}
                </h2>
                <p className="mb-4 text-sm italic text-[#9B93AB]">{tradition.subtitle}</p>
                <p className="flex-1 text-sm leading-6 text-[#9B93AB]/80">
                  {tradition.description.slice(0, 110)}…
                </p>

                {/* Color accent bar */}
                <div
                  className="mt-6 h-0.5 w-8 rounded-full transition-all duration-200 group-hover:w-16"
                  style={{ backgroundColor: tradition.color }}
                />

                <div className="mt-4 flex items-center gap-1 text-[#C9A84C] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore the tradition
                  <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Coming Soon ─────────────────────────────────────── */}
      <section className="border-b border-white/5">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="mb-10 text-xs uppercase tracking-[0.4em] text-[#9B93AB]">Opening Soon</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingTraditions.map((tradition) => (
              <Link
                key={tradition.slug}
                href={`/traditions/${tradition.slug}`}
                className="group flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.01] p-6 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.02]"
              >
                <span className="text-2xl">{tradition.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-serif text-lg text-[#E8E0F0]">{tradition.name}</h2>
                    <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-amber-400">
                      Soon
                    </span>
                  </div>
                  <p className="text-sm italic text-[#9B93AB] mb-2">{tradition.subtitle}</p>
                  <p className="text-sm leading-6 text-[#9B93AB]/70">
                    {tradition.description.slice(0, 120)}…
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── On the Horizon ──────────────────────────────────── */}
      <section>
        <div className="mx-auto max-w-5xl px-6 py-20">
          <p className="mb-10 text-xs uppercase tracking-[0.4em] text-[#9B93AB]/60">On the Horizon</p>
          <div className="flex flex-wrap gap-3">
            {horizonTraditions.map((tradition) => (
              <Link
                key={tradition.slug}
                href={`/traditions/${tradition.slug}`}
                className="flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.01] px-4 py-2 text-sm text-[#9B93AB]/70 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.02] hover:text-[#9B93AB]"
              >
                <span>{tradition.icon}</span>
                <span>{tradition.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ──────────────────────────────────────── */}
      <section className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-2xl text-center px-6">
          <h2 className="font-serif text-3xl text-[#E8E0F0] mb-4">
            Ready to enter a gateway?
          </h2>
          <p className="text-[#9B93AB] mb-8 leading-7">
            Each tradition is a different way of knowing. Choose one that calls to you — or explore all of them.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#C9A84C] text-[#0A0A10] font-bold text-sm uppercase tracking-wider hover:bg-[#C9A84C]/90 transition-colors"
            >
              Enter the Oracle
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-white/20 text-[#E8E0F0] text-sm hover:bg-white/5 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
