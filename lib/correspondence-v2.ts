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
