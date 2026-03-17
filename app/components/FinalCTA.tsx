'use client'

export default function FinalCTA() {
  return (
    <section className="w-full bg-gradient-to-b from-deep to-purple/10 py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-cinzel text-4xl text-text-primary">
          Your Practice, Deepened
        </h2>

        <p className="text-text-secondary mt-4">
          Join seekers worldwide. Start free, no credit card required.
        </p>

        <a
          href="/chat"
          className="inline-block bg-gold text-deep px-10 py-4 rounded-md font-medium mt-8 hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-shadow duration-200"
        >
          Open the Portal
        </a>
      </div>
    </section>
  )
}
