'use client'

import Link from 'next/link'
import EmailCapture from '@/components/EmailCapture'
import { useAuth } from '@/components/auth/AuthProvider'

const BAIT_TOPICS = ['Tarot', 'Taoism', 'Tantra', 'Entheogens', 'Dreams', 'Symbols', 'Names', 'Correspondence Codex']

export default function GrowthFunnelCta({ className = '' }: { className?: string }) {
  const auth = useAuth()
  const isAuthed = auth.isAuthenticated

  return (
    <div className={`mt-5 rounded-3xl border border-[rgba(201,168,76,0.22)] bg-[linear-gradient(135deg,rgba(201,168,76,0.08),rgba(123,94,167,0.12))] p-5 md:p-6 ${className}`}>
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#C9A84C]">Continue the transmission</p>
          <h3 className="mt-3 font-serif text-2xl text-[#E8E0F0] md:text-3xl">Save this transmission to your Vault</h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#C8C0D8]">
            {isAuthed
              ? 'Your readings can live inside your Practice Journal. Keep the thread and continue with daily questions in your chosen tradition.'
              : 'Create a free account and receive 12 daily questions in your chosen tradition. Let people feel the magic first — then invite them deeper.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {BAIT_TOPICS.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-[rgba(123,94,167,0.35)] bg-[rgba(123,94,167,0.12)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#D7CEE8]"
            >
              {topic}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={isAuthed ? '/journal' : '/signup?plan=free'}
            className="inline-flex items-center justify-center rounded-xl bg-[#C9A84C] px-5 py-3 text-sm font-bold text-[#0A0A10] transition hover:opacity-90"
          >
            {isAuthed ? 'Open your Vault' : 'Create free account'}
          </Link>
          <Link
            href={isAuthed ? '/daily' : '/signup?plan=free'}
            className="inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-medium text-[#E8E0F0] transition hover:bg-white/10"
          >
            {isAuthed ? 'Continue daily practice' : 'Receive 12 daily questions'}
          </Link>
        </div>

        {!isAuthed ? (
          <div className="rounded-2xl border border-white/8 bg-[#0A0A10]/70 p-4">
            <div className="mb-4">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A84C]">Free lead magnet</p>
              <h4 className="mt-2 font-serif text-xl text-[#E8E0F0]">7-Day Arcana Initiation</h4>
              <p className="mt-2 text-sm leading-7 text-[#9B93AB]">Join the 7-Day Arcana Initiation — free daily mystery-school prompts + Oracle access.</p>
            </div>
            <EmailCapture
              variant="compact"
              title="✦ 7-DAY ARCANA INITIATION ✦"
              compactHint="A daily oracle prompt for Tarot, Tao, Tantra, Shadow Work, and Symbolic Dreaming."
              placeholder="Enter your email for the Initiation..."
              buttonLabel="Join free"
              loadingLabel="Opening..."
              successTitle="You are in the Initiation."
              successBody="Watch for your first daily prompt and return to the Oracle when the question lands."
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
