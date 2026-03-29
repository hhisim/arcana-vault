import { NextRequest, NextResponse } from 'next/server'

const DEMO_ANSWERS = [
  {
    question: 'What is the first teaching of the Tao Te Ching about yielding?',
    answer: 'The Tao Te Ching opens with what may be the most profound single line ever written: "The Tao that can be told is not the eternal Tao." But the second verse cuts deeper still — "Yield and survive. Bend and remain straight. Emptiness holds everything. Stillness returns to its nature. The soft overcomes the hard. The yielding overcomes the unyielding." Wu wei — not by pushing, but by learning the shape of what already wants to move. The river does not force its path. It finds it. This is the first teaching: not action, but alignment.',
    tradition: 'Taoism'
  },
  {
    question: 'How does the Kabbalah describe the path between death and rebirth?',
    answer: 'In Kabbalah, the soul descends through the twelve gates of the Yetziratic world after death — each gate stripping away another layer of egoic identity. The soul does not choose its next incarnation; it is drawn by resonance — by the quality of love it generated in life. The twelve gates correspond to the twelve permutations of the Tetragrammaton, and each one is a test of what you most cling to. Those who cling to nothing pass through all twelve in an instant. Those who cling to something pass through slowly, learning the shape of their attachment before they can let it go.',
    tradition: 'Kabbalah'
  },
  {
    question: 'What is the heart of Sufi mystical practice?',
    answer: 'The heart of Sufi practice is fana — the annihilation of the ego in the presence of the Divine. Not the destruction of the self, but its dissolution into love. The Sufi does not seek to become nothing; they seek to become a transparent vessel for the One. Through sama (whirling), dhikr (remembrance), and the practice of ishq (divine love), the Sufi allows the ego to burn away naturally, revealing the divine essence underneath. Rumi wrote: "What you seek is seeking you." The practice is not about reaching God — it is about allowing God to reach through you.',
    tradition: 'Sufism'
  },
  {
    question: 'What does the Tarot reveal about the nature of time?',
    answer: 'The Tarot presents time not as a line but as a spiral. The Major Arcana twenty-two cards are the archetypal patterns that recur in every age — creation, judgment, death, rebirth — the same faces in every era, wearing different costumes. Time in the Tarot is cyclical: the Wheel of Fortune turns, the Hanged Man turns upside down, the Fool begins again. What the Tarot teaches is that moments of crisis — the Tower, the Death card — are not punishments but accelerations. The spiral moves through the same archetypal territories repeatedly, each time at a higher octave, until consciousness transmutes time itself into eternity.',
    tradition: 'Tarot'
  },
  {
    question: 'How does the Enneagram describe the path to liberation?',
    answer: 'The Enneagram teaches that liberation comes not from fixing your type, but from understanding that you ARE your type before you were wounded. The Nine personalities are not flaws to correct — they are the nine faces the Divine takes when it forgets its own nature. The path to liberation is not self-improvement but self-remembering: dropping back through the layers of personality to the essential nature underneath. Each type has a specific "remembering" — a specific doorway back. The Type Eight remembers through vulnerability. The Type Four through ordinary life. The Type One through letting go of judgment. The work is not to become someone else. It is to discover who you already are beneath the story.',
    tradition: 'Enneagram'
  },
]

export async function GET() {
  const answer = DEMO_ANSWERS[0]
  return NextResponse.json({ question: answer.question, answer: answer.answer, tradition: answer.tradition })
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour window
  
  // Simple in-memory rate limiting — reset per hour per IP
  const key = `demo:${ip}`
  const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
  
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
  
  // Route to matching tradition
  if (q.includes('tarot') || q.includes('card') || q.includes('major arcana') || q.includes('divination')) {
    return NextResponse.json({ ...DEMO_ANSWERS[3], question: question.trim(), remaining: 3 - (record?.count || 1) })
  } else if (q.includes('kabbalah') || q.includes('sephiroth') || q.includes('jewish') || q.includes('torah') || q.includes('tzimtzum')) {
    return NextResponse.json({ ...DEMO_ANSWERS[1], question: question.trim(), remaining: 3 - (record?.count || 1) })
  } else if (q.includes('sufi') || q.includes('rumi') || q.includes('whirling') || q.includes('dhikr') || q.includes('fana')) {
    return NextResponse.json({ ...DEMO_ANSWERS[2], question: question.trim(), remaining: 3 - (record?.count || 1) })
  } else if (q.includes('enneagram') || q.includes('personality') || q.includes('type')) {
    return NextResponse.json({ ...DEMO_ANSWERS[4], question: question.trim(), remaining: 3 - (record?.count || 1) })
  }

  // Default: Tao Te Ching (fallback)
  return NextResponse.json({ ...DEMO_ANSWERS[0], question: question.trim(), remaining: 3 - (record?.count || 1) })
}
