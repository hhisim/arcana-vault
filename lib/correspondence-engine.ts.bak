export type Kind =
  | 'other'
  | 'crystal'
  | 'plant'
  | 'deity'
  | 'planet'
  | 'zodiac'
  | 'tarot'
  | 'rune'
  | 'iching'
  | 'geomancy'
  | 'kabbalah'
  | 'letter';

export type SectionKey =
  | 'core'
  | 'astrological'
  | 'cross'
  | 'alchemical'
  | 'crossReferences'
  | 'notes'
  | 'flowing'
  | 'misc';

export interface FieldValue {
  key: string;
  label: string;
  value: string;
  section: SectionKey;
}

export interface SectionData {
  fields: Record<string, { label: string; value: string }>;
  items: string[];
}

export interface Entry {
  id: number;
  rawTitle: string;
  name: string;
  subtitle: string;
  slug: string;
  kind: Kind;
  icon: string;
  sections: Record<SectionKey, SectionData>;
  fieldMap: Record<string, FieldValue>;
  flowText: string;
  searchTokens: string[];
  fieldTokens: Record<string, string[]>;
  outboundReferences: Record<string, string[]>;
}

export interface SeedData {
  entries: Entry[];
  bySlug: Map<string, Entry>;
  stats: {
    total: number;
    byKind: Partial<Record<Kind, number>>;
  };
}

export interface RelatedItem {
  entry: Entry;
  score: number;
  matchedOn: string[];
}

export interface MatchRow {
  key: string;
  label: string;
  value: string;
  matches: Entry[];
}

export interface CorrespondenceView {
  entry: Entry;
  subtitle: string;
  overviewFields: FieldValue[];
  crossRows: MatchRow[];
  related: RelatedItem[];
  allies: {
    crystals: Entry[];
    plants: Entry[];
    deities: Entry[];
  };
}

const PLANET_SYMBOLS: Record<string, string> = {
  sun: '☉',
  moon: '☽',
  mercury: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
  uranus: '♅',
  neptune: '♆',
  pluto: '♇',
};

const BASE_KIND_HINTS: Record<Exclude<Kind, 'other'>, string[]> = {
  crystal: ['crystals'],
  plant: ['plants', 'materia magica'],
  deity: ['deities/angels'],
  planet: ['planets', 'planet', 'planet/zodiac'],
  zodiac: ['zodiac', 'planet/zodiac'],
  tarot: ['tarot', 'tarot minor echo', 'tarot major echo', 'minor arcana'],
  rune: ['runes'],
  iching: ['i ching'],
  geomancy: ['geomancy'],
  kabbalah: ['kabbalah'],
  letter: ['letters', 'hebrew letter', 'hebrew letters'],
};

const SECTION_MATCHERS: Array<[RegExp, SectionKey]> = [
  [/^core$/i, 'core'],
  [/^astrological\s*\/\s*planetary$/i, 'astrological'],
  [/^cross[- ]system$/i, 'cross'],
  [/^alchemical(?:\s*\/\s*materials?)?$/i, 'alchemical'],
  [/^cross[- ]references?$/i, 'crossReferences'],
  [/^(archetypal|personal|rational) note$/i, 'notes'],
  [/^[^A-Za-z0-9]*flow(?:ing)?$/i, 'flowing'],
];

const FIELD_ALIASES: Record<string, string> = {
  notes: 'note',
  note: 'note',
  chakras: 'chakra',
  chakra: 'chakra',
  frequencies: 'frequency',
  frequency: 'frequency',
  colors: 'color',
  colour: 'color',
  physiology: 'physiology',
  'geometry / symbolism': 'geometry',
  geometry: 'geometry',
  'platonic solids': 'platonic solid',
  'platonic solid': 'platonic solid',
  planets: 'planet',
  planet: 'planet',
  'planet/zodiac': 'planet/zodiac',
  zodiac: 'zodiac',
  tarot: 'tarot',
  'tarot major echo': 'tarot',
  'tarot minor echo': 'tarot',
  'hebrew letters': 'hebrew letter',
  'hebrew letter': 'hebrew letter',
  letters: 'hebrew letter',
  runes: 'runes',
  'i ching': 'i ching',
  geomancy: 'geomancy',
  'minor arcana': 'minor arcana',
  'magical tool': 'magical tool',
  'mayan echo': 'mayan echo',
  numbers: 'numbers',
  kabbalah: 'kabbalah',
  processes: 'processes',
  metals: 'metals',
  crystals: 'crystals',
  plants: 'plants',
  'materia magica': 'plants',
  'deities/angels': 'deities/angels',
  poetic: 'poetic',
  essence: 'essence',
  element: 'element',
};

