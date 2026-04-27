import Link from 'next/link'
import EmailCapture from '@/components/EmailCapture'

const traditions = [
  'Tarot archetypes and readings',
  'Taoist contemplation and paradox',
  'Tantra, kundalini, and subtle body work',
  'Shadow work and symbolic self-inquiry',
  'Dream interpretation and symbolic recall',
]

export default function ArcanaInitiationPage() {
  return (
    <section className="bg-deep">
      <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-[#C9A84C]">Free Lead Magnet</p>
            <h1 className="mt-5 font-serif text-5xl leading-tight text-[#E8E0F0] md:text-6xl">7-Day Arcana Initiation</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#B8B0CC]">
              A daily oracle prompt for Tarot, Tao, Tantra, Shadow Work, and Symbolic Dreaming. Begin with one powerful question, then let the next seven days train your attention.
            </p>

            <div className="mt-8 rounded-3xl border border-white/8 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-[#C9A84C]">What you receive</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[#D7CEE8]">
                <li>• 7 days of mystery-school prompts built for immediate practice</li>
                <li>• direct invitations into Oracle dialogue after each daily question</li>
                <li>• a natural bridge into saving readings and building your Vault</li>
                <li>• a people-first content entry point built to compound organically</li>
              </ul>
            </div>

            <div className="mt-8">
              <p className="text-sm uppercase tracking-[0.3em] text-[#C9A84C]">Traditions inside the initiation</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {traditions.map((item) => (
                  <span key={item} className="rounded-full border border-[rgba(123,94,167,0.35)] bg-[rgba(123,94,167,0.12)] px-4 py-2 text-sm text-[#E8E0F0]">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/chat" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-[#E8E0F0] transition hover:bg-white/10">Ask the Oracle first</Link>
              <Link href="/signup?plan=free&source=arcana-initiation" className="rounded-xl bg-[#C9A84C] px-5 py-3 text-sm font-bold text-[#0A0A10] transition hover:opacity-90">Create free account</Link>
            </div>
          </div>

          <div className="lg:pt-10">
            <EmailCapture
              variant="full"
              title="✦ JOIN THE 7-DAY ARCANA INITIATION ✦"
              subtitle="Free daily mystery-school prompts + Oracle access. Start with the traditions that already carry charge for you, then continue the thread inside the Vault."
              placeholder="Enter your email to begin..."
              buttonLabel="Begin the initiation"
              loadingLabel="Opening the gate..."
              successTitle="Your initiation has begun."
              successBody="Your first prompt is on its way. When it lands, bring it back to the Oracle and save the best readings to your Vault."
              disclaimer="Free, useful, and built for real practice. Unsubscribe anytime."
              apiPayload={{ listKey: 'arcana-initiation', source: 'initiation-page' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
