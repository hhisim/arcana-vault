/**
 * Correspondence Engine
 * Matches Q&A content from Oracle sessions against the Correspondence Codex
 * to surface cross-tradition symbolic connections.
 *
 * Algorithm: Option A (stopword-filtered keyword extraction + inverted index match)
 * - Fast, deterministic, no external API calls
 * - Handles symbolic language via domain-specific term normalization
 */

import type { CorrespondenceEntry, CrossRefByFamily } from './types'

// ── Symbolic stopwords (common English + esoteric filler) ──────────────────────
const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
  'used', 'it', 'its', "it's", 'he', 'she', 'they', 'them', 'his', 'her',
  'their', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
  'am', 'been', 'being', 'have', 'having', 'do', 'doing', 'did', 'done',
  'just', 'like', 'really', 'very', 'so', 'too', 'also', 'back', 'then',
  'there', 'here', 'when', 'where', 'why', 'how', 'all', 'each', 'every',
  'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
  'not', 'only', 'own', 'same', 'than', 'too', 'very', 'one', 'two',
  'three', 'four', 'five', 'first', 'second', 'new', 'old', 'high', 'long',
  'great', 'little', 'own', 'good', 'well', 'still', 'much', 'many',
  'even', 'now', 'up', 'out', 'if', 'about', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'under', 'again',
  'further', 'once', 'any', 'because', 'while', 'although', 'though',
  'since', 'unless', 'until', 'until', 'until', 'make', 'made', 'get',
  'got', 'go', 'going', 'went', 'gone', 'come', 'came', 'know', 'knew',
  'known', 'think', 'thought', 'see', 'saw', 'seen', 'feel', 'felt',
  'find', 'found', 'give', 'gave', 'given', 'take', 'took', 'taken',
  'tell', 'told', 'say', 'said', 'let', 'seem', 'seemed', 'want', 'wanted',
  'ask', 'asked', 'use', 'used', 'try', 'tried', 'call', 'called',
  'keep', 'kept', 'let', 'begin', 'began', 'begun', 'show', 'showed',
  'shown', 'hear', 'heard', 'play', 'played', 'run', 'run', 'move',
  'live', 'believe', 'bring', 'happen', 'write', 'provide', 'sit',
  'stand', 'lose', 'pay', 'meet', 'include', 'continue', 'set', 'learn',
  'change', 'lead', 'understand', 'watch', 'follow', 'stop', 'create',
  'speak', 'read', 'allow', 'add', 'spend', 'grow', 'open', 'walk',
  'win', 'offer', 'remember', 'love', 'consider', 'appear', 'buy',
  'wait', 'serve', 'die', 'send', 'expect', 'build', 'stay', 'fall',
  'cut', 'reach', 'kill', 'remain', 'suggest', 'raise', 'pass', 'sell',
  'require', 'report', 'decide', 'pull', 'yes', 'no', 'way', 'thing',
  'things', 'something', 'anything', 'everything', 'nothing', 'someone',
  'anyone', 'everyone', 'nobody', 'place', 'part', 'point', 'day',
  'days', 'time', 'times', 'year', 'years', 'people', 'world', 'life',
  'hand', 'hands', 'part', 'side', 'kind', 'kind', 'thing', 'man',
  'men', 'woman', 'women', 'child', 'children', 'work', 'word', 'words',
  'work', 'fact', 'fact', 'group', 'groups', 'number', 'numbers',
  'question', 'state', 'case', 'problem', 'eye', 'eyes', 'head', 'face',
  'body', 'name', 'names', 'light', 'dark', 'darkness', 'power', 'energy',
  'feel', 'feeling', 'feelings', 'sense', 'experience', 'experience',
  'really', 'actually', '基本', 'actually', 'perhaps', 'maybe', 'might',
  'could', 'would', 'should', 'seem', 'seems', 'maybe', 'probably',
  'always', 'never', 'sometimes', 'often', 'usually', 'often', 'rarely',
])