const DISPLAY_FIELD_PRIORITY = [
  'essence', 'element', 'chakra', 'color', 'geometry', 'physiology', 'frequency', 'note', 'planet', 'zodiac', 'kabbalah', 'hebrew letter', 'tarot', 'runes', 'i ching', 'geomancy', 'minor arcana', 'magical tool', 'mayan echo', 'numbers', 'processes', 'metals', 'crystals', 'plants', 'deities/angels', 'poetic',
] as const;

const MATCH_FIELD_PRIORITY = [
  'planet', 'zodiac', 'tarot', 'kabbalah', 'chakra', 'element', 'geometry', 'runes', 'i ching', 'geomancy', 'numbers', 'crystals', 'plants', 'deities/angels', 'color',
] as const;

function titleCase(value = ''): string {
  return value.split(' ').filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

export function slugify(value = ''): string {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[’']/g, '').replace(/&/g, ' and ').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
}

function cleanLine(value = ''): string { return value.replace(/\uFEFF/g, '').replace(/\r/g, '').trim(); }
function isSeparator(line: string): boolean { return /^[-=]{3,}$/.test(line); }
function detectSection(line: string): SectionKey | null { for (const [pattern, key] of SECTION_MATCHERS) { if (pattern.test(line)) return key; } return null; }
function normalizeFieldLabel(label = ''): string { const cleaned = label.toLowerCase().replace(/\s+/g, ' ').trim(); return FIELD_ALIASES[cleaned] || cleaned; }
function stripDecorations(value = ''): string { return value.replace(/^[✶•◆◇❤❤️💧🔥💨🌙☀️⚡🌊🌱🌾🌸✨🪶⚖]+\s*/u, '').replace(/^flow(?:ing)?\s*/i, '').trim(); }
function removeParenthetical(value = ''): string { return value.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim(); }
function splitListValue(value = ''): string[] { const parts = value.split(/[·;|]+/).flatMap((piece) => { const trimmed = piece.trim(); if (!trimmed) return []; if (/^[^\s/]+\/[^\s/]+$/.test(trimmed)) { return trimmed.split('/').map((inner) => inner.trim()).filter(Boolean); } return [trimmed]; }); const unique: string[] = []; const seen = new Set<string>(); for (const part of parts) { const normalized = removeParenthetical(part).replace(/[♈-♓☰☱☲☳☴☵☶☷]/g, ' ').replace(/\s+/g, ' ').trim(); if (!normalized || normalized === '—') continue; const key = normalized.toLowerCase(); if (!seen.has(key)) { seen.add(key); unique.push(normalized); } } return unique; }
function extractTokens(value = ''): string[] { const noParens = removeParenthetical(value).replace(/[♈-♓☰☱☲☳☴☵☶☷]/g, ' ').replace(/[→↔]/g, ' ').replace(/[—–-]/g, ' ').replace(/[^A-Za-z0-9\s]+/g, ' ').toLowerCase(); return Array.from(new Set(noParens.split(/\s+/).map((token) => token.trim()).filter((token) => token.length >= 2))); }
function inferBaseKind(entry: Entry): Kind { const title = entry.rawTitle; const name = entry.name; const lower = `${title} ${entry.subtitle}`.toLowerCase(); if (/uppercase correspondences|lowercase correspondences/.test(lower)) return 'letter'; if (/^(0|[ivxlcdm]+)\./i.test(name) || /^(ace|two|three|four|five|six|seven|eight|nine|ten|page|knight|queen|king) of /i.test(name)) return 'tarot'; if (/^[♈♉♊♋♌♍♎♏♐♑♒♓]/u.test(name)) return 'zodiac'; const plainName = slugify(name); if (PLANET_SYMBOLS[plainName]) return 'planet'; if (name.length === 1) return 'letter'; return 'other'; }
function getIconForEntry(entry: Entry): string { const firstChar = entry.name.charAt(0); if (/^[♈♉♊♋♌♍♎♏♐♑♒♓]$/u.test(firstChar)) return firstChar; const byName = PLANET_SYMBOLS[slugify(entry.name)]; if (byName) return byName; if (entry.kind === 'tarot') return '🂠'; if (entry.kind === 'letter') return entry.name.charAt(0).toUpperCase(); if (entry.kind === 'crystal') return '✦'; if (entry.kind === 'plant') return '❀'; if (entry.kind === 'deity') return '✧'; return '✺'; }
function createEmptySection(): SectionData { return { fields: {}, items: [] }; }
function addField(entry: Entry, sectionKey: SectionKey, label: string, value: string) { const normalized = normalizeFieldLabel(label); const displayLabel = titleCase(label.trim()); const trimmedValue = value.trim(); const existingInSection = entry.sections[sectionKey].fields[normalized]; if (existingInSection) { entry.sections[sectionKey].fields[normalized].value += ` · ${trimmedValue}`; } else { entry.sections[sectionKey].fields[normalized] = { label: displayLabel, value: trimmedValue }; } const existingGlobal = entry.fieldMap[normalized]; if (existingGlobal) { existingGlobal.value += ` · ${trimmedValue}`; } else { entry.fieldMap[normalized] = { key: normalized, label: displayLabel, value: trimmedValue, section: sectionKey }; } }
export function parseCorrespondenceSeed(seedText: string): SeedData { const cleaned = seedText.replace(/\r\n?/g, '\n'); const matches = [...cleaned.matchAll(/^#{2,3}\s+(.+)$/gm)]; const entries: Entry[] = []; for (let index = 0; index < matches.length; index += 1) { const match = matches[index]; const start = match.index ?? 0; const end = index + 1 < matches.length ? matches[index + 1].index ?? cleaned.length : cleaned.length; const chunk = cleaned.slice(start, end).trim(); if (!chunk) continue; const lines = chunk.split('\n'); const rawTitle = cleanLine(lines[0].replace(/^#{2,3}\s+/, '')); const [namePart, subtitlePart = ''] = rawTitle.split(' — '); const entry: Entry = { id: index + 1, rawTitle, name: cleanLine(namePart), subtitle: cleanLine(subtitlePart), slug: slugify(namePart), kind: 'other', icon: '✺', sections: { core: createEmptySection(), astrological: createEmptySection(), cross: createEmptySection(), alchemical: createEmptySection(), crossReferences: createEmptySection(), notes: createEmptySection(), flowing: createEmptySection(), misc: createEmptySection() }, fieldMap: {}, flowText: '', searchTokens: [], fieldTokens: {}, outboundReferences: {} }; let currentSection: SectionKey = 'misc'; let lastFieldKey: string | null = null; for (const rawLine of lines.slice(1)) { const line = cleanLine(rawLine); if (!line) { lastFieldKey = null; continue; } if (isSeparator(line)) continue; const sectionKey = detectSection(line); if (sectionKey) { currentSection = sectionKey; lastFieldKey = null; continue; } if (currentSection === 'flowing') { entry.sections.flowing.items.push(stripDecorations(line)); continue; } if (/^✶\s*poetic:/i.test(line)) { addField(entry, 'notes', 'Poetic', line.replace(/^✶\s*poetic:/i, '').trim()); continue; } if (line.startsWith('- ')) { const body = line.slice(2).trim(); const colonIndex = body.indexOf(':'); if (colonIndex > -1) { const label = body.slice(0, colonIndex).trim(); const value = body.slice(colonIndex + 1).trim(); addField(entry, currentSection, label, value); lastFieldKey = normalizeFieldLabel(label); } else { entry.sections[currentSection].items.push(body); lastFieldKey = null; } continue; } if (lastFieldKey && entry.sections[currentSection].fields[lastFieldKey]) { entry.sections[currentSection].fields[lastFieldKey].value += ` ${line}`; if (entry.fieldMap[lastFieldKey]) { entry.fieldMap[lastFieldKey].value += ` ${line}`; } } else { entry.sections[currentSection].items.push(line); } } entry.flowText = entry.sections.flowing.items.join(' ').trim(); entry.kind = inferBaseKind(entry); entries.push(entry); } const bySlug = new Map(entries.map((entry) => [entry.slug, entry])); const inboundCategoryCounts = new Map<string, Partial<Record<Kind, number>>>(entries.map((entry) => [entry.slug, {}])); for (const entry of entries) { const searchTokenSet = new Set(extractTokens(`${entry.name} ${entry.subtitle} ${entry.flowText}`)); for (const [fieldKey, field] of Object.entries(entry.fieldMap)) { const tokens = extractTokens(`${field.label} ${field.value}`); entry.fieldTokens[fieldKey] = tokens; tokens.forEach((token) => searchTokenSet.add(token)); const refs: string[] = []; for (const item of splitListValue(field.value)) { const candidates = [item, removeParenthetical(item)].flatMap((value) => { const trimmed = value.trim(); if (!trimmed) return []; if (/^[^\s/]+\/[^\s/]+$/.test(trimmed)) { return trimmed.split('/').map((inner) => inner.trim()); } return [trimmed]; }); for (const candidate of candidates) { const refSlug = slugify(candidate); if (!refSlug || refSlug === entry.slug || !bySlug.has(refSlug)) continue; refs.push(refSlug); } } entry.outboundReferences[fieldKey] = Array.from(new Set(refs)); const category = (Object.entries(BASE_KIND_HINTS).find(([, labels]) => labels.includes(fieldKey))?.[0] || null) as Kind | null; if (category) { for (const refSlug of entry.outboundReferences[fieldKey]) { const bucket = inboundCategoryCounts.get(refSlug) || {}; bucket[category] = (bucket[category] || 0) + 1; inboundCategoryCounts.set(refSlug, bucket); } } } entry.searchTokens = Array.from(searchTokenSet); } for (const entry of entries) { const inbound = inboundCategoryCounts.get(entry.slug) || {}; const sorted = Object.entries(inbound).sort((a, b) => (b[1] || 0) - (a[1] || 0)); if (sorted.length && (sorted[0][1] || 0) > 0) { entry.kind = sorted[0][0] as Kind; } entry.icon = getIconForEntry(entry); } const stats = entries.reduce<SeedData['stats']>((acc, entry) => { acc.total += 1; acc.byKind[entry.kind] = (acc.byKind[entry.kind] || 0) + 1; return acc; }, { total: 0, byKind: {} }); return { entries, bySlug, stats }; }
function sharedCount(a: string[] = [], b: string[] = []): number { const setB = new Set(b); let total = 0; for (const item of a) { if (setB.has(item)) total += 1; } return total; }
function getDirectReferences(seed: SeedData, entry: Entry, kind: Kind): Entry[] { const allowedFields = kind === 'other' ? [] : BASE_KIND_HINTS[kind] || []; const refs: Entry[] = []; for (const fieldKey of allowedFields) { for (const refSlug of entry.outboundReferences[fieldKey] || []) { const ref = seed.bySlug.get(refSlug); if (ref && ref.kind === kind) refs.push(ref); } } const deduped: Entry[] = []; const seen = new Set<string>(); for (const ref of refs) { if (!seen.has(ref.slug)) { seen.add(ref.slug); deduped.push(ref); } } return deduped; }
function buildRelatedEntries(seed: SeedData, entry: Entry): RelatedItem[] { return seed.entries.filter((candidate) => candidate.slug !== entry.slug).map((candidate) => { let score = sharedCount(entry.searchTokens, candidate.searchTokens); const matchedOn: string[] = []; for (const fieldKey of MATCH_FIELD_PRIORITY) { const overlap = sharedCount(entry.fieldTokens[fieldKey] || [], candidate.searchTokens); if (overlap > 0) { score += overlap * 4; matchedOn.push(entry.fieldMap[fieldKey]?.label || titleCase(fieldKey)); } } if (entry.kind !== 'other' && candidate.kind === entry.kind) score += 2; if (candidate.kind === 'planet' && sharedCount(entry.fieldTokens.planet || [], candidate.searchTokens)) score += 3; return { entry: candidate, score, matchedOn: Array.from(new Set(matchedOn)).slice(0, 4) }; }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name)).slice(0, 18); }
function buildMatchRows(seed: SeedData, entry: Entry): MatchRow[] { return MATCH_FIELD_PRIORITY.flatMap((fieldKey) => { const field = entry.fieldMap[fieldKey]; if (!field?.value) return []; const matches = seed.entries.filter((candidate) => candidate.slug !== entry.slug).map((candidate) => { const score = sharedCount(entry.fieldTokens[fieldKey] || [], candidate.searchTokens); return { candidate, score }; }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || a.candidate.name.localeCompare(b.candidate.name)).slice(0, 4).map((item) => item.candidate); return [{ key: fieldKey, label: field.label, value: field.value, matches }]; }); }
export function getAvailableKinds(seed: SeedData): Array<{ key: string; label: string; count: number }> { return Object.entries(seed.stats.byKind).map(([key, count]) => ({ key, label: titleCase(key), count: count || 0 })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)); }
export function filterEntries(seed: SeedData, query = '', kind = 'all'): Entry[] { const normalizedQuery = query.trim().toLowerCase(); return seed.entries.filter((entry) => { const matchesKind = kind === 'all' || entry.kind === kind; const haystack = `${entry.name} ${entry.subtitle} ${entry.flowText} ${Object.values(entry.fieldMap).map((field) => `${field.label} ${field.value}`).join(' ')}`.toLowerCase(); const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery); return matchesKind && matchesQuery; }); }
export function buildCorrespondenceView(seed: SeedData, slug: string): CorrespondenceView | null { const entry = seed.bySlug.get(slug); if (!entry) return null; const overviewFields = DISPLAY_FIELD_PRIORITY.flatMap((key) => (entry.fieldMap[key] ? [entry.fieldMap[key]] : [])); const related = buildRelatedEntries(seed, entry); const crossRows = buildMatchRows(seed, entry); return { entry, subtitle: entry.subtitle || entry.fieldMap.essence?.value || entry.flowText || 'Full correspondence map composed from the Arcana seed.', overviewFields, crossRows, related, allies: { crystals: getDirectReferences(seed, entry, 'crystal').slice(0, 6), plants: getDirectReferences(seed, entry, 'plant').slice(0, 6), deities: getDirectReferences(seed, entry, 'deity').slice(0, 6) } }; }
