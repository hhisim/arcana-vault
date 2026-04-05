'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './correspondence-engine.module.css';
import {
  FAMILY_ORDER,
  fetchCorrespondenceDetail,
  fetchCorrespondenceIndex,
  filterIndexItems,
  topSuggestions,
} from '../../lib/correspondence-engine.js';

function Chip({ active, onClick, children, count, subtle = false }) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${active ? styles.chipActive : ''} ${subtle ? styles.chipSubtle : ''}`}
      onClick={onClick}
    >
      <span>{children}</span>
      {typeof count === 'number' ? <span className={styles.chipCount}>{count}</span> : null}
    </button>
  );
}

function ResultCard({ item, active, onSelect }) {
  return (
    <button
      type="button"
      className={`${styles.resultCard} ${active ? styles.resultCardActive : ''}`}
      onClick={() => onSelect(item.slug)}
    >
      <div className={styles.resultTop}>
        <span className={styles.resultIcon}>{item.icon}</span>
        <span className={styles.resultKind}>{item.kind}</span>
      </div>
      <div className={styles.resultName}>{item.name}</div>
      <div className={styles.resultTeaser}>{item.teaser || item.summary}</div>
      {item.badges?.length ? (
        <div className={styles.badgeRow}>
          {item.badges.slice(0, 3).map((badge) => (
            <span key={badge} className={styles.badge}>
              {badge}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  );
}

function OverviewCard({ label, value }) {
  return (
    <div className={styles.overviewCard}>
      <div className={styles.overviewLabel}>{label}</div>
      <div className={styles.overviewValue}>{value}</div>
    </div>
  );
}

function SectionBlock({ section }) {
  return (
    <div className={styles.sectionBlock}>
      <div className={styles.sectionTitle}>{section.title}</div>
      <div className={styles.sectionItems}>
        {section.items.map((item, index) => (
          <div key={`${section.title}-${item.label}-${index}`} className={styles.sectionItem}>
            <div className={styles.sectionLabel}>{item.label}</div>
            <div className={styles.sectionValue}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CorrespondenceEngine({ initialSlug = 'venus' }) {
  const [indexData, setIndexData] = useState(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [family, setFamily] = useState('all');
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  const [detailCache, setDetailCache] = useState({});
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [status, setStatus] = useState({ loading: true, error: '' });

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 180);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    fetchCorrespondenceIndex()
      .then((data) => {
        if (cancelled) return;
        setIndexData(data);
        setStatus({ loading: false, error: '' });
        const hasInitial = data.entries.some((entry) => entry.slug === initialSlug);
        if (!hasInitial && data.entries[0]) {
          setActiveSlug(data.entries[0].slug);
        }
      })
      .catch((error) => {
        if (cancelled) return;
        setStatus({ loading: false, error: error instanceof Error ? error.message : 'Could not load correspondence index.' });
      });
    return () => {
      cancelled = true;
    };
  }, [initialSlug]);

  const families = useMemo(() => {
    if (!indexData?.meta?.families) return [];
    return [...indexData.meta.families].sort((a, b) => {
      const ai = FAMILY_ORDER.indexOf(a.key);
      const bi = FAMILY_ORDER.indexOf(b.key);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
  }, [indexData]);

  const filtered = useMemo(() => {
    if (!indexData?.entries) return [];
    return filterIndexItems(indexData.entries, debouncedQuery, family);
  }, [indexData, debouncedQuery, family]);

  const suggestions = useMemo(() => {
    if (!indexData?.entries) return [];
    return topSuggestions(indexData.entries, debouncedQuery, family);
  }, [indexData, debouncedQuery, family]);

  const currentDetail = activeSlug ? detailCache[activeSlug] : null;

  const popularForFamily = useMemo(() => {
    if (!indexData?.meta?.popularByFamily) return [];
    return indexData.meta.popularByFamily[family] || [];
  }, [indexData, family]);

  useEffect(() => {
    if (!filtered.length) return;
    const exists = filtered.some((entry) => entry.slug === activeSlug);
    if (!exists) setActiveSlug(filtered[0].slug);
  }, [filtered, activeSlug]);

  useEffect(() => {
    if (!activeSlug || detailCache[activeSlug]) return;
    const controller = new AbortController();
    setDetailLoading(true);
    setDetailError('');

    fetchCorrespondenceDetail(activeSlug, controller.signal)
      .then((detail) => {
        setDetailCache((current) => ({ ...current, [activeSlug]: detail }));
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setDetailError(error instanceof Error ? error.message : 'Could not load entry detail.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setDetailLoading(false);
      });

    return () => controller.abort();
  }, [activeSlug, detailCache]);

  if (status.loading) {
    return <div className={styles.status}>Loading correspondence index…</div>;
  }

  if (status.error) {
    return <div className={styles.status}>{status.error}</div>;
  }

  if (!indexData) {
    return <div className={styles.status}>No correspondence data is available.</div>;
  }

  return (
    <div className={styles.engine}>
      <div className={styles.hero}>
        <div className={styles.heroEyebrow}>Correspondence Engine v2</div>
        <h1 className={styles.heroTitle}>Cross-map symbols, forces, letters, frequencies, bodies, and worlds.</h1>
        <p className={styles.heroText}>
          Browse by family, search in plain language, and open any result to reveal its deeper lattice of resonances.
        </p>
      </div>

      <div className={styles.controlShell}>
        <label className={styles.searchWrap}>
          <span className={styles.label}>Search the field</span>
          <input
            className={styles.searchInput}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Venus, Root chakra, 528 Hz, Aleph, Calcination, Rose…"
          />
          <span className={styles.helper}>Forgiving search supports Kabbalah/Qabalah, I‑Ching/Iching, frequency/Hz, and more.</span>
        </label>

        {suggestions.length ? (
          <div>
            <div className={styles.label}>Suggestions</div>
            <div className={styles.chipRow}>
              {suggestions.map((item) => (
                <Chip key={item.slug} subtle onClick={() => setActiveSlug(item.slug)}>
                  {item.label}
                </Chip>
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <div className={styles.label}>Browse by Family</div>
          <div className={styles.chipRow}>
            {families.map((item) => (
              <Chip key={item.key} active={family === item.key} count={item.count} onClick={() => setFamily(item.key)}>
                {item.icon} {item.label}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <div className={styles.label}>Quick Paths</div>
          <div className={styles.chipRow}>
            {indexData.meta.quickPaths.map((item) => (
              <Chip
                key={`${item.family}-${item.query}`}
                subtle
                onClick={() => {
                  setFamily(item.family || 'all');
                  setQuery(item.query);
                }}
              >
                {item.label}
              </Chip>
            ))}
          </div>
        </div>

        {popularForFamily.length ? (
          <div>
            <div className={styles.label}>Popular in this family</div>
            <div className={styles.chipRow}>
              {popularForFamily.slice(0, 10).map((item) => (
                <Chip key={item.value} subtle onClick={() => setQuery(item.value)}>
                  {item.value}
                </Chip>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className={styles.layout}>
        <div className={styles.resultsPane}>
          <div className={styles.resultsHeader}>
            <div>
              <div className={styles.label}>Results</div>
              <div className={styles.resultsCount}>{filtered.length} visible nodes</div>
            </div>
          </div>
          <div className={styles.resultsGrid}>
            {filtered.length ? (
              filtered.map((item) => (
                <ResultCard key={item.slug} item={item} active={item.slug === activeSlug} onSelect={setActiveSlug} />
              ))
            ) : (
              <div className={styles.emptyState}>No results matched that path. Try a broader family or a simpler search phrase.</div>
            )}
          </div>
        </div>

        <div className={styles.detailPane}>
          {detailError ? <div className={styles.status}>{detailError}</div> : null}
          {detailLoading && !currentDetail ? <div className={styles.status}>Loading entry detail…</div> : null}
          {currentDetail ? (
            <>
              <div className={styles.detailHero}>
                <div className={styles.detailSymbol}>{currentDetail.icon}</div>
                <div>
                  <div className={styles.detailTitle}>{currentDetail.name}</div>
                  <div className={styles.detailSubtitle}>{currentDetail.subtitle || currentDetail.kind}</div>
                </div>
              </div>

              <div className={styles.flowBlock}>{currentDetail.flowText || currentDetail.summary}</div>

              <div className={styles.overviewGrid}>
                {currentDetail.overview.slice(0, 12).map((item) => (
                  <OverviewCard key={item.key} label={item.label} value={item.value} />
                ))}
              </div>

              {currentDetail.badges?.length ? (
                <div>
                  <div className={styles.label}>Active signatures</div>
                  <div className={styles.chipRow}>
                    {currentDetail.badges.map((badge) => (
                      <Chip key={badge} subtle onClick={() => setQuery(badge)}>
                        {badge}
                      </Chip>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className={styles.sectionsStack}>
                {currentDetail.sections.map((section) => (
                  <SectionBlock key={section.title} section={section} />
                ))}
              </div>

              {currentDetail.related?.length ? (
                <div>
                  <div className={styles.label}>Related systems</div>
                  <div className={styles.relatedGrid}>
                    {currentDetail.related.map((item) => (
                      <button key={item.slug} type="button" className={styles.relatedCard} onClick={() => setActiveSlug(item.slug)}>
                        <div className={styles.relatedTop}>
                          <span className={styles.relatedIcon}>{item.icon}</span>
                          <span className={styles.relatedKind}>{item.kind}</span>
                        </div>
                        <div className={styles.relatedName}>{item.name}</div>
                        <div className={styles.relatedTeaser}>{item.teaser}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
