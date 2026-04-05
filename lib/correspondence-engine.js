export const FAMILY_ORDER = [
  'all',
  'other',
  'deity',
  'tarot',
  'letter',
  'crystal',
  'planet',
  'zodiac',
  'colors',
  'chakras',
  'frequencies',
  'kabbalah',
  'i-ching',
  'mayan',
  'elements',
  'alchemical',
  'emotional',
  'plants',
  'metals',
  'geometry',
  'numbers',
  'physiology',
  'platonic-solids',
];

const QUERY_SYNONYMS = [
  [/\bqabalah\b|\bcabala\b|\bcabalah\b/gi, 'kabbalah'],
  [/\biching\b|\bi ching\b/gi, 'i-ching'],
  [/\bplatonic solid\b|\bplatonic solids\b/gi, 'platonic-solids'],
  [/\bhz\b/gi, 'frequency'],
  [/\bchakra\b/gi, 'chakras'],
  [/\bcolours\b/gi, 'colors'],
];

export function normalizeQuery(value = '') {
  let next = value.toLowerCase().trim();
  for (const [pattern, replacement] of QUERY_SYNONYMS) {
    next = next.replace(pattern, replacement);
  }
  return next.replace(/\s+/g, ' ');
}

export function familyMatches(item, family) {
  if (!family || family === 'all') return true;
  return Array.isArray(item.families) && item.families.includes(family);
}

function scoreItem(item, normalizedQuery) {
  if (!normalizedQuery) return 0;
  const haystack = `${item.name} ${item.subtitle || ''} ${item.searchText || ''}`.toLowerCase();
  let score = 0;

  if (item.name.toLowerCase() === normalizedQuery) score += 120;
  if (item.name.toLowerCase().startsWith(normalizedQuery)) score += 60;
  if (haystack.includes(normalizedQuery)) score += 24;

  const parts = normalizedQuery.split(/\s+/).filter(Boolean);
  for (const part of parts) {
    if (item.name.toLowerCase().startsWith(part)) score += 20;
    if (haystack.includes(part)) score += 8;
  }

  if (Array.isArray(item.badges)) {
    for (const badge of item.badges) {
      if (badge.toLowerCase().includes(normalizedQuery)) score += 15;
    }
  }

  return score;
}

export function filterIndexItems(entries, query, family) {
  const normalizedQuery = normalizeQuery(query);

  const filtered = entries
    .filter((item) => familyMatches(item, family))
    .map((item) => ({ item, score: scoreItem(item, normalizedQuery) }))
    .filter(({ item, score }) => !normalizedQuery || score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.item.name.localeCompare(b.item.name);
    })
    .map(({ item }) => item);

  return normalizedQuery ? filtered.slice(0, 64) : filtered;
}

export function topSuggestions(entries, query, family) {
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) return [];

  return filterIndexItems(entries, normalizedQuery, family)
    .slice(0, 6)
    .map((item) => ({ icon: item.icon, slug: item.slug, label: item.name }));
}

export async function fetchCorrespondenceIndex() {
  const response = await fetch('/data/correspondence/index.json', {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Could not load correspondence index (${response.status}).`);
  }
  return response.json();
}

export async function fetchCorrespondenceDetail(slug, signal) {
  const response = await fetch(`/data/correspondence/entries/${slug}.json`, {
    cache: 'no-store',
    signal,
  });
  if (!response.ok) {
    throw new Error(`Could not load correspondence detail (${response.status}).`);
  }
  return response.json();
}


// Compatibility exports for older app/components/CorrespondenceEngine.tsx imports.
// These keep existing route wiring from breaking while the new v2 engine is adopted.
export function parseCorrespondenceSeed() {
  return [];
}

export function filterEntries(entries, query = '', family = 'all') {
  return filterIndexItems(entries || [], query, family);
}

export function getAvailableKinds(entries = []) {
  const counts = new Map();
  for (const item of entries) {
    const kinds = Array.isArray(item.families) ? item.families : [];
    for (const kind of kinds) {
      counts.set(kind, (counts.get(kind) || 0) + 1);
    }
  }
  return Array.from(counts.entries()).map(([key, count]) => ({ key, count }));
}

export function buildCorrespondenceView(entry) {
  return entry;
}
