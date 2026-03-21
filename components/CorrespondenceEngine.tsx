'use client';

import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import styles from './correspondence-engine.module.css';
import {
  FAMILY_ORDER,
  fetchCorrespondenceDetail,
  fetchCorrespondenceIndex,
  filterIndexItems,
  topSuggestions,
} from '../lib/correspondence-engine';

/* ─── Sub-Components ─────────────────────────────────────── */

function KindDot({ kind }) {
  const colors = {
    planet: '#C9A84C',
    zodiac: '#7B5EA7',
    tarot: '#9B5EA7',
    crystal: '#5EA8C9',
    plant: '#5EC97B',
    deity: '#C97B5E',
    rune: '#C9C95E',
    iching: '#5E9EC9',
    kabbalah: '#C95E9E',
    letter: '#9EC95E',
    geomancy: '#5EC9C9',
  };
  return (
    <span
      className={styles.kindDot}
      style={{ background: colors[kind] || '#6b6580' }}
      title={kind}
    />
  );
}

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
        <div className={styles.resultIconWrap}>
          <span className={styles.resultIcon}>{item.icon}</span>
          <KindDot kind={item.kind} />
        </div>
        <span className={styles.resultKind}>{item.kind}</span>
      </div>
      <div className={styles.resultName}>{item.name}</div>
      <div className={styles.resultTeaser}>{item.teaser || item.summary}</div>
      {item.badges?.length ? (
        <div className={styles.badgeRow}>
          {item.badges.slice(0, 4).map((badge) => (
            <span key={badge} className={styles.badge}>{badge}</span>
          ))}
        </div>
      ) : null}
    </button>
  );
}

function OverviewCard({ label, value, onClick }) {
  return (
    <div className={`${styles.overviewCard} ${onClick ? styles.overviewCardClickable : ''}`} onClick={onClick || undefined}>
      <div className={styles.overviewLabel}>{label}</div>
      <div className={styles.overviewValue}>{value}</div>
    </div>
  );
}

