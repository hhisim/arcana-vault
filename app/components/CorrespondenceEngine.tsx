'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  buildCorrespondenceView,
  filterEntries,
  getAvailableKinds,
  parseCorrespondenceSeed,
  type Entry,
  type SeedData,
} from '@/lib/correspondence-engine';

function StatCard({ value, label, accent = false }: { value: number; label: string; accent?: boolean }) {
  return (
    <div className="glass-card rounded-2xl p-4 md:p-5 border border-[rgba(255,255,255,0.06)]">
      <div className={`text-2xl md:text-3xl font-semibold ${accent ? 'text-[#C9A84C]' : 'text-[#E8E0F0]'}`}>{value}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.2em] text-[#9B93AB]">{label}</div>
    </div>
  );
}

function FieldCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="glass-card rounded-2xl p-4 border border-[rgba(255,255,255,0.06)] min-h-[120px]">
      <div className="text-[11px] uppercase tracking-[0.2em] text-[#9B93AB]">{label}</div>
      <div className={`mt-3 text-sm leading-relaxed ${accent ? 'text-[#E8E0F0]' : 'text-[#D8D1E4]'}`}>{value}</div>
    </div>
  );
}

function EntryRailCard({
  item,
  active,
  onClick,
}: {
  item: Entry;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`glass-card rounded-2xl p-4 border text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(123,94,167,0.18)] ${
        active
          ? 'border-[#7B5EA7] shadow-[0_0_26px_rgba(123,94,167,0.22)]'
          : 'border-[rgba(255,255,255,0.06)]'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xl text-[#C9A84C]">{item.icon}</span>
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[#9B93AB]">
          {item.kind}
        </span>
      </div>
      <div className="mt-3 font-cinzel text-lg text-[#E8E0F0] leading-tight">{item.name}</div>
      <div className="mt-2 text-sm text-[#9B93AB] line-clamp-3">
        {item.fieldMap.essence?.value || item.flowText || item.subtitle || 'Seed entry'}
      </div>
    </button>
  );
}

function AllyBlock({
  title,
  items,
  onSelect,
}: {
  title: string;
  items: Entry[];
  onSelect: (slug: string) => void;
}) {
  if (!items.length) return null;

  return (
    <div>
      <div className="mb-4 text-xs uppercase tracking-[0.24em] text-[#9B93AB]">{title}</div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => onSelect(item.slug)}
            className="glass-card rounded-2xl border border-[rgba(255,255,255,0.06)] p-4 text-left transition-all duration-200 hover:border-[#7B5EA7]/60"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg text-[#C9A84C]">{item.icon}</span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#9B93AB]">{item.kind}</span>
            </div>
            <div className="mt-3 font-cinzel text-lg text-[#E8E0F0]">{item.name}</div>
            <div className="mt-2 text-sm text-[#9B93AB] line-clamp-3">{item.flowText || item.subtitle || 'Direct seed resonance'}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CorrespondenceEngine({
  seedUrl = '/data/correspondences.txt',
  initialSlug = 'venus',
}: {
  seedUrl?: string;
  initialSlug?: string;
}) {
  const [seed, setSeed] = useState<SeedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  const [kind, setKind] = useState('all');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(seedUrl, { cache: 'force-cache' });
        if (!response.ok) {
          throw new Error(`Could not load seed file (${response.status})`);
        }
        const text = await response.text();
        const parsed = parseCorrespondenceSeed(text);
        if (!cancelled) {
          setSeed(parsed);
          if (!parsed.bySlug.has(initialSlug) && parsed.entries.length) {
            setActiveSlug(parsed.entries[0].slug);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to parse the correspondence seed.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [initialSlug, seedUrl]);

  const filteredEntries = useMemo(() => {
    if (!seed) return [];
    return filterEntries(seed, query, kind);
  }, [seed, query, kind]);

  useEffect(() => {
    if (!seed) return;
    const stillVisible = filteredEntries.some((item) => item.slug === activeSlug);
    if (!stillVisible && filteredEntries.length) {
      setActiveSlug(filteredEntries[0].slug);
    }
  }, [activeSlug, filteredEntries, seed]);

  const view = useMemo(() => {
    if (!seed) return null;
    return buildCorrespondenceView(seed, activeSlug);
  }, [seed, activeSlug]);

  const kinds = useMemo(() => (seed ? getAvailableKinds(seed) : []), [seed]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-6 text-[#9B93AB]">
        Parsing correspondence seed…
      </div>
    );
  }

  if (error || !seed || !view) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-6 text-center text-[#9B93AB]">
        {error || 'No correspondence data was found.'}
      </div>
    );
  }

  const { entry, subtitle, overviewFields, crossRows, related, allies } = view;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0]">
      <section className="relative overflow-hidden border-b border-[rgba(255,255,255,0.06)] bg-gradient-to-b from-[#160f24] via-[#0E0C15] to-[#0A0A0F] px-6 pb-14 pt-28 md:pt-32">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(123,94,167,0.24),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(201,168,76,0.16),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(78,205,196,0.10),transparent_22%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="text-xs uppercase tracking-[0.3em] text-[#9B93AB]">Vault of Arcana</div>
              <h1 className="mt-4 font-cinzel text-4xl md:text-6xl text-[#E8E0F0] tracking-wide">
                Correspondence Codex
              </h1>
              <p className="mt-4 max-w-2xl text-base md:text-lg text-[#9B93AB] leading-relaxed">
                Forged from over 30 years of distilled gnosis and esoteric study, this resilient parsing engine transforms chaotic seed data into pristine cross-system maps. By decoding the hidden relationships between form, frequency, linguistics, geometry, and archetypes, it reveals allied resonances and enables rapid, interconnected discovery across planets, deities, botanicals, sacred letters, the tarot, the zodiac, and beyond.
              </p>
            </div>

            <div className="grid w-full max-w-xl grid-cols-2 gap-3 md:grid-cols-4">
              <StatCard value={seed.stats.total} label="total entries" accent />
              <StatCard value={seed.stats.byKind.deity || 0} label="deities" />
              <StatCard value={seed.stats.byKind.crystal || 0} label="crystals" />
              <StatCard value={seed.stats.byKind.tarot || 0} label="tarot" />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10 md:py-12">
        <div className="glass-card rounded-3xl border border-[rgba(255,255,255,0.06)] p-5 md:p-6">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <label className="block">
              <div className="mb-2 text-xs uppercase tracking-[0.24em] text-[#9B93AB]">Search seed</div>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Venus, Aphrodite, Rose Quartz, Daleth, Libra…"
                className="w-full rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0A0A0F]/60 px-4 py-3 text-sm text-[#E8E0F0] outline-none transition-colors placeholder:text-[#6F687C] focus:border-[#7B5EA7]/60"
              />
            </label>

            <div>
              <div className="mb-2 text-xs uppercase tracking-[0.24em] text-[#9B93AB]">Filter by kind</div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setKind('all')}
                  className={`rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.16em] transition-all ${
                    kind === 'all'
                      ? 'bg-[#7B5EA7] text-white shadow-[0_0_18px_rgba(123,94,167,0.35)]'
                      : 'bg-white/5 text-[#9B93AB] hover:text-[#E8E0F0]'
                  }`}
                >
                  All
                </button>
                {kinds.slice(0, 8).map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setKind(item.key)}
                    className={`rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.16em] transition-all ${
                      kind === item.key
                        ? 'bg-[#7B5EA7] text-white shadow-[0_0_18px_rgba(123,94,167,0.35)]'
                        : 'bg-white/5 text-[#9B93AB] hover:text-[#E8E0F0]'
                    }`}
                  >
                    {item.label} · {item.count}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="mt-8 grid gap-8 xl:grid-cols-[1.05fr_1.95fr]">
          <div>
            <div className="mb-4 text-xs uppercase tracking-[0.24em] text-[#9B93AB]">Matching entries</div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {filteredEntries.slice(0, 18).map((item) => (
                <EntryRailCard
                  key={item.slug}
                  item={item}
                  active={item.slug === entry.slug}
                  onClick={() => setActiveSlug(item.slug)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <section className="glass-card rounded-3xl border border-[rgba(255,255,255,0.06)] p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl text-[#C9A84C]">{entry.icon}</span>
                    <span className="rounded-full bg-[#7B5EA7]/20 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#C9B8E5]">
                      {entry.kind}
                    </span>
                  </div>
                  <h2 className="mt-4 font-cinzel text-3xl md:text-4xl text-[#E8E0F0]">{entry.name}</h2>
                  <p className="mt-3 max-w-3xl text-[#9B93AB] leading-relaxed">{subtitle}</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-[#7B5EA7]/30 bg-[#120E1C] px-4 py-4 text-sm leading-relaxed text-[#D8D1E4] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                {entry.flowText ||
                  'This engine composes every available symbolic layer from the seed file into a cross-correspondence map.'}
              </div>
            </section>

            <section>
              <div className="mb-4 text-xs uppercase tracking-[0.24em] text-[#9B93AB]">Core correspondences</div>
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {overviewFields.map((field) => (
                  <FieldCard
                    key={field.key}
                    label={field.label}
                    value={field.value}
                    accent={['element', 'chakra', 'planet', 'zodiac', 'tarot', 'kabbalah'].includes(field.key)}
                  />
                ))}
              </div>
            </section>

            <section>
              <div className="mb-4 text-xs uppercase tracking-[0.24em] text-[#9B93AB]">Cross-correspondence table</div>
              <div className="overflow-hidden rounded-3xl border border-[rgba(255,255,255,0.06)] bg-[#12121A]">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[rgba(255,255,255,0.06)] bg-[#151522] text-xs uppercase tracking-[0.16em] text-[#9B93AB]">
                        <th className="px-4 py-4 font-medium">System</th>
                        <th className="px-4 py-4 font-medium">Current value</th>
                        <th className="px-4 py-4 font-medium">Strong matches</th>
                      </tr>
                    </thead>
                    <tbody>
                      {crossRows.map((row) => (
                        <tr key={row.key} className="border-b border-[rgba(255,255,255,0.04)] align-top last:border-b-0">
                          <td className="px-4 py-4 text-sm font-medium text-[#E8E0F0]">{row.label}</td>
                          <td className="px-4 py-4 text-sm text-[#D8D1E4]">{row.value}</td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              {row.matches.length ? (
                                row.matches.map((match) => (
                                  <button
                                    key={match.slug}
                                    type="button"
                                    onClick={() => setActiveSlug(match.slug)}
                                    className="rounded-full bg-[#7B5EA7]/16 px-3 py-1.5 text-xs text-[#D8CCEA] transition-colors hover:bg-[#7B5EA7]/28"
                                  >
                                    {match.name}
                                  </button>
                                ))
                              ) : (
                                <span className="text-sm text-[#756D84]">No direct match found</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="grid gap-8">
              <AllyBlock title="Crystal allies" items={allies.crystals} onSelect={setActiveSlug} />
              <AllyBlock title="Plant allies" items={allies.plants} onSelect={setActiveSlug} />
              <AllyBlock title="Deity / angel allies" items={allies.deities} onSelect={setActiveSlug} />
            </section>

            <section>
              <div className="mb-4 text-xs uppercase tracking-[0.24em] text-[#9B93AB]">Related resonances</div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {related.slice(0, 9).map((item) => (
                  <button
                    key={item.entry.slug}
                    type="button"
                    onClick={() => setActiveSlug(item.entry.slug)}
                    className="glass-card rounded-2xl border border-[rgba(255,255,255,0.06)] p-4 text-left transition-all duration-200 hover:border-[#7B5EA7]/60"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg text-[#C9A84C]">{item.entry.icon}</span>
                        <span className="text-[11px] uppercase tracking-[0.18em] text-[#9B93AB]">{item.entry.kind}</span>
                      </div>
                      <span className="text-xs text-[#6E6680]">{item.score}</span>
                    </div>
                    <div className="mt-3 font-cinzel text-lg text-[#E8E0F0]">{item.entry.name}</div>
                    <div className="mt-2 text-sm text-[#9B93AB]">
                      {item.matchedOn.join(' · ') || item.entry.subtitle || 'Shared symbolic resonance'}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
