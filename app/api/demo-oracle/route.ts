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

// Stream-aware: accumulate NDJSON chunks from backend
async function streamBackendAnswer(question: string, tradition: string): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 25000)

    const res = await fetch('http://204.168.154.237:8002/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: question, tradition: tradition.toLowerCase() }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!res.ok) return null

    // Accumulate streaming NDJSON response
    const text = await res.text()
    const lines = text.trim().split('\n')
    
    // Last line usually has the full answer
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const obj = JSON.parse(lines[i])
        if (obj.answer || obj.response) return obj.answer || obj.response
      } catch {}
    }
    
    // Fallback: join all text fields
    const answers: string[] = []
    for (const line of lines) {
      try {
        const obj = JSON.parse(line)
        if (typeof obj === 'string') answers.push(obj)
        else if (obj.answer) answers.push(obj.answer)
        else if (obj.text) answers.push(obj.text)
        else if (obj.content) answers.push(obj.content)
      } catch {}
    }
    return answers.join('').trim() || null
  } catch {
    return null
  }
}

export async function GET() {
  const answer = DEMO_ANSWERS[0]
  return NextResponse.json({ question: answer.question, answer: answer.answer, tradition: answer.tradition })
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
        return NextResponse.json(
          { error: 'Demo limit reached. Try the full Oracle for unlimited questions.' },
          { status: 429 }
        )
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
  const tradition = detectTradition(q)

  // Try live backend
  const liveAnswer = await streamBackendAnswer(q, tradition)
  if (liveAnswer) {
    return NextResponse.json({
      answer: liveAnswer,
      tradition: detectTraditionLabel(tradition),
      question: q,
      isLive: true,
      remaining: 3 - ((record?.count) || 1),
    })
  }

  // Fallback: static answers
  const selected = DEMO_ANSWERS.find(a => a.tradition === detectTraditionLabel(tradition)) || DEMO_ANSWERS[0]
  return NextResponse.json({
    ...selected,
    question: q,
    isLive: false,
    remaining: 3 - ((record?.count) || 1),
  })
}

function detectTradition(q: string): string {
  const lower = q.toLowerCase()
  if (lower.includes('tarot') || lower.includes('card') || lower.includes('major arcana') || lower.includes('divination') || lower.includes('fool')) return 'Tarot'
  if (lower.includes('sufi') || lower.includes('rumi') || lower.includes('whirling') || lower.includes('dhikr') || lower.includes('fana') || lower.includes('love')) return 'Sufism'
  if (lower.includes('enneagram') || lower.includes('personality') || lower.includes('type') || lower.includes('attachment')) return 'Enneagram'
  if (lower.includes('kabbalah') || lower.includes('sephiroth') || lower.includes('jewish') || lower.includes('torah') || lower.includes('tzimtzum') || lower.includes('zohar') || lower.includes('reincarnation')) return 'Kabbalah'
  if (lower.includes('tantra') || lower.includes('shakti') || lower.includes('kundalini')) return 'Tantra'
  if (lower.includes('dream') || lower.includes('shadow') || lower.includes('jung')) return 'Dreamwalker'
  if (lower.includes('entheogen') || lower.includes('dmt') || lower.includes('psychedelic') || lower.includes('lsd') || lower.includes('medicine')) return 'Entheogen'
  return 'Taoism'
}

function detectTraditionLabel(t: string): string {
  const labels: Record<string, string> = {
    Tarot: 'Tarot', Sufism: 'Sufism', Enneagram: 'Enneagram',
    Kabbalah: 'Kabbalah', Tantra: 'Tantra', Dreamwalker: 'Dreamwalker',
    Entheogen: 'Entheogen', Taoism: 'Taoism',
  }
  return labels[t] || 'Oracle'
}
