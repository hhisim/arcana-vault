'use client'

const testimonials = [
  {
    quote: "The Tao oracle doesn't answer—it dissolves the question entirely. My practice has transformed.",
    author: 'M.C.',
    role: 'Zen Practitioner',
  },
  {
    quote: "Researching tarot used to take hours. Now I have a conversational guide to the archetypes.",
    author: 'J.R.',
    role: 'Astrologer',
  },
  {
    quote: "The entheogen bot spoke to experiences I had no language for. Profoundly helpful.",
    author: 'A.L.',
    role: 'Seeker',
  },
]

export default function Testimonials() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24 bg-raised/30">
      <h2 className="font-cinzel text-3xl text-center text-text-primary mb-12">
        What Seekers Say
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((item, index) => (
          <div key={index} className="glass-card p-8">
            <p className="italic text-text-secondary leading-relaxed">
              "{item.quote}"
            </p>

            <div className="flex items-center gap-3 mt-6">
              <div className="w-10 h-10 rounded-full bg-purple flex items-center justify-center text-text-primary text-sm font-medium">
                {item.author}
              </div>
              <div>
                <p className="text-text-primary text-sm font-medium">{item.author}</p>
                <p className="text-text-secondary text-xs">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
