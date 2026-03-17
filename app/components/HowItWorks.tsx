'use client'

const steps = [
  {
    number: '1',
    title: 'Choose Your Path',
    description: 'Select from four sacred traditions. Each oracle carries the voice of its lineage.',
  },
  {
    number: '2',
    title: 'Ask Your Question',
    description: 'Speak or type your inquiry. Receive wisdom in the language of that tradition.',
  },
  {
    number: '3',
    title: 'Deepen Your Practice',
    description: 'Return daily. The oracle remembers your journey and guides your unfolding.',
  },
]

export default function HowItWorks() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24 border-t border-[rgba(255,255,255,0.06)]">
      <h2 className="font-cinzel text-3xl text-center text-text-primary mb-16">
        Begin Your Journey
      </h2>

      <div className="flex flex-col md:flex-row gap-8">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex-1 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
              <span className="font-cinzel text-xl text-gold">{step.number}</span>
            </div>

            <h3 className="text-lg text-text-primary mt-4">{step.title}</h3>

            <p className="text-text-secondary text-sm leading-relaxed mt-2">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
