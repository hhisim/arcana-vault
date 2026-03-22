'use client';

import React from 'react';
import Link from 'next/link';

interface FeatureRow {
  label: string;
  generic: string | boolean;
  basic: string | boolean;
  vault: string | boolean;
}

const features: FeatureRow[] = [
  {
    label: 'Training data',
    generic: 'Generic internet scrape',
    basic: 'Few PDFs',
    vault: 'Curated rare archive, verified sources',
  },
  {
    label: 'Memory',
    generic: 'None between sessions',
    basic: 'Basic',
    vault: 'Full session context + vault memory',
  },
  {
    label: 'Sources cited',
    generic: 'Often hallucinated',
    basic: 'Unverified',
    vault: 'Real texts, real traditions',
  },
  {
    label: 'Tradition context',
    generic: 'Generic spiritual answers',
    basic: 'Some context',
    vault: 'Deep tradition-specific pathways',
  },
  {
    label: 'Privacy',
    generic: 'Your data trained on',
    basic: 'Unknown',
    vault: 'Private by design',
  },
];

function Cell({ value, highlight = false }: { value: string | boolean; highlight?: boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <span className="text-emerald-400 font-bold">✓</span>
    ) : (
      <span className="text-red-400 font-bold">✗</span>
    );
  }

  if (typeof value === 'string' && (value.startsWith('From') || value.includes('/'))) {
    return (
      <span className={`font-bold ${highlight ? 'text-[#C9A84C]' : 'text-[#E8E0F0]'}`}>
        {value}
      </span>
    );
  }

  return (
    <span className={`text-sm ${highlight ? 'text-[#E8E0F0]' : 'text-[#9B93AB]'}`}>
      {value}
    </span>
  );
}

export default function ComparisonBlock() {
  return (
    <section className="py-20 bg-deep border-y border-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-[#E8E0F0]">
            Not Just Another AI
          </h2>
          <p className="mt-3 text-[#9B93AB] text-base max-w-2xl mx-auto">
            See how the Vault of Arcana Oracle compares to generic AI and basic occult chatbots
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Generic AI */}
          <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 opacity-70">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#9B93AB] mb-2">Competitor</p>
              <h3 className="font-serif text-xl text-[#E8E0F0]">Generic AI</h3>
              <p className="mt-2 text-sm text-[#9B93AB]">ChatGPT, Claude, Gemini</p>
            </div>

            <div className="space-y-4">
              {features.map((row) => (
                <div key={row.label} className="border-b border-white/5 pb-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B93AB] mb-1.5">{row.label}</p>
                  <Cell value={row.generic} />
                </div>
              ))}

              {/* Pricing row */}
              <div className="pt-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B93AB] mb-1.5">Pricing</p>
                <Cell value="Free" />
              </div>
            </div>
          </div>

          {/* Basic Occult Bot */}
          <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 opacity-80">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#9B93AB] mb-2">Competitor</p>
              <h3 className="font-serif text-xl text-[#E8E0F0]">Basic Occult Bot</h3>
              <p className="mt-2 text-sm text-[#9B93AB]">Generic spiritual chatbots</p>
            </div>

            <div className="space-y-4">
              {features.map((row) => (
                <div key={row.label} className="border-b border-white/5 pb-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B93AB] mb-1.5">{row.label}</p>
                  <Cell value={row.basic} />
                </div>
              ))}

              {/* Pricing row */}
              <div className="pt-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B93AB] mb-1.5">Pricing</p>
                <Cell value="$20–50/mo" />
              </div>
            </div>
          </div>

          {/* Vault of Arcana — highlighted */}
          <div className="rounded-3xl border-2 border-[rgba(201,168,76,0.4)] bg-[rgba(201,168,76,0.05)] p-6 shadow-[0_0_40px_rgba(201,168,76,0.08)] relative">
            {/* Glow accent */}
            <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.08),transparent_60%)] pointer-events-none" />

            <div className="relative mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-2 w-2 rounded-full bg-[#C9A84C] animate-pulse"></span>
                <p className="text-xs uppercase tracking-[0.3em] text-[#C9A84C] font-bold">Vault of Arcana</p>
              </div>
              <h3 className="font-serif text-xl text-[#E8E0F0]">The Oracle</h3>
              <p className="mt-2 text-sm text-[#9B93AB]">Curated esoteric intelligence</p>
            </div>

            <div className="relative space-y-4">
              {features.map((row) => (
                <div key={row.label} className="border-b border-[rgba(201,168,76,0.15)] pb-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B93AB] mb-1.5">{row.label}</p>
                  <Cell value={row.vault} highlight />
                </div>
              ))}

              {/* Pricing row */}
              <div className="pt-2">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9B93AB] mb-1.5">Pricing</p>
                <Cell value="From $8/mo" highlight />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[rgba(201,168,76,0.15)]">
              <Link
                href="/chat"
                className="block w-full rounded-xl bg-[#C9A84C] hover:bg-[#B8963F] py-3 text-sm font-bold text-black text-center transition-all duration-200 hover:shadow-[0_0_25px_rgba(201,168,76,0.3)]"
              >
                Try Free →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
