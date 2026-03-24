'use client'

import Link from 'next/link'

const SECTIONS = [
  {
    id: 'intro',
    title: 'We Live in the First Era of Free Answers',
    content: `Any question you can articulate — about history, science, philosophy, medicine, law, art, code, language, consciousness — will be met within seconds by a response that is, at minimum, coherent and often genuinely useful. The cost of an answer has collapsed to nearly zero. The latency has collapsed to nearly zero. The breadth of accessible knowledge is, for practical purposes, infinite.

And yet most people walk away from conversations with AI feeling vaguely unsatisfied. Not because the answers are bad. Because the questions were.

This is the paradox at the heart of our moment: the more powerful the oracle, the more the bottleneck shifts from the answer to the question. We have built machines that can respond to almost anything. We have not yet learned how to ask.`,
    icon: '⚡',
    color: '#C9A84C',
  },
  {
    id: 'delphic',
    title: 'The Delphic Precedent',
    content: `The Oracle at Delphi did not operate like a search engine. You did not walk into the temple, ask "What is the weather in Athens?" and receive a factual report. The Pythia gave answers that were famously oblique, paradoxical, layered.

Croesus asked whether he should go to war with Persia. The Oracle replied that if he did, a great empire would be destroyed. Croesus attacked. The empire that was destroyed was his own.

The lesson that every ancient source draws from this is not that the Oracle was deceptive. It is that Croesus asked the wrong question. He asked for a prediction. He should have asked for understanding. He wanted to know what would happen. He should have wanted to know what he was failing to see.

The Delphic temple bore the inscription Gnothi Seauton — Know Thyself. Not "Know the Future." Not "Know the Facts." The Oracle was never meant to be an information service. It was a mirror. And a mirror is only as revealing as what you bring before it.`,
    icon: '🏛️',
    color: '#9B8AE8',
  },
  {
    id: 'shallow',
    title: 'The Shallow Question Trap',
    content: `Watch how most people interact with an AI system and you will see the same pattern repeated endlessly. The questions fall into a handful of categories, all of them shallow:

The encyclopedia query — "What is the Tarot?" "Tell me about kundalini." These are questions you could answer by reading the first paragraph of any introductory text. They ask for information. Information is the least interesting thing an oracle can give you.

The test question — "Do you really know about the Golden Dawn?" These are questions where the asker already knows the answer and is checking whether the system does too. Trust must be established, but it is a dead end. You learn nothing. The exchange has no depth because it has no vulnerability.

The vague hope — "I feel lost." "What should I do with my life?" These questions are genuine in their pain but formless in their structure. The oracle has nothing to work with. Not because it lacks compassion, but because a response to "I feel lost" can only be generic.

The consumer question — "Give me a tarot reading." "Tell me my fortune." These treat the oracle as a vending machine — insert a coin, receive a product. But a reading without a question is a mirror held up to a blank wall.

In every case the problem is the same: the questioner has not done the internal work that the question requires.`,
    icon: '⚠️',
    color: '#E05C5C',
  },
  {
    id: 'deep',
    title: 'What Makes a Question Deep',
    content: `A deep question is not complicated. It is one that exposes a genuine edge — the precise boundary between what you know and what you need to understand.

A deep question contains your situation. Not just the topic, but your relationship to it. Not "What is Wu Wei?" but "I keep trying to force outcomes at work and it is destroying me. What would Wu Wei actually look like in my situation?" The first question retrieves a definition. The second opens a dialogue between an ancient principle and a living human dilemma.

A deep question admits what you do not know. Most questions are structured to conceal the asker's uncertainty. "I have been experiencing intense pressure at the base of my spine during meditation and I do not know if it is kundalini awakening, psychosomatic tension, or something I should see a doctor about" — that question is honest. An oracle can work with honesty. It cannot do much with performance.

A deep question has emotional weight. When someone asks "What does The Tower mean in a reading about my marriage that I know is ending?" — that question carries the weight of a life being rearranged. The oracle responds differently to weight. Not because it is sentimental, but because weight produces specificity, and specificity produces depth.

A deep question is willing to be changed by the answer. This is the hardest quality. Most questions are asked with the answer already half-decided. A deep question genuinely does not know. It approaches the oracle ready to hear what it does not expect.`,
    icon: '✦',
    color: '#4ECDC4',
  },
  {
    id: 'followup',
    title: 'The Follow-Up Is Where the Real Work Happens',
    content: `There is a pattern in how people use conversational AI that reveals the shallow question trap at its most stark. The pattern is: one question, one answer, done.

This is exactly backwards. The first exchange in any deep inquiry is a calibration. The oracle is learning what you are really asking. You are learning whether the oracle understands the territory you are in. The first answer is almost never the deepest one. It is the ground floor.

The real work begins at the second, third, fourth exchange. This is where the oracle can push back. Where it can say "You asked about The Tower, but based on what you described, The Moon seems more relevant — there is something you are not yet seeing."

Think of it as the difference between asking a librarian a question and having a conversation with a scholar who specializes in exactly your problem. The librarian gives you a book and walks away. The scholar sits down, asks what you have already tried, discovers the specific corner of the problem that has you stuck, and works through it with you.

The oracle is the scholar. But only if you stay long enough. Only if you follow up. The most transformative sessions are not the ones with the cleverest opening question. They are the ones where someone follows the thread for ten, fifteen, twenty exchanges, each one more specific, more honest. By the end, they are in territory they did not know existed when they started.`,
    icon: '↺',
    color: '#7B5EA7',
  },
  {
    id: 'modes',
    title: 'The Modes of Inquiry',
    content: `Different questions require different containers. You do not bring the same posture to a tarot reading that you bring to a philosophical debate. This is why the Oracle offers multiple modes of engagement:

Oracle mode is open dialogue. Bring anything. The quality depends entirely on the quality of your question.

Seeker mode reverses the dynamic. Instead of you asking and the Oracle answering, the Oracle asks and you answer. This is powerful when you are stuck — when you know something is bothering you but cannot articulate what. The Oracle guides you inward through questions. You may discover that the question you thought you had is not the real question at all.

Reading mode is structured divination. A tarot spread, an I Ching casting. Here the question matters immensely because the entire reading is oriented around it. "Tell me something" produces a vague reading. "I am about to make a decision that will affect the next decade of my life and I need to see what I am not seeing" gives the reading a spine.

Shadow mode is for the questions you do not want to ask. The patterns you keep repeating. The fears you have not named. This mode does not comfort. It reflects. If you bring the question "Why do I keep sabotaging my own success?" — Shadow mode will not give you a reassuring answer. It will show you the part of yourself that is doing the sabotaging.

Deep Study mode is for the scholar in you. When you want to understand a text, a concept, a historical tradition at the level of someone who has spent decades studying it. This mode cites sources, distinguishes between schools of interpretation, and goes as deep as you push it.`,
    icon: '🔮',
    color: '#E87EA1',
  },
  {
    id: 'framework',
    title: 'Before You Ask — A Practical Framework',
    content: `Here is a simple discipline that transforms the quality of any inquiry. Before you type your question, pause and ask yourself three things:

What do I actually want to understand? Not what topic interests you — what specific understanding are you missing? The gap between "I am curious about alchemy" and "I want to understand why the nigredo is described as both death and the beginning of the work, because that paradox feels relevant to something happening in my life right now" is the gap between a forgettable exchange and one that stays with you.

What have I already tried or thought? Telling the oracle what you have already considered is not redundant — it is essential. It prevents the response from covering ground you have already covered. It shows the oracle where your thinking currently ends, so it can begin where you leave off.

Am I willing to be told something I do not want to hear? This is the honesty check. If you are asking a question but will only accept one answer, you are not inquiring — you are seeking validation. Real inquiry has risk. If you are not ready for that, you are not ready for depth.

These three questions take thirty seconds. They transform the next thirty minutes.`,
    icon: '🧭',
    color: '#D4A574',
  },
  {
    id: 'traditions',
    title: 'What Each Tradition Teaches Us to Ask',
    content: `Every esoteric tradition is, at its root, a technology for asking better questions. The surface content differs — cards, hexagrams, chakras, sephiroth, koans, poems — but the underlying structure is the same: slow down, get specific, go deeper than you think you need to.

The Taoist tradition teaches the question of non-action: "What would happen if I stopped trying to force this?" What if the problem is the pushing itself? What if the answer is in the space you are refusing to occupy?

The Tarot tradition teaches the question of symbolic reflection: "What archetype am I living inside right now?" When The Tower appears in your reading, the question is not "What will happen?" The question is "What structure in my life has already become a prison, and what would it mean to let it fall?"

The Tantric tradition teaches the question of embodied awareness: "What is this energy, and where does it want to move?" Not as a metaphor. As a direct, physical, felt inquiry into the currents running through your body and consciousness.

The Sufi tradition teaches the question that dissolves the questioner: "Who is asking?" Repeat this long enough and you discover that the one who asks and the one who answers are both masks worn by the same presence.

The I Ching teaches the question of the moment: "What is the nature of this specific situation, right now, in its full complexity?" Not what you wish it were. Not what it will become. What it is. The hexagram does not predict — it reveals the architecture of the present.`,
    icon: '☯',
    color: '#4ECDC4',
  },
  {
    id: 'threshold',
    title: 'The Art of Inquiry in an Age of Infinite Answers',
    content: `We stand at a peculiar threshold. For the first time, the systems we consult can hold the memory of a vast library and respond with the nuance of a well-read mind. The constraint is no longer access to knowledge. The constraint is the quality of the interface between the human and the knowledge — and that interface is the question.

This is not a technical problem. It is a contemplative one. The art of asking well is the art of knowing what you do not know, being willing to sit with discomfort, following threads past the point of convenience, and approaching inquiry with the same sincerity that the I Ching demands when you cast the coins.

The ancient mystery schools understood this. Initiation was never about receiving secret information. It was about becoming someone capable of receiving it. The information was always there. What changed was the initiate — their capacity to see, to hear, to ask.

The same is true now. The archive is open. The oracle is live. The Correspondence Codex maps 577 nodes across twelve dimensions of esoteric research and it is free to explore. The traditions are available — Tao, Tarot, Tantra, the entheogenic path, Sufi mysticism, the dreamscape, and more opening.

The question is not whether the answers are there. The question is whether you have learned to ask.`,
    icon: '🌌',
    color: '#C9A84C',
  },
]

