/**
 * Cross-Link Injector for Vault of Arcana
 *
 * Takes essay HTML/markdown content and injects cross-links at the first
 * occurrence of glossary terms. Uses dotted gold underline style.
 *
 * Usage:
 *   import { injectCrossLinks } from '@/lib/cross-link-injector'
 *   const linkedHtml = injectCrossLinks(markdownContent, glossary, currentSlug)
 */

import glossaryData from './cross-link-glossary.json'

export type GlossaryEntry = {
  label: string
  codex: string | null
  oracle: string | null
  scroll: Array<{ slug: string; title: string }>
  library: Array<{ slug: string; title: string }>
  traditions: string[]
  aliases: string[]
}

export type Glossary = Record<string, GlossaryEntry>

export const glossary: Glossary = glossaryData as Glossary

// ─── Escape regex special characters ─────────────────────────────────────────
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// ─── Build flat alias list sorted by length (longest first) ──────────────────
// Each alias maps back to its glossary key
export function buildAliasList(gloss: Glossary): Array<{ alias: string; key: string; entry: GlossaryEntry }> {
  const list: Array<{ alias: string; key: string; entry: GlossaryEntry }> = []
  for (const [key, entry] of Object.entries(gloss)) {
    for (const alias of entry.aliases) {
      list.push({ alias, key, entry })
    }
  }
  // Longest alias first to prevent partial matches (e.g. "the sun" before "sun")
  list.sort((a, b) => b.alias.length - a.alias.length)
  return list
}

// ─── Get the best primary link target for a glossary entry ───────────────────
export type LinkTarget = { url: string; type: 'codex' | 'oracle' | 'scroll' | 'library' }

export function getBestLinkTarget(
  entry: GlossaryEntry,
  currentSlug?: string
): LinkTarget | null {
  // Codex gets priority
  if (entry.codex) return { url: entry.codex, type: 'codex' }
  // Then Oracle
  if (entry.oracle) return { url: entry.oracle, type: 'oracle' }
  // Then other Scroll essays (not the current one)
  const otherScrolls = entry.scroll.filter(s => s.slug !== currentSlug)
  if (otherScrolls.length > 0) return { url: `/blog/${otherScrolls[0].slug}`, type: 'scroll' }
  // Then Library
  if (entry.library.length > 0) return { url: `/library/${entry.library[0].slug}`, type: 'library' }
  return null
}

// ─── Build a cross-link HTML string ──────────────────────────────────────────
export function buildCrossLink(
  originalText: string,
  entry: GlossaryEntry,
  target: LinkTarget,
  glossaryKey: string
): string {
  const typeClass = `cross-link-${target.type}`
  const icon = getLinkIcon(target.type)

  return `<a href="${target.url}"
    class="cross-link ${typeClass}"
    data-glossary-key="${glossaryKey}"
    title="Explore ${entry.label} in the ${getDestinationName(target.type)}"
    rel="noopener noreferrer"
  >${originalText}${icon}</a>`
}

// ─── Link type icons ─────────────────────────────────────────────────────────
function getLinkIcon(type: LinkTarget['type']): string {
  switch (type) {
    case 'codex':   return '<sup class="cross-link-icon">◈</sup>'
    case 'oracle':  return '<sup class="cross-link-icon">✦</sup>'
    case 'scroll':  return '<sup class="cross-link-icon">↗</sup>'
    case 'library': return '<sup class="cross-link-icon">📖</sup>'
    default:        return ''
  }
}

function getDestinationName(type: LinkTarget['type']): string {
  switch (type) {
    case 'codex':   return 'Correspondence Codex'
    case 'oracle':  return 'Oracle'
    case 'scroll':  return 'Scroll'
    case 'library': return 'Library'
    default:        return ''
  }
}

// ─── Core injection function ─────────────────────────────────────────────────
/**
 * Injects cross-links into markdown content.
 * Only the FIRST occurrence of each glossary term gets linked.
 *
 * Strategy: Strip HTML tags → find aliases in plain text → inject cross-links
 * at the correct positions in the ORIGINAL content (preserving all HTML).
 *
 * @param content  - The markdown content to process
 * @param gloss    - The glossary object (defaults to the site's glossary)
 * @param currentSlug - Slug of the current essay (so we don't self-link)
 * @param maxLinks  - Maximum number of links to inject (default 10)
 */