// ── Domain-specific symbolic term normalizations ─────────────────────────────────
// Maps common Q&A terms → canonical Codex terms for better matching
const TERM_ALIASES: Record<string, string[]> = {
  'kundalini': ['kundalini', 'serpent', 'shakti', 'chakra'],
  'shakti': ['shakti', 'feminine', 'power', 'kundalini'],
  'wu wei': ['wu wei', 'non-action', 'non-doing', 'effortless'],
  'tao': ['tao', 'dao', 'the way'],
  'tarot': ['tarot', 'major arcana', 'minor arcana', 'card'],
  'chakras': ['chakra', 'chakras', 'energy center', 'energy centres'],
  'chakra': ['chakra', 'chakras', 'energy center'],
  'third eye': ['third eye', 'ajna', 'ajna chakra'],
  'crown': ['crown', 'sahasrara', 'sahasra'],
  'root': ['root', 'muladhara', 'muladhar'],
  'sacral': ['sacral', 'svadhisthana', 'svadhisthana'],
  'solar plexus': ['solar plexus', 'manipura', 'manipura chakra'],
  'heart': ['heart', 'anahata', 'heart chakra'],
  'throat': ['throat', 'vishuddha', 'vishuddhi'],
  'nigredo': ['nigredo', 'black', 'putrefaction', 'death'],
  'albedo': ['albedo', 'white', 'purification', 'moon'],
  'citrinitas': ['citrinitas', 'yellow', 'solar', 'gold'],
  'rubedo': ['rubedo', 'red', 'completion', 'philosopher'],
  'calcination': ['calcination', 'fire', 'burning'],
  'dissolution': ['dissolution', 'solutio', 'water', 'lunar'],
  'conjunction': ['conjunction', 'marriage', 'union', 'alchemical wedding'],
  'fermentation': ['fermentation', 'spirit', 'alcohol'],
  'distillation': ['distillation', 'spirit', 'refinement', '升'],
  'coagulation': ['coagulation', 'solid', 'earth'],
  'i ching': ['i ching', 'iching', 'hexagram', 'ching'],
  'hexagram': ['hexagram', 'i ching', 'trigram'],
  'trigram': ['trigram', 'i ching', 'hexagram'],
  'kabbalah': ['kabbalah', 'qabalah', 'cabala', 'sephiroth', 'sephirot'],
  'sephiroth': ['sephiroth', 'sephira', 'tree of life', 'kabbalah'],
  'enochian': ['enochian', 'angelic', 'john dee', 'kelley'],
  'gnosis': ['gnosis', 'knowledge', 'direct knowing'],
  'ego': ['ego', 'self', 'persona', 'shadow'],
  'shadow': ['shadow', 'shadow work', 'dark', 'unconscious'],
  'sol': ['sol', 'sun', 'gold', 'solar'],
  'luna': ['luna', 'moon', 'silver', 'lunar'],
  'mercury': ['mercury', 'quicksilver', 'hermes', 'messenger'],
  'venus': ['venus', 'love', 'copper', 'feminine'],
  'saturn': ['saturn', 'limitation', 'lead', 'time'],
  'jupiter': ['jupiter', 'expansion', 'tin', 'fortune'],
  'mars': ['mars', 'war', 'iron', 'action'],
  'platonic': ['platonic solid', 'platonic', 'tetrahedron', 'cube', 'octahedron', 'icosahedron', 'dodecahedron'],
  'tetrahedron': ['tetrahedron', 'fire', 'platonic solid'],
  'cube': ['cube', 'hexahedron', 'earth', 'stable', 'platonic solid'],
  'octahedron': ['octahedron', 'air', 'platonic solid'],
  'icosahedron': ['icosahedron', 'water', 'platonic solid'],
  'dodecahedron': ['dodecahedron', 'ether', 'universe', 'platonic solid'],
  'caduceus': ['caduceus', 'mercury', 'serpent', 'rod'],
  'ankh': ['ankh', 'life', 'egypt', 'crux'],
  'pentagram': ['pentagram', 'pentacle', 'five elements', 'star'],
  'hexagram': ['hexagram', 'six', 'macrocosm', 'solomon'],
  'merkaba': ['merkaba', 'merkabah', 'light body', 'chariot'],
  'torus': ['torus', 'donut', 'flow', 'energy flow'],
  'vortex': ['vortex', 'spiral', 'energy', 'dynamic'],
  'sacred geometry': ['sacred geometry', 'geometry', 'proportion', 'golden ratio'],
  'golden ratio': ['golden ratio', 'phi', 'proportion', 'divine proportion'],
  'fibonacci': ['fibonacci', 'spiral', 'golden ratio', 'sequence'],
  'mandala': ['mandala', 'circle', 'sacred', 'wholeness'],
  'yantra': ['yantra', 'geometric', 'hindu', 'sacred'],
  'mudra': ['mudra', 'gesture', 'hand', 'energy'],
  'mantra': ['mantra', 'sound', 'chant', 'vibration', 'om'],
  ' OM ': ['om', 'aum', 'sacred sound', 'primordial'],
  'prana': ['prana', 'breath', 'life force', 'energy'],
  'breath': ['breath', 'prana', 'lungs', 'respiration'],
  'meditation': ['meditation', 'dhyana', 'contemplation', 'mindfulness'],
  'samadhi': ['samadhi', 'ecstasy', 'union', 'absorption'],
  'enlightenment': ['enlightenment', 'awakening', 'bodhi', 'satori'],
  'awakening': ['awakening', 'enlightenment', 'kundalini', 'rise'],
  'consciousness': ['consciousness', 'awareness', 'mind', 'spirit'],
  'subconscious': ['subconscious', 'unconscious', 'shadow', 'deep'],
  'astral': ['astral', 'body', 'projection', 'travel'],
  'lucid': ['lucid', 'dream', 'awareness', 'conscious'],
  'lucid dreaming': ['lucid dreaming', 'lucid dream', 'dream', 'conscious sleep'],
  'dream': ['dream', 'dreams', 'sleep', 'unconscious', 'symbol'],
  'vision': ['vision', 'visions', 'seeing', 'third eye'],
  'symbol': ['symbol', 'symbols', 'archetype', 'meaning'],
  'archetype': ['archetype', 'jung', 'universal', 'collective'],
  'jungian': ['jung', 'jungian', 'archetype', 'collective unconscious'],
  'alchemy': ['alchemy', 'alchemical', 'transmutation', 'gold'],
  'hermetic': ['hermetic', 'hermes', 'thoth', 'philosophers'],
  'hermeticism': ['hermeticism', 'hermetic', 'hermes trismegistus'],
  'sufism': ['sufi', 'sufism', 'islamic mysticism', 'whirling'],
  'dervish': ['dervish', 'sufi', 'whirling', 'turning'],
  'fana': ['fana', 'annihilation', 'ego death', 'sufi'],
  'baqa': ['baqa', 'subsistence', 'sufi', 'presence'],
  'tantra': ['tantra', 'tantric', 'union', 'yoga'],
  'yoga': ['yoga', 'union', 'discipline', 'practice'],
  'vedanta': ['vedanta', 'advaita', 'non-dual', 'uppanishads'],
  'advaita': ['advaita', 'non-dual', 'vedanta', 'oneness'],
  'buddhism': ['buddha', 'buddhism', 'dharma', 'mindfulness'],
  'zen': ['zen', 'buddhism', 'satori', 'meditation'],
  'vipassana': ['vipassana', 'insight', 'buddhist', 'meditation'],
  'bardo': ['bardo', 'tibetan', 'between', 'death', 'intermediate'],
  'dmt': ['dmt', 'dimethyltryptamine', 'spirit', 'molecule'],
  'psychedelic': ['psychedelic', 'entheogen', 'visionary', 'sacred'],
  'entheogen': ['entheogen', 'god', 'within', 'sacred'],
  'sacred mushroom': ['psilocybin', 'mushroom', 'sacred', 'enteogenic'],
  'psilocybin': ['psilocybin', 'mushroom', 'sacred', 'entheogen'],
  'ayahuasca': ['ayahuasca', 'vine', 'sacred', 'amazon', 'entheogen'],
  'ketamine': ['ketamine', 'dissociative', 'medicine', 'anesthetic'],
  'salvia': ['salvia', 'diviner', 'sage', 'visionary'],
  '五行': ['wu xing', 'wuxing', 'five phases', 'five elements'],
  '阴阳': ['yin yang', 'yinyang', 'polarity', 'balance'],
  '道': ['dao', 'tao', 'way', 'path'],
  '气': ['qi', 'chi', 'prana', 'life force'],
  '丹田': ['dantian', 'elixir field', 'lower abdomen', 'energy center'],
  '精': ['jing', 'essence', 'sexual energy', 'kidney'],
  '神': ['shen', 'spirit', 'consciousness', 'heart mind'],
  '心': ['xin', 'heart', 'mind', 'feeling'],
  '空': ['sunyata', 'emptiness', 'void', 'sunyata'],
}