function SectionBlock({ section, onFieldClick }) {
  return (
    <div className={styles.sectionBlock}>
      <div className={styles.sectionTitle}>{section.title}</div>
      <div className={styles.sectionItems}>
        {section.items.map((item, index) => (
          <div key={`${section.title}-${item.label}-${index}`} className={styles.sectionItem}>
            <div className={styles.sectionLabel}>{item.label}</div>
            <div
              className={styles.sectionValue}
              onClick={() => onFieldClick && item.value && onFieldClick(item.value)}
              title="Click to search this value"
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingSpinner({ message }) {
  return (
    <div className={styles.spinnerWrap}>
      <div className={styles.spinner} />
      <span>{message}</span>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */

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
  const [activeTab, setActiveTab] = useState('overview');
  const [sortBy, setSortBy] = useState('name');
  const searchRef = useRef(null);
  const detailRef = useRef(null);

  /* Debounce search */
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 200);
    return () => window.clearTimeout(timer);
  }, [query]);

  /* Load index */
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
    return () => { cancelled = true; };
  }, [initialSlug]);

  /* Sync slug when family/query changes */
  useEffect(() => {
    if (!filtered.length) return;
    const exists = filtered.some((entry) => entry.slug === activeSlug);
    if (!exists) {
      setActiveSlug(sortBy === 'name' ? filtered[0].slug : filtered[0].slug);
    }
  }, [filtered, activeSlug]);

  /* Load detail */
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

  /* Scroll detail into view on change */
  useEffect(() => {
    if (detailRef.current && activeSlug) {
      detailRef.current.scrollTop = 0;
    }
  }, [activeSlug]);

  /* Families */
  const families = useMemo(() => {
    if (!indexData?.meta?.families) return [];
    return [...indexData.meta.families].sort((a, b) => {
      const ai = FAMILY_ORDER.indexOf(a.key);
      const bi = FAMILY_ORDER.indexOf(b.key);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
  }, [indexData]);

  /* Filtered + sorted results */
  const filtered = useMemo(() => {
    if (!indexData?.entries) return [];
    let items = filterIndexItems(indexData.entries, debouncedQuery, family);
    if (sortBy === 'kind') {
      items = [...items].sort((a, b) => a.kind.localeCompare(b.kind));
    } else if (sortBy === 'name') {
      items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    }
    return items;
  }, [indexData, debouncedQuery, family, sortBy]);

  /* Suggestions */
  const suggestions = useMemo(() => {
    if (!indexData?.entries) return [];
    return topSuggestions(indexData.entries, debouncedQuery, family);
  }, [indexData, debouncedQuery, family]);

  /* Current detail */
  const currentDetail = activeSlug ? detailCache[activeSlug] : null;

  /* Popular for family */
  const popularForFamily = useMemo(() => {
    if (!indexData?.meta?.popularByFamily) return [];
    return indexData.meta.popularByFamily[family] || [];
  }, [indexData, family]);

  /* Handlers */
  const handleSelect = useCallback((slug) => {
    setActiveSlug(slug);
    setActiveTab('overview');
  }, []);

  const handleFieldClick = useCallback((value) => {
    setQuery(String(value).split(/[,;·]/)[0].trim());
  }, []);

  const handleRandom = useCallback(() => {
    if (!filtered.length) return;
    const pick = filtered[Math.floor(Math.random() * filtered.length)];
    setActiveSlug(pick.slug);
    setActiveTab('overview');
  }, [filtered]);

  const handleClearSearch = useCallback(() => {
    setQuery('');
    searchRef.current?.focus();
  }, []);

  const handleKeyInSearch = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filtered.length > 0) handleSelect(filtered[0].slug);
    }
    if (e.key === 'Escape') {
      handleClearSearch();
    }
  }, [filtered, handleSelect, handleClearSearch]);

  /* ─── Loading ─── */
  if (status.loading) {
    return (
      <div className={styles.engine}>
        <div className={styles.hero}>
          <div className={styles.heroEyebrow}>Tekabülât Kodeksi</div>
          <h1 className={styles.heroTitle}>Correspondence Codex</h1>
        </div>
        <LoadingSpinner message="Loading correspondence index…" />
      </div>
    );
  }

  if (status.error) {
    return (
      <div className={styles.engine}>
        <div className={styles.hero}>
          <div className={styles.heroEyebrow}>Tekabülât Kodeksi</div>
          <h1 className={styles.heroTitle}>Correspondence Codex</h1>
        </div>
        <div className={styles.status}>{status.error}</div>
      </div>
    );
  }

  if (!indexData) {
    return (
      <div className={styles.engine}>
        <div className={styles.status}>No correspondence data is available.</div>
      </div>
    );
  }

  return (
    <div className={styles.engine}>
      {/* ─── Hero ─── */}
      <div className={styles.hero}>
        <div className={styles.heroEyebrow}>✦ Tekabülât Kodeksi ✦</div>
        <h1 className={styles.heroTitle}>Correspondence Codex</h1>
        <p className={styles.heroText}>
          30+ years of esoteric research mapped across planets, symbols, frequencies, geometries, and sacred systems.
          410+ entries cross-linked across 12 dimensions.
        </p>
      </div>

      {/* ─── Controls ─── */}
      <div className={styles.controlShell}>
        {/* Search */}
        <label className={styles.searchWrap}>
          <div className={styles.searchInputRow}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={searchRef}
              className={styles.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyInSearch}
              placeholder="Venus, Root chakra, 528 Hz, Aleph, Calcination, Rose…"
            />
            {query && (
              <button className={styles.clearBtn} onClick={handleClearSearch} title="Clear search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
            <button className={styles.randomBtn} onClick={handleRandom} title="Random entry">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
              </svg>
            </button>
          </div>
          <span className={styles.helper}>
            Kabbalah / Qabalah, I‑Ching, frequency / Hz, and more — forgiving search.
          </span>
        </label>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div>
            <div className={styles.label}>Quick match</div>
            <div className={styles.chipRow}>
              {suggestions.map((item) => (
                <Chip key={item.slug} subtle onClick={() => handleSelect(item.slug)}>
                  {item.icon} {item.label}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {/* Family Filter */}
        <div>
          <div className={styles.label}>Browse by Family</div>
          <div className={styles.chipRow}>
            <Chip active={family === 'all'} count={indexData.entries.length} onClick={() => setFamily('all')}>
              ◈ All
            </Chip>
            {families.map((item) => (
              <Chip key={item.key} active={family === item.key} count={item.count} onClick={() => setFamily(item.key)}>
                {item.icon} {item.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* Quick Paths */}
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

        {/* Popular in family */}
        {popularForFamily.length > 0 && family !== 'all' && (
          <div>
            <div className={styles.label}>Popular in {family}</div>
            <div className={styles.chipRow}>
              {popularForFamily.slice(0, 12).map((item) => (
                <Chip key={item.value} subtle onClick={() => setQuery(item.value)}>
                  {item.value}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── Main Layout ─── */}
      <div className={styles.layout}>
        {/* Results Pane */}
        <div className={styles.resultsPane}>
          <div className={styles.resultsHeader}>
            <div>
              <div className={styles.label}>Results</div>
              <div className={styles.resultsCount}>
                {filtered.length} {filtered.length === 1 ? 'node' : 'nodes'}
                {family !== 'all' && ` in ${family}`}
                {debouncedQuery && ` matching "${debouncedQuery}"`}
              </div>
            </div>
            <div className={styles.sortRow}>
              <button
                className={`${styles.sortBtn} ${sortBy === 'name' ? styles.sortBtnActive : ''}`}
                onClick={() => setSortBy('name')}
                title="Sort by name"
              >A–Z</button>
              <button
                className={`${styles.sortBtn} ${sortBy === 'kind' ? styles.sortBtnActive : ''}`}
                onClick={() => setSortBy('kind')}
                title="Sort by kind"
              >Type</button>
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className={styles.resultsGrid}>
              {filtered.map((item) => (
                <ResultCard
                  key={item.slug}
                  item={item}
                  active={item.slug === activeSlug}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>◎</div>
              <div className={styles.emptyTitle}>No nodes found</div>
              <div className={styles.emptyText}>Try a broader family or a different search phrase.</div>
              <button className={styles.emptyBtn} onClick={handleClearSearch}>Clear search</button>
            </div>
          )}
        </div>

        {/* Detail Pane */}
        <div className={styles.detailPane} ref={detailRef}>
          {detailError && (
            <div className={styles.status}>{detailError}</div>
          )}

          {detailLoading && !currentDetail && (
            <LoadingSpinner message="Loading entry…" />
          )}

          {currentDetail ? (
            <>
              {/* Detail Hero */}
              <div className={styles.detailHero}>
                <div className={styles.detailSymbol}>{currentDetail.icon}</div>
                <div>
                  <div className={styles.detailTitle}>{currentDetail.name}</div>
                  <div className={styles.detailSubtitle}>{currentDetail.subtitle || currentDetail.kind}</div>
                </div>
              </div>

              {/* Flow Block */}
              {currentDetail.flowText && (
                <div className={styles.flowBlock}>
                  {currentDetail.flowText || currentDetail.summary}
                </div>
              )}

              {/* Tab Navigation */}
              <div className={styles.detailTabs}>
                <button
                  className={`${styles.detailTab} ${activeTab === 'overview' ? styles.detailTabActive : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={`${styles.detailTab} ${activeTab === 'details' ? styles.detailTabActive : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  Full Details
                </button>
                <button
                  className={`${styles.detailTab} ${activeTab === 'related' ? styles.detailTabActive : ''}`}
                  onClick={() => setActiveTab('related')}
                >
                  Related
                </button>
              </div>

              {/* ─── Overview ─── */}
              {activeTab === 'overview' && (
                <div className={styles.tabContent}>
                  <div className={styles.overviewGrid}>
                    {currentDetail.overview.slice(0, 18).map((item) => (
                      <OverviewCard
                        key={item.key}
                        label={item.label}
                        value={item.value}
                        onClick={() => handleFieldClick(item.value)}
                      />
                    ))}
                  </div>

                  {/* Quick badges */}
                  {currentDetail.badges?.length > 0 && (
                    <div className={styles.quickBadges}>
                      <div className={styles.label}>Active signatures — click to search</div>
                      <div className={styles.chipRow}>
                        {currentDetail.badges.map((badge) => (
                          <Chip key={badge} subtle onClick={() => setQuery(badge)}>
                            {badge}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mini related */}
                  {currentDetail.related?.length > 0 && (
                    <div className={styles.miniRelated}>
                      <div className={styles.label}>Most related</div>
                      <div className={styles.miniRelatedGrid}>
                        {currentDetail.related.slice(0, 6).map((item) => (
                          <button
                            key={item.slug}
                            className={styles.miniRelatedCard}
                            onClick={() => handleSelect(item.slug)}
                          >
                            <span className={styles.miniRelatedIcon}>{item.icon}</span>
                            <span className={styles.miniRelatedName}>{item.name}</span>
                            <span className={styles.miniRelatedKind}>{item.kind}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ─── Full Details ─── */}
              {activeTab === 'details' && (
                <div className={styles.tabContent}>
                  <div className={styles.sectionsStack}>
                    {currentDetail.sections.map((section) => (
                      <SectionBlock
                        key={section.title}
                        section={section}
                        onFieldClick={handleFieldClick}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ─── Related ─── */}
              {activeTab === 'related' && (
                <div className={styles.tabContent}>
                  {/* Related systems */}
                  {currentDetail.related?.length > 0 && (
                    <div className={styles.relatedSection}>
                      <div className={styles.label}>All related systems</div>
                      <div className={styles.relatedGrid}>
                        {currentDetail.related.map((item) => (
                          <button
                            key={item.slug}
                            className={styles.relatedCard}
                            onClick={() => handleSelect(item.slug)}
                          >
                            <div className={styles.relatedTop}>
                              <div className={styles.relatedIconWrap}>
                                <span className={styles.relatedIcon}>{item.icon}</span>
                                <KindDot kind={item.kind} />
                              </div>
                              <span className={styles.relatedKind}>{item.kind}</span>
                            </div>
                            <div className={styles.relatedName}>{item.name}</div>
                            <div className={styles.relatedTeaser}>{item.teaser}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Allies: crystals */}
                  {currentDetail.allies?.crystals?.length > 0 && (
                    <div className={styles.relatedSection}>
                      <div className={styles.label}>Allied crystals</div>
                      <div className={styles.chipRow}>
                        {currentDetail.allies.crystals.map((c) => (
                          <Chip key={c.slug} subtle onClick={() => handleSelect(c.slug)}>
                            {c.icon} {c.name}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Allies: plants */}
                  {currentDetail.allies?.plants?.length > 0 && (
                    <div className={styles.relatedSection}>
                      <div className={styles.label}>Allied plants</div>
                      <div className={styles.chipRow}>
                        {currentDetail.allies.plants.map((c) => (
                          <Chip key={c.slug} subtle onClick={() => handleSelect(c.slug)}>
                            {c.icon} {c.name}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Allies: deities */}
                  {currentDetail.allies?.deities?.length > 0 && (
                    <div className={styles.relatedSection}>
                      <div className={styles.label}>Allied deities &amp; archetypes</div>
                      <div className={styles.chipRow}>
                        {currentDetail.allies.deities.map((c) => (
                          <Chip key={c.slug} subtle onClick={() => handleSelect(c.slug)}>
                            {c.icon} {c.name}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}

                  {!currentDetail.related?.length && !currentDetail.allies?.crystals?.length && (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyText}>No cross-references found.</div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>◎</div>
              <div className={styles.emptyTitle}>Select a node</div>
              <div className={styles.emptyText}>Choose from the results panel to explore correspondences.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
