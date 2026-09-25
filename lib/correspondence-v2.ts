export type CodexEntry = {
  id: string
  label: string
  sourceSystem: string
  sourceSystemLabel: string
  sourceRow: number
  fieldMask: number
  traditions: string[]
  searchHint: string
  ambiguous: boolean
  parallelCount: number
  relatedCount: number
}

export type CodexFacet = { value: string; label: string; count: number }
export type CodexIndex = {
  schemaVersion: string
  source: { file: string; sha256: string; importedRows: number; note: string }
  fields: { value: string; label: string }[]
  facets: { sourceSystems: CodexFacet[]; fields: CodexFacet[]; traditions: CodexFacet[] }
  stats: { entryCount: number; sourceSystemCount: number; mappingCount: number; ambiguousEntryLabelCount: number }
  entries: CodexEntry[]
}
export type CodexDetail = {
  id: string
  label: string
  sourceSystem: string
  sourceSystemLabel: string
  sourceRow: number
  mappings: { key: string; label: string; raw: string; values: { raw: string; label: string; traditions: string[] }[] }[]
  conflicts: { id: string; label: string; sourceSystemLabel: string; sourceRow: number; kind: string; differingFields: string[] }[]
  related: { id: string; label: string; sourceSystemLabel: string; sourceRow: number; kind: string; sharedFields: string[]; sharedValues: string[] }[]
  source: { sourceFile: string; sourceSha256: string; sourceRow: number; note: string }
}

const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase('en-US').trim()

export function filterCodexEntries(index: CodexIndex, filters: { query?: string; system?: string; field?: string; tradition?: string }) {
  const query = normalize(filters.query ?? '')
  const fieldPosition = filters.field ? index.fields.findIndex((field) => field.value === filters.field) : -1
  return index.entries.filter((entry) => {
    if (filters.system && entry.sourceSystem !== filters.system) return false
    if (fieldPosition >= 0 && (entry.fieldMask & (1 << fieldPosition)) === 0) return false
    if (filters.tradition && !entry.traditions.includes(filters.tradition)) return false
    if (query && !normalize(`${entry.label} ${entry.sourceSystemLabel} ${entry.searchHint}`).includes(query)) return false
    return true
  })
}

/** Stable UTC daily selection, not a data-driven claim about the day's cosmology. */
export function pickDailyEntry<T>(entries: T[], date: string): T | undefined {
  if (!entries.length) return undefined
  let hash = 2166136261
  for (const char of date) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0
  return entries[hash % entries.length]
}

export function detailUrl(id: string) {
  // IDs are generated from slugs and row numbers; never allow a path traversal in remote data.
  if (!/^[a-z0-9-]+--[a-z0-9-]+--r\d+$/.test(id)) throw new Error('Invalid correspondence ID')
  return `/data/correspondence-v2/details/${id}.json`
}

/** Only navigate to a source-system row when the matrix actually contains it. */
export function findMappedEntry(index: CodexIndex, system: string, value: string, traditions: string[] = []): CodexEntry | null {
  const key = comparableName(value.replace(/^\d+\.\s*/, ''))
  const candidates = index.entries.filter((entry) => entry.sourceSystem === system &&
    comparableName(entry.label.replace(/\s*\[[^\]]+\]$/, '')) === key)
  if (candidates.length < 2) return candidates[0] ?? null
  const qualified = candidates.find((entry) => traditions.some((tag) =>
    entry.label.toLocaleLowerCase().endsWith(`[${tag.toLocaleLowerCase()}]`)))
  // Parallel source rows remain separate. Their detail page exposes variants.
  return qualified ?? candidates[0]
}

export function codexSystemHref(index: CodexIndex, system: string): string | null {
  return index.facets.sourceSystems.some((facet) => facet.value === system)
    ? `/correspondence-engine?system=${encodeURIComponent(system)}` : null
}

export function codexEntryHref(entry: CodexEntry): string {
  return `/correspondence-engine?system=${encodeURIComponent(entry.sourceSystem)}&entry=${encodeURIComponent(entry.id)}`
}

/** When no standalone target row exists, keep the value anchored to its source row. */
export function codexFocusHref(sourceId: string, system: string, value: string): string {
  detailUrl(sourceId)
  const params = new URLSearchParams({ entry: sourceId, focusSystem: system, focusValue: value })
  return `/correspondence-engine?${params.toString()}`
}

// Presentation only: these swatches never assert metaphysical or historical meaning.
const PALETTE: Record<string, string> = {
  red: '#c84d52', crimson: '#aa3954', orange: '#de8747', yellow: '#e7bd4e',
  gold: '#e1b95e', green: '#61aa78', emerald: '#48a588', blue: '#649bc9',
  indigo: '#6972b4', violet: '#a27bc9', pink: '#d78ba8', copper: '#b8795d',
  silver: '#b7c5d5', white: '#e6e9ec', black: '#575769', grey: '#969bad',
}
const CHAKRA_PALETTE: Record<string, string> = {
  'root-muladhara': PALETTE.red, 'sacral-svadhisthana': PALETTE.orange,
  'solar-plexus-manipura': PALETTE.yellow, 'heart-anahata': PALETTE.green,
  'throat-vishuddha': PALETTE.blue, 'ajna-third-eye': PALETTE.indigo,
  'crown-sahasrara': PALETTE.violet,
}
const SYMBOLS: Record<string, string> = {
  circle: 'circle', triangle: 'triangle', square: 'square', cube: 'cube',
  sphere: 'circle', hexagon: 'hexagon', hexagram: 'hexagram', pentagon: 'pentagon',
  pentagram: 'pentagram', tetrahedron: 'tetrahedron', hexahedron: 'cube',
  octahedron: 'octahedron', dodecahedron: 'dodecahedron', icosahedron: 'icosahedron',
}
export function visualForMapping(system: string, label: string): { color?: string; symbol?: string } {
  const name = normalize(label)
  if (system === 'COLORS') return { color: PALETTE[name] }
  if (system === 'CHAKRAS') return { color: CHAKRA_PALETTE[name] }
  if (system === 'GEOMETRY' || system === 'PLATONIC_SOLIDS') return { symbol: SYMBOLS[name] }
  return {}
}

export type ClassicCatalogEntry = { slug: string; name: string; kind: string; icon?: string; summary?: string }
const comparableName = (value: string) => value.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '')

/** Keep classic-only material separate from the sourced CSV rows. */
export function classicOnlyEntries(index: CodexIndex, classic: ClassicCatalogEntry[]): ClassicCatalogEntry[] {
  const matrixNames = new Set(index.entries.map((entry) => comparableName(entry.label.replace(/\s*\[[^\]]+\]$/, ''))))
  return classic.filter((entry) => !matrixNames.has(comparableName(entry.name)))
}

export function classicEntryHref(slug: string): string {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error('Invalid classic entry slug')
  return `/correspondence-engine/classic?entry=${encodeURIComponent(slug)}`
}
