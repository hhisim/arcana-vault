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

  const q = question.toLowerCase().trim()

  // Try live backend first
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20000)

    const res = await fetch('http://204.168.154.237:8002/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: question.trim(),
        session_id: `demo-${ip}`,
        tradition: detectTradition(q)
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (res.ok) {
      const data = await res.json()
      const answer = typeof data === 'string' ? data : data?.answer || data?.response
      if (answer) {
        return NextResponse.json({
          answer,
          tradition: detectTraditionLabel(detectTradition(q)),
          question: question.trim(),
          isLive: true,
          remaining: 3 - ((record?.count) || 1),
        })
      }
    }
  } catch {
    // Backend unavailable — fall through to static answers
  }

  // Fallback: static answers
  const selected = DEMO_ANSWERS.find(a => {
    const t = detectTradition(q)
    if (t === 'Tarot') return a.tradition === 'Tarot'
    if (t === 'Sufism') return a.tradition === 'Sufism'
    if (t === 'Enneagram') return a.tradition === 'Enneagram'
    if (t === 'Kabbalah') return a.tradition === 'Kabbalah'
    return a.tradition === 'Taoism'
  }) || DEMO_ANSWERS[0]

  return NextResponse.json({
    ...selected,
    question: question.trim(),
    isLive: false,
    remaining: 3 - ((record?.count) || 1),
  })
}

function detectTradition(q: string): string {
  if (q.includes('tarot') || q.includes('card') || q.includes('major arcana') || q.includes('divination') || q.includes('fool')) return 'Tarot'
  if (q.includes('sufi') || q.includes('rumi') || q.includes('whirling') || q.includes('dhikr') || q.includes('fana') || q.includes('love')) return 'Sufism'
  if (q.includes('enneagram') || q.includes('personality') || q.includes('type') || q.includes('attachment')) return 'Enneagram'
  if (q.includes('kabbalah') || q.includes('sephiroth') || q.includes('jewish') || q.includes('torah') || q.includes('tzimtzum') || q.includes('zohar') || q.includes('reincarnation')) return 'Kabbalah'
  if (q.includes('tantra') || q.includes('shakti') || q.includes('kundalini')) return 'Tantra'
  if (q.includes('dream') || q.includes('shadow') || q.includes('jung')) return 'Dreamwalker'
  if (q.includes('entheogen') || q.includes('dmt') || q.includes('psychedelic') || q.includes('lsd') || q.includes('medicine')) return 'Entheogen'
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
