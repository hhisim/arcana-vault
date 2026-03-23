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

// ── MiniMax generation ───────────────────────────────────────────────────────

const TRADITIONS = ['tao', 'tarot', 'tantra', 'entheogen'] as const

const GENERATION_PROMPTS: Record<string, string> = {
  tao: `You are the Tao Oracle, a contemplative intelligence shaped by the Tao Te Ching, Chuang Tzu, and Lieh Tzu.
Generate today's Tao wisdom contemplation.
Return ONLY valid JSON with this exact structure, no markdown, no explanation:
{"title":"<3-6 word evocative title>","teaser":"<2-sentence contemplative teaser, not the full text>","fullText":"<4-6 sentence meditation/contemplation text>"}
Today's date is {{date}}. Draw from the wisdom of the Taoist canon. Make it alive and resonant for a modern seeker.`,

  tarot: `You are the Tarot Oracle, a deep reader trained on the Rider-Waite, Marseille, and Thoth tarot traditions.
Draw ONE tarot card randomly (use the date {{date}} as a seed for true randomness: hash the date and take mod 78).
Return ONLY valid JSON with this exact structure, no markdown, no explanation:
{"cardName":"<Full card name>","teaser":"<1-sentence hint about the card's energy today>","fullText":"<3-5 sentence reading about what this card offers today>"}
The card should feel meaningfully relevant to the current moment.`,

  tantra: `You are the Tantra Oracle, trained on classical Tantra, Kashmir Shaivism, kundalini yoga, Vedanta, and Hatha yoga texts.
Generate today's tantric meditation focus.
Return ONLY valid JSON with this exact structure, no markdown, no explanation:
{"title":"<3-6 word evocative title>","teaser":"<2-sentence teaser about today's focus>","fullText":"<4-5 sentence meditation guidance, grounding and safe>"}
Today's date is {{date}}. Focus on a chakra, energy center, or aspect of embodiment. Make it practical and alive.`,

  entheogen: `You are the Esoteric Entheogen Oracle, trained on the sacred dimensions of plant medicines, psychonautic literature, and shamanic wisdom traditions.
Generate today's entheogenic reflection — focused on integration, set & setting, and the symbolic dimensions of expanded states.
Return ONLY valid JSON with this exact structure, no markdown, no explanation:
{"title":"<3-6 word evocative title>","teaser":"<2-sentence teaser about today's reflection>","fullText":"<4-5 sentence reflection on integration, harm reduction, and the sacred>"}
Today's date is {{date}}. Ground it in real wisdom tradition, not vague wellness speak.`,
}

async function generateForTradition(
  tradition: string,
  date: string
): Promise<DailyEntry> {
  const apiKey = process.env.MINIMAX_API_KEY
  if (!apiKey) throw new Error('MINIMAX_API_KEY not set')

  const prompt = GENERATION_PROMPTS[tradition]?.replace('{{date}}', date)
  if (!prompt) throw new Error(`No prompt for tradition: ${tradition}`)

  const response = await fetch(
    'https://api.minimax.chat/v1/text/chatcompletion_pro?GroupId=123456789',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'MiniMax-Text-01',
        max_tokens: 600,
        temperature: 0.8,
        messages: [{ role: 'user', content: prompt }],
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`MiniMax API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json() as { choices?: Array<{ messages?: Array<{ content: string }> }> }
  const raw = data?.choices?.[0]?.messages?.[0]?.content ?? ''

  // Strip any markdown code fences
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()

  const parsed = JSON.parse(cleaned) as Record<string, string>
  return {
    title: parsed.title ?? parsed.cardName ?? 'Untitled',
    teaser: parsed.teaser ?? '',
    fullText: parsed.fullText ?? parsed.fullReading ?? '',
    tradition,
    generated: new Date().toISOString(),
  }
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
        const entry = await generateForTradition(tradition, date)
        entries[tradition] = entry
      } catch (err) {
        console.error(`[daily-content] Failed to generate ${tradition}:`, err)
        // Use fallback on failure
        entries[tradition] = getFallbackEntry(tradition)
      }
    }
  }

  const content: DailyContent = { date, entries }

  // Persist
  store[date] = { entries }
  await writeStore(store)

  return content
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
