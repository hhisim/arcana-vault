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
 * CRITICAL: Markdown headings (lines starting with #) are protected from
 * injection so that cross-link HTML never ends up inside heading text,
 * which would break the heading's markdown parsing.
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
  let linkCount = 0

  // ── Step 1: Protect markdown headings from injection ──────────────────────
  // Replace heading lines with placeholders so cross-link HTML never gets
  // injected into heading text (which would corrupt heading structure).
  const headingPlaceholders: string[] = []
  const headingRegex = /^(#{1,6}\s+[^\n]+)$/gm
  const contentWithPlaceholders = content.replace(headingRegex, (match) => {
    const idx = headingPlaceholders.length
    headingPlaceholders.push(match)
    return `\x00HEADING_PLACEHOLDER_${idx}\x00`
  })

  // ── Step 2: Inject cross-links into the body (no headings to corrupt) ───
  let result = contentWithPlaceholders

  for (const { alias, key, entry } of aliasList) {
    if (linkCount >= maxLinks) break
    if (linkedTerms.has(key)) continue

    const escapedAlias = escapeRegex(alias)
    const regex = new RegExp(
      `(?<![<\\w/])\\b(${escapedAlias})\\b(?![^<]*>)`,
      'i'
    )

    const match = result.match(regex)
    if (match) {
      const target = getBestLinkTarget(entry, currentSlug)
      if (target) {
        const crossLink = buildCrossLink(match[0], entry, target, key)
        result = result.replace(regex, crossLink)
        linkedTerms.add(key)
        linkCount++
      }
    }
  }

  // ── Step 3: Restore heading lines ────────────────────────────────────────
  for (let i = 0; i < headingPlaceholders.length; i++) {
    result = result.replace(`\x00HEADING_PLACEHOLDER_${i}\x00`, headingPlaceholders[i])
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