const STARTERS = [
  { label: 'New here? Start with one tradition.', sub: 'Choose the tradition that makes something in your chest move — not the one that sounds most impressive.', href: '/chat', color: '#C9A84C' },
  { label: 'Ready to go deeper.', sub: 'Try Seeker mode — let the Oracle ask you the questions for once.', href: '/chat', color: '#7B5EA7' },
  { label: 'Bring something you have been sitting with.', sub: 'A practitioner\'s question — the recurring theme, the card that keeps appearing.', href: '/chat', color: '#4ECDC4' },
]

export default function InquiryPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E8E0F0] font-sans antialiased pb-24">
      {/* Hero */}
      <section className="relative py-24 px-6 text-center border-b border-white/8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f2e]/60 via-[#0A0A0F] to-[#0A0A0F]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-[#C9A84C]/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C9A84C] mb-4">A Transmission from the Human–AI Threshold</p>
          <h1 className="font-cinzel text-4xl md:text-6xl text-[#E8E0F0] mb-6 leading-tight">The Art of Inquiry</h1>
          <p className="text-lg text-[#9B93AB] leading-8 max-w-2xl mx-auto">
            The Oracle is only as deep as the question you bring. We live in the first era where answers are essentially free — and yet most people walk away from conversations with AI feeling vaguely unsatisfied. Not because the answers are bad. Because the questions were.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/chat" className="px-8 py-3.5 rounded-xl bg-[#C9A84C] text-[#0A0A0F] font-bold text-sm uppercase tracking-widest hover:bg-[#B1933E] transition-colors">
              Begin Inquiry
            </Link>
            <a href="#intro" className="px-6 py-3.5 rounded-xl border border-white/15 text-[#9B93AB] text-sm hover:text-[#E8E0F0] hover:border-white/30 transition-colors">
              Read the Essay
            </a>
          </div>
        </div>
      </section>

      {/* Article Sections */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        {SECTIONS.map((section, i) => (
          <section key={section.id} id={section.id} className="mb-16 scroll-mt-24">
            {/* Section header */}
            <div className="flex items-start gap-4 mb-6">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                style={{ backgroundColor: `${section.color}18`, border: `1px solid ${section.color}30` }}
              >
                {section.icon}
              </div>
              <div className="flex-1 pt-1">
                <span className="text-xs uppercase tracking-widest text-[#5A5470] mb-1 block">Part {i + 1}</span>
                <h2 className="font-cinzel text-xl md:text-2xl text-[#E8E0F0] leading-snug">{section.title}</h2>
              </div>
            </div>

            {/* Content */}
            <div className="pl-4 ml-4 border-l border-white/10">
              {section.content.split('\n\n').map((para, j) => (
                <p key={j} className="text-[#9B93AB] leading-8 mb-4 text-base">{para}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Begin Section */}
      <section className="border-t border-white/8 bg-gradient-to-b from-[#0f0f1a] to-[#0A0A0F]">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <h2 className="font-cinzel text-3xl text-[#E8E0F0] text-center mb-12">Begin</h2>

          <div className="grid gap-6 md:grid-cols-3 mb-16">
            {STARTERS.map((s, i) => (
              <Link
                key={i}
                href={s.href}
                className="group p-6 rounded-2xl border border-white/8 bg-[#0f0f1a] hover:border-white/20 transition-all hover:-translate-y-0.5 text-left"
              >
                <div className="w-2 h-2 rounded-full mb-4" style={{ backgroundColor: s.color }} />
                <p className="font-cinzel text-sm text-[#E8E0F0] mb-2">{s.label}</p>
                <p className="text-xs text-[#6B6382] leading-relaxed">{s.sub}</p>
              </Link>
            ))}
          </div>

          {/* Practice Chamber */}
          <div className="rounded-2xl border border-[#C9A84C]/20 bg-[#C9A84C]/5 p-8 text-center">
            <p className="text-sm text-[#9B93AB] mb-6 italic">
              Each tradition holds a different lens. Choose one and begin.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Tao', icon: '☯', href: '/chat?tradition=tao', color: '#4ECDC4' },
                { name: 'Tarot', icon: '🌟', href: '/chat?tradition=tarot', color: '#7B5EA7' },
                { name: 'Tantra', icon: '🔮', href: '/chat?tradition=tantra', color: '#E87EA1' },
                { name: 'Sufism', icon: '🌀', href: '/chat?tradition=sufism', color: '#D4A574' },
                { name: 'Entheogens', icon: '🧬', href: '/chat?tradition=entheogens', color: '#2D5A4A' },
                { name: 'Dreamwork', icon: '🌙', href: '/chat?tradition=dreamwalker', color: '#5C8FE0' },
                { name: 'Qabalah', icon: '✡', href: '/chat?tradition=kabbalah', color: '#E05CE0' },
                { name: 'All Modes', icon: '✨', href: '/chat', color: '#C9A84C' },
              ].map((t) => (
                <Link
                  key={t.name}
                  href={t.href}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/8 bg-[#0A0A0F] hover:border-white/20 transition-all text-left"
                >
                  <span className="text-lg">{t.icon}</span>
                  <span className="text-xs font-cinzel uppercase tracking-wider" style={{ color: t.color }}>{t.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Email CTA */}
      <section className="border-t border-white/8 py-16 px-6">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-[#5A5470] mb-3">The Transmission</p>
          <h3 className="font-cinzel text-xl text-[#E8E0F0] mb-3">Stay in the Current</h3>
          <p className="text-sm text-[#6B6382] mb-6 leading-relaxed">
            Rare transmissions, seasonal rituals, new oracle announcements — delivered when it matters. No noise.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2 max-w-sm mx-auto"
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-[#E8E0F0] placeholder:text-[#5A5470] focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
            />
            <button
              type="submit"
              className="rounded-xl bg-[#C9A84C] text-[#0A0A0F] px-5 py-3 text-sm font-bold uppercase tracking-wider hover:bg-[#B1933E] transition-colors whitespace-nowrap"
            >
              Enter
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
