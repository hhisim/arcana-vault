'use client'

export default function NotifyForm({ traditionName }: { traditionName: string }) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex gap-2"
    >
      <input
        type="email"
        placeholder="your@email.com"
        className="flex-1 rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-[#E8E0F0] placeholder-[#9B93AB]/50 focus:border-[#C9A84C]/50 focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/20 transition-all"
      />
      <button
        type="submit"
        className="rounded-md bg-[var(--primary-gold)] text-[#0A0A0F] px-4 py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-[#B1933E] transition-colors"
      >
        Notify Me
      </button>
    </form>
  )
}
