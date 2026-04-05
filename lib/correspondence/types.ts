/**
 * Types for the Correspondence Codex system.
 * Represents the shape of correspondence entries from index.json
 * and the derived structures used by the engine and UI.
 */

export interface CorrespondenceEntry {
  /** Unique slug identifier */
  slug: string
  /** Display name */
  name: string
  /** Icon character or emoji */
  icon?: string
  /** Category kind (e.g. 'symbol', 'archetype', 'practice') */
  kind?: string
  /** Short one-line description */
  teaser?: string
  /** Full summary/description paragraph */
  summary?: string
  /** Pre-built search-optimized text combining name + summary + teaser */
  searchText?: string
  /** Badge labels for visual display */
  badges?: string[]
  /** Symbolic families this entry belongs to */
  families?: string[]
  /** System→values mapping for cross-tradition comparison */
  systemsSummary?: Record<string, string[]>
  /** Optional extended description (not always present) */
  description?: string
  /** References to related entries by slug */
  related?: string[]
}

export interface CorrespondenceIndex {
  version: string
  generated: string
  /** Root-level families array (v2.x format) */
  families?: Array<{
    key: string
    label: string
    icon: string
    count?: number
  }>
  /** Meta wrapper containing families (v2.0.0+ format) */
  meta?: {
    version: string
    generatedAt?: string
    generated?: string
    total?: number
    families?: Array<{
      key: string
      label: string
      icon: string
      count?: number
    }>
    [key: string]: any
  }
  entries: CorrespondenceEntry[]
}

export interface CrossRefByFamily {
  family: string
  familyLabel: string
  familyIcon: string
  entries: MatchedEntry[]
}

export interface MatchedEntry {
  slug: string
  name: string
  icon: string
  kind: string
  families: string[]
  relevanceScore: number
  matchedOn: string[]
  systemsSummary: Record<string, string[]>
}
