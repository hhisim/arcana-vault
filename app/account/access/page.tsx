import Link from 'next/link'
import { getCurrentUserLite } from '@/lib/account'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { formatUsdCents } from '@/lib/shop'

export const dynamic = 'force-dynamic'

type Purchase = {
  id: string
  pack_title: string
  sku: string
  amount_total: number | null
  currency: string | null
  status: string
  access_link: string | null
  created_at: string
}

export default async function AccessLockerPage() {
  const user = await getCurrentUserLite()

  let purchases: Purchase[] = []
  if (user) {
    const admin = getAdminSupabase()
    const { data } = await admin
      .from('purchases')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    purchases = (data as Purchase[] | null) ?? []
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-serif mb-2">Your Locker</h1>
      <p className="text-zinc-400 text-sm mb-8">
        Your purchased archives and their access files. Drive access is authorized by an admin
        within a few hours of purchase.
      </p>

      {!user ? (
        <div className="border border-white/10 rounded-xl p-8 text-center bg-white/[0.02]">
          <p className="text-zinc-300 mb-4">
            You need to be signed in to see your purchases in the locker.
          </p>
          <p className="text-zinc-500 text-sm">
            Don&apos;t worry — if you bought as a guest, we emailed your access file to your inbox.
            You can also reach out via our{' '}
            <Link href="/contact" className="text-amber-300 underline">
              contact page
            </Link>
            .
          </p>
        </div>
      ) : purchases.length === 0 ? (
        <div className="border border-white/10 rounded-xl p-8 text-center bg-white/[0.02]">
          <p className="text-zinc-300 mb-4">No purchases here yet.</p>
          <Link href="/shop" className="text-amber-300 underline">
            Browse the archives
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {purchases.map((p) => (
            <li key={p.id} className="border border-white/10 rounded-xl p-5 bg-white/[0.02]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-serif text-lg leading-snug">{p.pack_title}</p>
                  <p className="text-zinc-500 text-xs mt-1">
                    {new Date(p.created_at).toLocaleDateString()} ·{' '}
                    {p.amount_total != null ? formatUsdCents(p.amount_total) : ''}
                  </p>
                  <p className="text-xs mt-1">
                    {p.status === 'authorized' ? (
                      <span className="text-emerald-400">Access authorized</span>
                    ) : (
                      <span className="text-amber-300">Access pending — admin authorizes within a few hours</span>
                    )}
                  </p>
                  {p.access_link && (
                    <a
                      href={p.access_link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-300 underline text-sm mt-2 inline-block"
                    >
                      Open your Google Drive archive
                    </a>
                  )}
                </div>
                <a
                  href={`/api/shop/access/${p.id}`}
                  className="shrink-0 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold px-3 py-2 rounded-lg"
                >
                  Access file
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10">
        <Link href="/shop" className="text-amber-300 underline text-sm">
          ← Back to the archives
        </Link>
      </div>
    </main>
  )
}
