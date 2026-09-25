'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CodexDetail, CodexEntry, CodexIndex } from '@/lib/correspondence-v2'
import { detailUrl, filterCodexEntries, pickDailyEntry } from '@/lib/correspondence-v2'
import styles from './CorrespondenceCodexV2.module.css'

const INDEX_URL = '/data/correspondence-v2/index.json'

export default function CorrespondenceCodexV2() {
  const [index, setIndex] = useState<CodexIndex | null>(null)
  const [loadError, setLoadError] = useState('')
  const [query, setQuery] = useState('')
  const [system, setSystem] = useState('')
  const [field, setField] = useState('')
  const [tradition, setTradition] = useState('')
  const [selected, setSelected] = useState('')
  const [detail, setDetail] = useState<CodexDetail | null>(null)
  const [detailError, setDetailError] = useState('')
  const [pinned, setPinned] = useState('')
  const [pinnedDetail, setPinnedDetail] = useState<CodexDetail | null>(null)
  const [visible, setVisible] = useState(36)
  const searchRef = useRef<HTMLInputElement>(null)
  const detailCache = useRef(new Map<string, CodexDetail>())

  useEffect(() => {
    const controller = new AbortController()
    fetch(INDEX_URL, { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error(`Index unavailable (${response.status})`)
      const parsed = await response.json() as CodexIndex
      if (parsed.schemaVersion !== 'correspondence-codex-v2' || !Array.isArray(parsed.entries)) throw new Error('Invalid Codex index')
      setIndex(parsed)
      const requested = new URLSearchParams(window.location.search).get('entry')
      const today = new Date().toISOString().slice(0, 10)
      setSelected(parsed.entries.find((entry) => entry.id === requested)?.id ?? pickDailyEntry(parsed.entries, today)?.id ?? '')
    }).catch((error: Error) => { if (!controller.signal.aborted) setLoadError(error.message) })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
      const tag = (event.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      event.preventDefault()
      searchRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const loadDetail = useCallback(async (id: string, signal?: AbortSignal) => {
    const cached = detailCache.current.get(id)
    if (cached) return cached
    const response = await fetch(detailUrl(id), { signal })
    if (!response.ok) throw new Error(`Entry unavailable (${response.status})`)
    const loaded = await response.json() as CodexDetail
    if (loaded.id !== id || !Array.isArray(loaded.mappings)) throw new Error('Invalid entry data')
    detailCache.current.set(id, loaded)
    return loaded
  }, [])

  useEffect(() => {
    if (!selected) return
    const controller = new AbortController()
    setDetail(null)
    setDetailError('')
    loadDetail(selected, controller.signal).then((item) => { if (!controller.signal.aborted) setDetail(item) })
      .catch((error: Error) => { if (!controller.signal.aborted) setDetailError(error.message) })
    return () => controller.abort()
  }, [selected, loadDetail])

  useEffect(() => {
    if (!pinned) { setPinnedDetail(null); return }
    const controller = new AbortController()
    loadDetail(pinned, controller.signal).then((item) => { if (!controller.signal.aborted) setPinnedDetail(item) })
      .catch(() => { if (!controller.signal.aborted) setPinnedDetail(null) })
    return () => controller.abort()
  }, [pinned, loadDetail])

  const choose = (entry: CodexEntry | string) => {
    const id = typeof entry === 'string' ? entry : entry.id
    setSelected(id)
    const url = new URL(window.location.href)
    url.searchParams.set('entry', id)
    window.history.replaceState(null, '', url.pathname + url.search)
  }
  const results = useMemo(() => index ? filterCodexEntries(index, { query, system, field, tradition }) : [], [index, query, system, field, tradition])
  const selectedEntry = index?.entries.find((item) => item.id === selected)
  const chooseDaily = () => {
    if (!index) return
    const entry = pickDailyEntry(index.entries, new Date().toISOString().slice(0, 10))
    if (entry) choose(entry)
  }
  const chooseSurprise = () => {
    if (!index) return
    const pool = results.length ? results : index.entries
    const random = pool[Math.floor(Math.random() * pool.length)]
    if (random) choose(random)
  }

  return <div className={styles.shell}>
    <div className={styles.stars} aria-hidden="true" />
    <header className={styles.hero}>
      <p className={styles.eyebrow}>THE VAULT OF ARCANA · CORRESPONDENCE CODEX · V2</p>
      <h1>Everything speaks <em>in relation.</em></h1>
      <p className={styles.lede}>Explore a 27-system matrix, trace unexpected echoes between traditions, and keep every claim attached to its original row. A living atlas for inquiry—not a map of absolute truths.</p>
      <div className={styles.metrics} aria-label="Codex scope">
        <span><strong>824</strong> source rows</span><span><strong>27</strong> systems</span><span><strong>1</strong> matrix, many perspectives</span>
      </div>
      <div className={styles.heroActions}>
        <button type="button" onClick={chooseDaily} disabled={!index}>Open today’s doorway</button>
        <button type="button" onClick={chooseSurprise} disabled={!index} className={styles.secondary}>Surprise me ↗</button>
      </div>
    </header>

    {loadError && <p role="alert" className={styles.error}>The Codex index could not load: {loadError}. <button onClick={() => window.location.reload()}>Retry</button></p>}
    {!index && !loadError && <p role="status" className={styles.loading}>Opening the atlas…</p>}
    {index && <div className={styles.workspace}>
      <aside className={styles.explorer} aria-label="Browse correspondences">
        <div className={styles.explorerHeading}><span>01 / THE ATLAS</span><strong>{results.length} entries</strong></div>
        <label htmlFor="codex-search" className={styles.label}>Search names and preview links</label>
        <input id="codex-search" ref={searchRef} value={query} onChange={(event) => { setQuery(event.target.value); setVisible(36) }} placeholder="Try Venus, Hecate, Manipura…  /" className={styles.search} autoComplete="off" />
        <div className={styles.filters}>
          <label>Source system<select value={system} onChange={(event) => { setSystem(event.target.value); setVisible(36) }}><option value="">All 27 systems</option>{index.facets.sourceSystems.map((facet) => <option key={facet.value} value={facet.value}>{facet.label} ({facet.count})</option>)}</select></label>
          <label>Correspondence field<select value={field} onChange={(event) => { setField(event.target.value); setVisible(36) }}><option value="">Any field</option>{index.facets.fields.map((facet) => <option key={facet.value} value={facet.value}>{facet.label} ({facet.count})</option>)}</select></label>
          <label>Source annotation<select value={tradition} onChange={(event) => { setTradition(event.target.value); setVisible(36) }}><option value="">Any annotation</option>{index.facets.traditions.map((facet) => <option key={facet.value} value={facet.value}>{facet.value} ({facet.count})</option>)}</select></label>
        </div>
        <p className={styles.smallNote}>Search previews are intentionally compact. Open a row to see all 27 fields verbatim, including qualified and conflicting mappings.</p>
        <div className={styles.results} aria-live="polite">
          {results.slice(0, visible).map((entry) => <button type="button" key={entry.id} onClick={() => choose(entry)} className={`${styles.result} ${selected === entry.id ? styles.activeResult : ''}`} aria-current={selected === entry.id ? 'true' : undefined}>
            <span className={styles.resultLine}><strong>{entry.label}</strong><span>{entry.sourceSystemLabel}</span></span>
            <span className={styles.preview}>{entry.searchHint || `${entry.relatedCount} related entries`}</span>
            {entry.ambiguous && <small>Parallel readings · {entry.parallelCount + 1} rows</small>}
          </button>)}
          {!results.length && <p className={styles.smallNote}>No source rows match these filters. Try clearing a field.</p>}
        </div>
        {visible < results.length && <button type="button" className={styles.more} onClick={() => setVisible((count) => count + 36)}>Show more · {results.length - visible} remain</button>}
      </aside>
      <section className={styles.detailArea} id="codex-detail" aria-label="Selected correspondence">
        <div className={styles.detailTop}><span>02 / THE READING</span><span>Source row {selectedEntry?.sourceRow ?? '—'}</span></div>
        {detailError && <p role="alert" className={styles.error}>Could not open this entry: {detailError}</p>}
        {!detail && !detailError && <p role="status" className={styles.loading}>Reading the source row…</p>}
        {detail && <>
          <div className={styles.detailIntro}><div><p className={styles.eyebrow}>{detail.sourceSystemLabel} · SOURCE ROW {detail.sourceRow}</p><h2>{detail.label}</h2><p>Mappings in this row are presented as the uploaded matrix states them, without collapsing neighboring traditions into a single definitive lineage.</p></div>
            <div className={styles.detailActions}><button type="button" onClick={() => setPinned((previous) => previous === detail.id ? '' : detail.id)}>{pinned === detail.id ? 'Unpin' : 'Pin for comparison'}</button><button type="button" onClick={() => navigator.clipboard?.writeText(window.location.href)}>Copy link</button></div>
          </div>
          <div className={styles.mappingGrid}>{detail.mappings.map((mapping) => <section className={styles.mapping} key={mapping.key}><h3>{mapping.label}</h3><div className={styles.values}>{mapping.values.map((value, n) => <span key={`${mapping.key}-${n}`} className={styles.value}>{value.label}{value.traditions.map((tag) => <small key={tag}>{tag}</small>)}</span>)}</div></section>)}</div>
          {detail.conflicts.length > 0 && <section className={styles.relatedBlock}><h3>Parallel source assertions</h3><p>Same or normalized name, separate rows. Variants are not silently merged.</p>{detail.conflicts.map((link) => <button key={link.id} type="button" onClick={() => choose(link.id)}>{link.label} · {link.sourceSystemLabel} · row {link.sourceRow} <small>{link.kind === 'mapping-variant' ? `Different fields: ${link.differingFields.join(', ')}` : 'Duplicate source assertion'}</small></button>)}</section>}
          {detail.related.length > 0 && <section className={styles.relatedBlock}><h3>Follow the thread</h3><p>Shared values in the uploaded matrix suggest paths to explore; they do not establish historical influence.</p>{detail.related.map((link) => <button key={link.id} type="button" onClick={() => choose(link.id)}>{link.label} <span>↗</span><small>{link.sourceSystemLabel} · row {link.sourceRow}{link.sharedValues.length ? ` · ${link.sharedValues.slice(0, 2).join(' / ')}` : ''}</small></button>)}</section>}
          <div className={styles.provenance}><strong>THE SOURCE LENS</strong><p>Imported from {detail.source.sourceFile}, row {detail.source.sourceRow}. SHA-256: <code>{detail.source.sourceSha256}</code></p><p>{detail.source.note} Values may encode contested, syncretic, or modern interpretations; check primary sources before treating a mapping as canonical, medical, or causal.</p></div>
        </>}
        {pinnedDetail && <section className={styles.pinPanel} aria-label="Pinned correspondence for comparison"><div><span>03 / COMPARE</span><button type="button" onClick={() => setPinned('')} aria-label="Remove pinned entry">✕</button></div><h3>{pinnedDetail.label}</h3><p>{pinnedDetail.sourceSystemLabel} · row {pinnedDetail.sourceRow}</p><div className={styles.pinMappings}>{pinnedDetail.mappings.map((mapping) => <p key={mapping.key}><strong>{mapping.label}</strong> {mapping.values.map((value) => value.label).join(' · ')}</p>)}</div></section>}
      </section>
    </div>}
    <footer className={styles.footer}>Source: the uploaded Super Matrix v3 · 824 preserved rows · no vector queries or heavy imagery required to browse. <a href="/oracle">Take a question to the Oracle ↗</a> <a href="/correspondence-engine/classic">Open the classic engine ↗</a></footer>
  </div>
}
