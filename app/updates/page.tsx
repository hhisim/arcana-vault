import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { UPDATES } from '@/lib/updates'

export const metadata = buildMetadata(
  'Updates · The Vault in Motion',
  'Timestamped Vault of Arcana release notes: new writing, Oracle repairs, reliability changes, and what remains under verification.',
  '/updates',
)

function formatUtc(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeStyle: 'short', timeZone: 'UTC' }).format(new Date(iso)) + ' UTC'
}

export default function UpdatesPage() {
  return <div className="min-h-screen bg-[#090912] text-[#eee7f3]">
    <header className="border-b border-white/10 bg-[radial-gradient(ellipse_at_top,_rgba(113,64,133,.22),_transparent_70%)] px-6 py-24 text-center sm:py-32">
      <p className="text-[11px] uppercase tracking-[.34em] text-[#d1ad75]">THE VAULT IN MOTION</p>
      <h1 className="mx-auto mt-6 max-w-4xl font-serif text-5xl font-normal leading-tight text-[#f8eddb] sm:text-7xl">What’s new in the Vault</h1>
      <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#c9bcd0]">A public record of new work, refinements, and repairs. Every entry is dated in UTC. We distinguish what has shipped from what still needs verification—because trust is part of the practice.</p>
      <div className="mx-auto mt-8 flex justify-center gap-3 text-xs text-[#b5a4bb]"><span className="rounded-full border border-[#b99c69]/50 px-4 py-2">Released work</span><span className="rounded-full border border-[#76657f]/70 px-4 py-2">Evidence and limits</span></div>
    </header>
    <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
      <div className="mb-9 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5"><h2 className="font-serif text-3xl text-[#e6cd9e]">Release notes</h2><span className="text-xs uppercase tracking-widest text-[#b4a8bf]">Newest first · UTC</span></div>
      <ol className="relative border-l border-[#ad8c6470] pl-5 sm:pl-10">
        {UPDATES.map((update) => <li key={update.id} id={update.id} className="relative mb-9 rounded-xl border border-white/10 bg-[#181421] p-6 shadow-[0_12px_45px_rgba(0,0,0,.17)] sm:p-9">
          <span aria-hidden="true" className="absolute -left-[26px] top-8 h-2.5 w-2.5 rounded-full border border-[#edcb84] bg-[#24162a] sm:-left-[46px]" />
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[.15em] text-[#bba27a]"><time dateTime={update.publishedAt}>{formatUtc(update.publishedAt)}</time><span aria-hidden="true">·</span><span>{update.label}</span><span className={`rounded-full border px-2 py-1 ${update.status === 'shipped' ? 'border-[#d7b77b]/60 text-[#ebc98e]' : 'border-[#9e94a9] text-[#cbc3d0]'}`}>{update.status === 'shipped' ? 'Shipped' : 'Under verification'}</span></div>
          <h3 className="mt-5 font-serif text-2xl text-[#f7e9cd] sm:text-3xl">{update.title}</h3>
          <p className="mt-4 leading-7 text-[#d2c5d7]">{update.summary}</p>
          <ul className="mt-5 space-y-2 pl-5 text-sm leading-7 text-[#bcb2c5]">{update.details.map((detail) => <li key={detail} className="list-disc marker:text-[#c8ab76]">{detail}</li>)}</ul>
          <details className="mt-6 border-t border-white/10 pt-4 text-xs text-[#b0a4b7]"><summary className="cursor-pointer text-[#dac391] hover:text-[#f2d29a]">Verification and scope</summary><p className="mt-3 leading-6">{update.verification}</p>{update.sourceCommit && <p className="mt-2 font-mono">Release reference: {update.sourceCommit.slice(0, 12)}</p>}</details>
        </li>)}
      </ol>
      <div className="mt-12 rounded-2xl border border-[#b89a6d]/30 bg-[#241b2b] p-7 text-center"><h2 className="font-serif text-2xl text-[#ebd0a0]">Keep exploring</h2><p className="mt-3 text-sm leading-7 text-[#c9bfd0]">New essays and updates will appear here as they are verified and published.</p><div className="mt-5 flex justify-center gap-5 text-sm"><Link href="/blog" className="text-[#ebd0a0] underline underline-offset-4">Read the Scroll</Link><Link href="/initiation" className="text-[#ebd0a0] underline underline-offset-4">Join the Initiation</Link></div></div>
    </div>
  </div>
}