// ── Stopword check ──────────────────────────────────────────────────────────────
function isStopword(w: string): boolean {
  return w.length < 2 || STOPWORDS.has(w.toLowerCase())
}

// ── Extract canonical terms from text ─────────────────────────────────────────
export function extractKeywords(text: string): string[] {
  // Normalize unicode
  const normalized = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/[^\x00-\x7fa-zA-Z']/g, ' ') // keep ASCII + apostrophe

  const words = normalized.split(/\s+/).map(w => w.toLowerCase().replace(/'/g, ''))
  const terms: string[] = []

  // Check for multi-word aliases first
  const lowerText = ' ' + normalized.toLowerCase() + ' '
  for (const [canonical, aliases] of Object.entries(TERM_ALIASES)) {
    for (const alias of aliases) {
      const aliasLower = alias.toLowerCase()
      if (aliasLower.length > 2 && lowerText.includes(aliasLower)) {
        terms.push(canonical)
        break
      }
    }
  }

  // Single-word terms (non-stopwords, length >= 2)
  for (const w of words) {
    if (!isStopword(w) && w.length >= 2) {
      terms.push(w)
    }
  }

  // Deduplicate, filter very long tokens
  return [...new Set(terms)].filter(t => t.length <= 30)
}

// ── Build inverted index from Codex entries ────────────────────────────────────
export interface CodexIndex {
  /** term → list of entry slugs that contain it */
  termToEntries: Map<string, string[]>
  /** slug → entry */
  entries: Map<string, CorrespondenceEntry>
  /** family key → family metadata */
  families: Map<string, { key: string; label: string; icon: string; count: number }>
  /** canonical term → list of expanded forms */
  aliasMap: Map<string, string[]>
}

const STOPWORD_RE = /\b(?:the|and|or|but|in|on|at|to|for|of|with|by|as|is|was|are|were)\b/gi
const NONWORD_RE = /[^\x00-\x7fa-zA-Z']+/g

function normalizeSearchField(field: string): string[] {
  return field
    .replace(STOPWORD_RE, ' ')
    .toLowerCase()
    .split(NONWORD_RE)
    .filter(t => t.length >= 2 && t.length <= 30)
}

/**
 * Build an inverted index from a flat array of correspondence entries.
 * Call this once on page load and reuse the index.
 */
export function buildCodexIndex(entries: CorrespondenceEntry[]): CodexIndex {
  const termToEntries = new Map<string, string[]>()
  const entryMap = new Map<string, CorrespondenceEntry>()
  const aliasMap = new Map<string, string[]>()

  // Build alias map for reverse lookup
  for (const [canonical, aliases] of Object.entries(TERM_ALIASES)) {
    for (const alias of aliases) {
      const existing = aliasMap.get(alias.toLowerCase()) || []
      if (!existing.includes(canonical)) existing.push(canonical)
      aliasMap.set(alias.toLowerCase(), existing)
    }
  }

  for (const entry of entries) {
    entryMap.set(entry.slug, entry)

    // Collect all searchable terms from the entry
    const terms = new Set<string>()

    // Name words
    for (const t of normalizeSearchField(entry.name)) terms.add(t)

    // Kind
    if (entry.kind) for (const t of normalizeSearchField(entry.kind)) terms.add(t)

    // Summary
    if (entry.summary) for (const t of normalizeSearchField(entry.summary)) terms.add(t)

    // Teaser
    if (entry.teaser) for (const t of normalizeSearchField(entry.teaser)) terms.add(t)

    // Search text (pre-built field)
    if (entry.searchText) for (const t of normalizeSearchField(entry.searchText)) terms.add(t)

    // Badges
    if (entry.badges) {
      for (const badge of entry.badges) {
        for (const t of normalizeSearchField(String(badge))) terms.add(t)
      }
    }

    // Families
    if (entry.families) {
      for (const fam of entry.families) terms.add(fam)
    }

    // Systems summary (key → values)
    if (entry.systemsSummary) {
      for (const [system, values] of Object.entries(entry.systemsSummary)) {
        terms.add(system.toLowerCase())
        for (const v of values) {
          for (const t of normalizeSearchField(String(v))) terms.add(t)
        }
      }
    }

    // Add all expanded aliases for the entry name
    for (const [alias, canonicals] of aliasMap.entries()) {
      if (canonicals.includes(entry.slug)) continue // handled separately
      // Check if the alias appears in entry name/summary
      const combined = `${entry.name} ${entry.summary} ${entry.teaser} ${entry.searchText}`.toLowerCase()
      if (combined.includes(alias)) {
        for (const c of canonicals) terms.add(c)
      }
    }

    // Index each term
    for (const term of terms) {
      if (term.length < 2) continue
      const existing = termToEntries.get(term) || []
      if (!existing.includes(entry.slug)) existing.push(entry.slug)
      termToEntries.set(term, existing)
    }
  }

  return { termToEntries, entries: entryMap, families: new Map(), aliasMap }
}

// ── Match scoring ───────────────────────────────────────────────────────────────
interface MatchScore {
  slug: string
  score: number
  matchedTerms: string[]
}

/**
 * Score a single entry against extracted keywords.
 * Scoring: each matched term contributes 1pt.
 * Bonus: exact name match = +3pts, family breadth (appearing in more families) = +0.2/family
 */
function scoreEntry(entry: CorrespondenceEntry, keywords: string[], index: CodexIndex): MatchScore {
  let score = 0
  const matchedTerms: string[] = []
  const seen = new Set<string>()

  for (const kw of keywords) {
    // Direct match
    const slugList = index.termToEntries.get(kw) || []
    if (slugList.includes(entry.slug)) {
      score += 1
      if (!seen.has(kw)) { matchedTerms.push(kw); seen.add(kw) }
    }

    // Alias expansion: check if kw maps to canonicals
    const canonicals = index.aliasMap.get(kw) || []
    for (const c of canonicals) {
      const cSlugList = index.termToEntries.get(c) || []
      if (cSlugList.includes(entry.slug)) {
        score += 1
        if (!seen.has(kw)) { matchedTerms.push(kw); seen.add(kw) }
      }
    }
  }

  // Name exact match bonus
  const nameWords = entry.name.toLowerCase().split(/\s+/)
  for (const kw of keywords) {
    if (nameWords.some(nw => nw.includes(kw) || kw.includes(nw))) {
      score += 3
      break
    }
  }

  // Family breadth bonus: entries spanning more families are more central
  if (entry.families) {
    score += entry.families.length * 0.2
  }

  return { slug: entry.slug, score, matchedTerms }
}

// ── Main matching function ─────────────────────────────────────────────────────
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

const MAX_ENTRIES_PER_FAMILY = 5
const MAX_FAMILIES = 6

/**
 * Find correspondence entries matching Q&A content.
 *
 * @param qAndATexts  Array of message content strings (user questions + oracle answers)
 * @param index       Pre-built CodexIndex from buildCodexIndex()
 * @param topN        Max total entries to return (default: 20)
 */
export function findCorrespondences(
  qAndATexts: string[],
  index: CodexIndex,
  topN = 20,
): MatchedEntry[] {
  // 1. Extract all keywords from Q&A
  const allKeywords = new Set<string>()
  for (const text of qAndATexts) {
    for (const kw of extractKeywords(text)) {
      allKeywords.add(kw)
    }
  }
  const keywords = [...allKeywords]

  if (keywords.length === 0) return []

  // 2. Score all matching entries
  const scores: MatchScore[] = []
  for (const [slug, entry] of index.entries) {
    // Skip entries with no meaningful match
    const s = scoreEntry(entry, keywords, index)
    if (s.score > 0) scores.push(s)
  }

  // 3. Sort by score descending
  scores.sort((a, b) => b.score - a.score)

  // 4. Take top N
  const top = scores.slice(0, topN)

  return top.map(s => {
    const entry = index.entries.get(s.slug)!
    return {
      slug: s.slug,
      name: entry.name,
      icon: entry.icon || '◆',
      kind: entry.kind || '',
      families: entry.families || [],
      relevanceScore: Math.round(s.score * 10) / 10,
      matchedOn: s.matchedTerms,
      systemsSummary: entry.systemsSummary || {},
    }
  })
}

/**
 * Group matched entries by family, for CrossRefPanel display.
 *
 * @param entries     MatchedEntry[] from findCorrespondences()
 * @param familyMeta  Map of family key → {key, label, icon, count}
 * @param maxFamilies Max number of families to show (default: 6)
 */
export function groupByFamily(
  entries: MatchedEntry[],
  familyMeta: Map<string, { key: string; label: string; icon: string }>,
  maxFamilies = MAX_FAMILIES,
): CrossRefByFamily[] {
  const byFamily = new Map<string, MatchedEntry[]>()

  for (const entry of entries) {
    // Use the first/primary family for grouping
    const primaryFamily = entry.families?.[0] || 'other'
    const existing = byFamily.get(primaryFamily) || []
    if (existing.length < MAX_ENTRIES_PER_FAMILY) {
      existing.push(entry)
    }
    byFamily.set(primaryFamily, existing)
  }

  const result: CrossRefByFamily[] = []
  let count = 0

  for (const [familyKey, familyEntries] of byFamily) {
    if (count >= maxFamilies) break
    const meta = familyMeta.get(familyKey) || { key: familyKey, label: familyKey, icon: '◆' }
    result.push({
      family: familyKey,
      familyLabel: meta.label || familyKey,
      familyIcon: meta.icon || '◆',
      entries: familyEntries.sort((a, b) => b.relevanceScore - a.relevanceScore),
    })
    count++
  }

  // Sort families by total relevance (highest total score first)
  result.sort((a, b) => {
    const totalA = a.entries.reduce((sum, e) => sum + e.relevanceScore, 0)
    const totalB = b.entries.reduce((sum, e) => sum + e.relevanceScore, 0)
    return totalB - totalA
  })

  return result
}

// ── Family metadata from index.json ───────────────────────────────────────────
export function extractFamilyMeta(
  families: Array<{ key: string; label: string; icon: string; count?: number }>,
): Map<string, { key: string; label: string; icon: string }> {
  const map = new Map<string, { key: string; label: string; icon: string }>()
  for (const f of families) {
    map.set(f.key, { key: f.key, label: f.label, icon: f.icon || '◆' })
  }
  return map
}