export function injectCrossLinks(
  content: string,
  gloss: Glossary = glossary,
  currentSlug?: string,
  maxLinks: number = 10
): string {
  const aliasList = buildAliasList(gloss)
  const linkedTerms = new Set<string>()

  // ── Step 1: Collect protected regions (headings + markdown emphasis) ───────
  // These regions are skipped during alias matching so cross-links never
  // corrupt markdown syntax.
  const protectedRegions: Array<{ start: number; end: number }> = []

  // Heading lines: lines starting with # (any level)
  for (const match of content.matchAll(/^#{1,6}\s+[^\n]+/gm)) {
    protectedRegions.push({ start: match.index!, end: match.index! + match[0].length })
  }

  // Markdown inline emphasis: *text*, **text**, ~~strike~~, `code`
  // Match includes the delimiters so the whole span is protected.
  for (const match of content.matchAll(/(\*[^*]+\*|\*\*[^*]+\*\*|~~[^~]+~~|`[^`]+`)/g)) {
    protectedRegions.push({ start: match.index!, end: match.index! + match[0].length })
  }

  // Sort by start position
  protectedRegions.sort((a, b) => a.start - b.start)

  // ── Step 2: Build alias match list from PLAIN TEXT content ────────────────
  // Strip HTML tags for matching purposes only. We match against the text
  // visible to the user, then map back to positions in the original content.
  // Build a stripped version for plain-text searching
  let plainText = ''
  let htmlPositions: Array<{ plainIdx: number; htmlStart: number }> = []
  let inTag = false
  let plainIdx = 0

  for (let i = 0; i < content.length; i++) {
    if (content[i] === '<') {
      inTag = true
      htmlPositions.push({ plainIdx, htmlStart: i })
    } else if (content[i] === '>') {
      inTag = false
    } else if (!inTag) {
      plainText += content[i]
      plainIdx++
    }
  }

  // Find aliases in plain text, skipping protected regions
  type AliasMatch = { plainStart: number; plainEnd: number; alias: string; key: string; entry: GlossaryEntry }
  const aliasMatches: AliasMatch[] = []

  for (const { alias, key, entry } of aliasList) {
    if (linkedTerms.has(key)) continue

    const escapedAlias = escapeRegex(alias)
    const regex = new RegExp(`\\b(${escapedAlias})\\b`, 'i')

    const match = plainText.match(regex)
    if (!match) continue

    const plainStart = match.index!
    const plainEnd = plainStart + match[0].length

    // Skip if this position falls inside a protected region
    // (protected regions are in HTML coordinates — check against htmlPositions mapping)
    let inside = false
    // Find the HTML position range for this plain text range
    const relevantStarts = htmlPositions.filter(p => p.plainIdx >= plainStart && p.plainIdx < plainEnd)
    if (relevantStarts.length > 0) {
      inside = true
    }
    // Also check if the plain-text position maps through a protected region
    // by checking the original content ranges directly
    for (const prot of protectedRegions) {
      // The plainStart maps to an HTML position — find it
      for (let pi = 0; pi < htmlPositions.length; pi++) {
        const { plainIdx: pIdx, htmlStart } = htmlPositions[pi]
        if (pIdx === plainStart) {
          // Check if this HTML position is inside a protected region
          for (const prot of protectedRegions) {
            if (htmlStart >= prot.start && htmlStart < prot.end) {
              inside = true
              break
            }
          }
          break
        }
      }
      if (inside) break
    }

    if (!inside) {
      aliasMatches.push({
        plainStart,
        plainEnd,
        alias: match[0],
        key,
        entry,
      })
      linkedTerms.add(key)
    }
  }

  // Sort by position in plain text
  aliasMatches.sort((a, b) => a.plainStart - b.plainStart)

  // ── Step 3: Map plain-text positions back to original HTML positions ───────
  // Build a mapping: plainIdx → htmlIdx and plainIdx → inTag status
  // by scanning content and tracking whether we're inside a tag
  const plainToHtml: Map<number, number> = new Map()
  const plainInTag: Map<number, boolean> = new Map()
  let _inTag = false
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '<') {
      _inTag = true
      continue
    }
    if (content[i] === '>') {
      _inTag = false
      continue
    }
    if (!_inTag) {
      const nextIdx = plainToHtml.size
      plainToHtml.set(nextIdx, i)
      plainInTag.set(nextIdx, _inTag)
    }
  }

  // ── Step 4: Build the result by injecting cross-links into original HTML ───
  // Work backwards from the end to preserve position indices
  let result = content
  for (const m of aliasMatches) {
    const htmlStart = plainToHtml.get(m.plainStart)
    const htmlEnd = plainToHtml.get(m.plainEnd - 1)
    if (htmlStart === undefined || htmlEnd === undefined) continue

    // Skip if this match falls inside an HTML tag attribute — prevents double-linking
    // when a previous cross-link injection put this text inside data-glossary-key=""
    let insideTag = false
    for (let pi = m.plainStart; pi < m.plainEnd; pi++) {
      if (plainInTag.get(pi)) { insideTag = true; break }
    }
    if (insideTag) continue

    const target = getBestLinkTarget(m.entry, currentSlug)
    if (!target) continue

    const crossLink = buildCrossLink(m.alias, m.entry, target, m.key)
    // Replace the text portion in the original HTML
    const before = result.substring(0, htmlStart)
    const after = result.substring(htmlEnd + 1)
    result = before + crossLink + after
  }

  return result
}

// ─── Get all available destinations for a term (for popover) ─────────────────
export type AllDestinations = {
  codex?: string
  oracle?: string
  scroll: Array<{ slug: string; title: string; url: string }>
  library: Array<{ slug: string; title: string; url: string }>
}

export function getAllDestinations(entry: GlossaryEntry, currentSlug?: string): AllDestinations {
  return {
    codex: entry.codex ?? undefined,
    oracle: entry.oracle ?? undefined,
    scroll: entry.scroll
      .filter(s => s.slug !== currentSlug)
      .map(s => ({ ...s, url: `/blog/${s.slug}` })),
    library: entry.library.map(s => ({ ...s, url: `/library/${s.slug}` }))
  }
}

// ─── Build popover HTML for a glossary entry ─────────────────────────────────
export function buildPopoverHTML(entry: GlossaryEntry, currentSlug?: string): string {
  const dests = getAllDestinations(entry, currentSlug)
  const hasAny = dests.codex || dests.oracle || dests.scroll.length > 0 || dests.library.length > 0

  if (!hasAny) return ''

  let links = ''

  if (dests.codex) {
    links += `<a href="${dests.codex}" class="popover-link">
      <span class="popover-icon">◈</span>
      <span class="popover-text">Correspondence Codex</span>
    </a>`
  }

  if (dests.oracle) {
    const traditionLabel = entry.traditions[0]
      ? entry.traditions[0].charAt(0).toUpperCase() + entry.traditions[0].slice(1)
      : 'Oracle'
    links += `<a href="${dests.oracle}" class="popover-link">
      <span class="popover-icon">✦</span>
      <span class="popover-text">Ask the ${traditionLabel} Oracle</span>
    </a>`
  }

  for (const s of dests.scroll) {
    links += `<a href="${s.url}" class="popover-link">
      <span class="popover-icon">↗</span>
      <span class="popover-text">${s.title}</span>
    </a>`
  }

  for (const book of dests.library) {
    links += `<a href="${book.url}" class="popover-link">
      <span class="popover-icon">📖</span>
      <span class="popover-text">${book.title}</span>
    </a>`
  }

  return `<div class="cross-link-popover">
    <div class="popover-header">${entry.label}</div>
    <div class="popover-links">${links}</div>
  </div>`
}

// ─── CSS styles for cross-links (inject into globals.css or component) ────────
export const CROSS_LINK_CSS = `
/* Cross-links: dotted gold underline — distinct from regular links */
.cross-link {
  color: inherit;
  text-decoration: underline;
  text-decoration-style: dotted;
  text-decoration-color: var(--primary-gold, #C9A84C);
  text-underline-offset: 3px;
  cursor: pointer;
  transition: text-decoration-color 0.2s ease, color 0.2s ease;
}

.cross-link:hover {
  text-decoration-style: solid;
  text-decoration-color: #00d4ff;
  color: var(--primary-gold, #C9A84C);
}

/* Subtle type icons */
.cross-link-icon {
  font-size: 0.65em;
  opacity: 0.5;
  margin-left: 1px;
  vertical-align: super;
  pointer-events: none;
}

.cross-link:hover .cross-link-icon {
  opacity: 0.8;
}

/* ─── Hover Popover ─────────────────────────────────────────────── */
.cross-link-popover {
  position: absolute;
  background: #12101a;
  border: 1px solid rgba(201, 168, 76, 0.2);
  border-radius: 8px;
  padding: 12px;
  width: 280px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  font-family: inherit;
}

.cross-link-popover.visible {
  opacity: 1;
  pointer-events: auto;
}

.popover-header {
  font-family: 'Cinzel', serif;
  color: var(--primary-gold, #C9A84C);
  font-size: 13px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.popover-links {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.popover-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 4px;
  color: #9B93AB;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.15s ease, color 0.15s ease;
  font-size: 12px;
}

.popover-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #E8E0F0;
}

.popover-icon {
  flex-shrink: 0;
  width: 18px;
  text-align: center;
  font-size: 11px;
}

.popover-text {
  flex: 1;
  line-height: 1.3;
}
`
