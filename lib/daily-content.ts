import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'daily-content.json')

export type DailyEntry = {
  title: string
  teaser: string
  fullText?: string
  tradition: string
  generated: string
}

export type DailyContent = {
  date: string
  entries: {
    tao?: DailyEntry
    tarot?: DailyEntry
    tantra?: DailyEntry
    entheogen?: DailyEntry
  }
}

export type DailyStore = Record<string, DailyContent>

// ── helpers ──────────────────────────────────────────────────────────────────

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

async function readStore(): Promise<DailyStore> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw) as DailyStore
  } catch {
    return {}
  }
}

async function writeStore(store: DailyStore): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8')
}

const TRADITIONS = ['tao', 'tarot', 'tantra', 'entheogen'] as const
export function generateForTradition(tradition: string, _date: string): DailyEntry {
  // Keep the daily route independent of retired external model providers.
  return getFallbackEntry(tradition)
}

export async function persistDailyContentSafely(
  store: DailyStore,
  content: DailyContent,
  writer: (nextStore: DailyStore) => Promise<void> = writeStore,
): Promise<DailyContent> {
  try {
    await writer(store)
  } catch (error) {
    // Vercel's serverless filesystem is read-only/ephemeral. Persistence is only a cache;
    // it must never turn otherwise-valid daily practice into an empty API response.
    console.warn('[daily-content] Persistence unavailable; returning generated content.', error instanceof Error ? error.message : 'write failed')
  }
  return content
}

// ── public API ───────────────────────────────────────────────────────────────

export async function getTodayContent(): Promise<DailyContent | null> {
  return getContentForDate(todayKey())
}

export async function getContentForDate(date: string): Promise<DailyContent | null> {
  const store = await readStore()
  const entry = store[date]
  if (!entry) return null
  return { date, entries: entry.entries }
}

export async function generateTodayContent(): Promise<DailyContent> {
  const date = todayKey()
  const store = await readStore()

  const entries: DailyContent['entries'] = {}

  for (const tradition of TRADITIONS) {
    // Skip if already generated today
    if (store[date]?.entries?.[tradition]) {
      entries[tradition] = store[date].entries[tradition]
    } else {
      try {
        const entry = generateForTradition(tradition, date)
        entries[tradition] = entry
      } catch (err) {
        console.error(`[daily-content] Failed to generate ${tradition}:`, err)
        // Use fallback on failure
        entries[tradition] = getFallbackEntry(tradition)
      }
    }
  }

  const content: DailyContent = { date, entries }
  store[date] = content

  // Keep today's practice available even when Vercel's read-only filesystem rejects the cache write.
  return persistDailyContentSafely(store, content)
}

function getFallbackEntry(tradition: string): DailyEntry {
  const fallbacks: Record<string, DailyEntry> = {
    tao: {
      title: 'The Valley Spirit',
      teaser: "Today's contemplation draws from the Tao Te Ching — the inexhaustible source that nourishes all things without striving.",
      fullText: 'The valley spirit never dies. It is called the mysterious female — the root of heaven and earth. Drawn to its yielding, all things return. Today, practice non-striving: let the river carve the stone not by fighting it, but by being endlessly present. Return to the source.',
      tradition: 'tao',
      generated: new Date().toISOString(),
    },
    tarot: {
      title: 'The High Priestess',
      teaser: 'The veil between known and unknown is thin today. Trust what you sense but cannot yet name.',
      fullText: 'The High Priestess sits between two pillars — the threshold of the known world and the mystery beyond. She knows that true knowledge lives in the pause, in the breath between questions. Today, sit with what cannot yet be spoken. The answers you seek are already forming in the dark.',
      tradition: 'tarot',
      generated: new Date().toISOString(),
    },
    tantra: {
      title: 'Anahata — The Unstruck Sound',
      teaser: "Today's meditation focuses on the heart center — the space where giving and receiving become one breath.",
      fullText: 'Anahata, the heart chakra, is the seat of the unstruck sound — the sound that arises without any instrument being struck. It is the sound of pure giving. Today, breathe into the chest. Notice where the boundary between offering and receiving dissolves. The heart knows: love is not diminished by giving.',
      tradition: 'tantra',
      generated: new Date().toISOString(),
    },
    entheogen: {
      title: 'The Mirror of the Sacred',
      teaser: 'Today, let the plant medicine perspective inform not what you see — but how clearly you can bear to look.',
      fullText: 'Entheogens are mirrors, not windows. They do not show you new things — they show you what was always there with unbearable clarity. Today, reflect on integration: how do you carry what you saw? What has changed, and what must change in you to honor it? The sacred requires accountability.',
      tradition: 'entheogen',
      generated: new Date().toISOString(),
    },
  }
  return fallbacks[tradition] ?? { title: 'Daily Practice', teaser: '', tradition, generated: new Date().toISOString() }
}
