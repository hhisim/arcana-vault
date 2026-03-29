import { NextRequest, NextResponse } from 'next/server'

const DEMO_ANSWERS = [
  {
    question: 'What is the first teaching of the Tao Te Ching about yielding?',
    answer: "The Tao Te Ching opens with what may be the most profound single line ever written: \"The Tao that can be told is not the eternal Tao.\" But the second verse cuts deeper still — \"Yield and survive. Bend and remain straight. Emptiness holds everything. Stillness returns to its nature. The soft overcomes the hard. The yielding overcomes the hard. Wu wei — not by pushing, but by learning the shape of what already wants to move. The river does not force its path. It finds it. This is the first teaching: not action, but alignment.",
    tradition: 'Taoism'
  },
  {
    question: 'What does the Tarot reveal about new beginnings?',
    answer: "The Fool card embodies new beginnings — the spark of potential before judgment. The 0 is not a number but a state of grace: unburdened by past karma, unbounded by future consequence. New beginnings in the Tarot are not about certainty but about willingness — the Fool steps off the cliff because the interior compass reads more trustworthy than the eye. Trust the move. The net appears on the way down.",
    tradition: 'Tarot'
  },
  {
    question: 'What is the heart of Sufi mystical practice?',
    answer: "The heart of Sufi practice is fana — the annihilation of the ego in the presence of the Divine. Not the destruction of the self, but its dissolution into love. The Sufi does not seek to become nothing; they seek to become a transparent vessel for the One. Through sama (whirling), dhikr (remembrance), and the practice of ishq (divine love), the Sufi allows the ego to burn away naturally, revealing the divine essence underneath. Rumi wrote: \"What you seek is seeking you.\" The practice is not about reaching God — it is about allowing God to reach through you.",
    tradition: 'Sufism'
  },
  {
    question: 'What does the Enneagram describe about the path to liberation?',
    answer: "The Enneagram teaches that liberation comes not from fixing your type, but from understanding that you ARE your type before you were wounded. The Nine personalities are not flaws to correct — they are the nine faces the Divine takes when it forgets its own nature. The path to liberation is not self-improvement but self-remembering: dropping back through the layers of personality to the essential nature underneath. Each type has a specific \"remembering\" — a specific doorway back.",
    tradition: 'Enneagram'
  },
  {
    question: 'How does Kabbalah describe the path between death and rebirth?',
    answer: "In Kabbalah, the soul descends through the twelve gates of the Yetziratic world after death — each gate stripping away another layer of egoic identity. The soul does not choose its next incarnation; it is drawn by resonance — by the quality of love it generated in life. The twelve gates correspond to the twelve permutations of the Tetragrammaton, and each one is a test of what you most cling to. Those who cling to nothing pass through all twelve in an instant. Those who cling to something pass through slowly, learning the shape of their attachment before they can let it go.",
    tradition: 'Kabbalah'
  },
]

async function getLiveAnswer(q: string, tradition: string): Promise<string | null> {
  // Use the oracle/ask route which properly proxies to VPS and accumulates streaming response
  try {
    const res = await fetch('https://vaultofarcana.com/api/oracle/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q, tradition }),
      signal: AbortSignal.timeout(58000),
    })

    if (!res.ok) return null

    const text = await res.text()

    // Try JSON first
    try {
      const obj = JSON.parse(text)
      if (obj.answer) return obj.answer
      if (obj.response) return obj.response
    } catch {}

    // Return as plain text if it looks like an answer
    const cleaned = text.trim()
    if (cleaned.length > 20) return cleaned

    return null
  } catch {
    return null
  }
}

export async function GET() {
  return NextResponse.json(DEMO_ANSWERS[0])
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const now = Date.now()
  const windowMs = 60 * 60 * 1000

  const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
  const key = `demo:${ip}`

  const record = rateLimitMap.get(key)
  if (record) {
    if (now < record.resetAt) {
      if (record.count >= 3) {
        return NextResponse.json({ error: 'Demo limit reached — visit /chat for unlimited access.' }, { status: 429 })
      }
      record.count++
    } else {
      rateLimitMap.set(key, { count: 1, resetAt: now + windowMs })
    }
  } else {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs })
  }

  const { question } = await req.json()
  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return NextResponse.json({ error: 'A question is required.' }, { status: 400 })
  }

  const q = question.trim()
  const lower = q.toLowerCase()

  let tradition = 'tao'
  let answerObj = DEMO_ANSWERS[0]

  if (lower.includes('tarot') || lower.includes('card') || lower.includes('major arcana') || lower.includes('divination') || lower.includes('fool')) {
    tradition = 'tarot'; answerObj = DEMO_ANSWERS[1]
  } else if (lower.includes('sufi') || lower.includes('rumi') || lower.includes('whirling') || lower.includes('dhikr') || lower.includes('fana') || lower.includes('love')) {
    tradition = 'sufi'; answerObj = DEMO_ANSWERS[2]
  } else if (lower.includes('enneagram') || lower.includes('personality') || lower.includes('type')) {
    tradition = 'enneagram'; answerObj = DEMO_ANSWERS[3]
  } else if (lower.includes('kabbalah') || lower.includes('sephiroth') || lower.includes('jewish') || lower.includes('torah') || lower.includes('tzimtzum') || lower.includes('zohar') || lower.includes('reincarnation')) {
    tradition = 'kabbalah'; answerObj = DEMO_ANSWERS[4]
  }

  // Try live oracle — the oracle/ask route handles streaming accumulation
  const liveAnswer = await getLiveAnswer(q, tradition)
  if (liveAnswer) {
    return NextResponse.json({
      question: q,
      answer: liveAnswer,
      tradition: tradition.charAt(0).toUpperCase() + tradition.slice(1),
      isLive: true,
      remaining: 3 - ((record?.count) || 1),
    })
  }

  // Fallback to curated static answer
  return NextResponse.json({
    ...answerObj,
    question: q,
    isLive: false,
    remaining: 3 - ((record?.count) || 1),
  })
}
