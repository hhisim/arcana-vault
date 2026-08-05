import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getStripe } from '@/lib/stripe'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { packFromSku, formatUsdCents } from '@/lib/shop'

export const dynamic = 'force-dynamic'

export default async function ShopThanksPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  const sessionId = searchParams.session_id
  if (!sessionId) {
    redirect('/shop')
  }

  let packTitle = ''
  let email = ''
  let amountCents: number | null = null
  let purchaseId: string | null = null
  let status = 'pending_access'
  let currency = 'usd'
  let sku: string | null = null

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId as string)
    sku = session.metadata?.sku ?? null
    const pack = packFromSku(sku)
    packTitle = pack?.title ?? 'Archive access'
    email = session.customer_details?.email || ''
    amountCents = session.amount_total ?? amountCents
    currency = session.currency || 'usd'

    const admin = getAdminSupabase()
    const row = {
      session_id: session.id,
      user_id: session.metadata?.user_id || null,
      email,
      sku: sku || 'unknown',
      pack_title: packTitle,
      amount_total: session.amount_total ?? null,
      currency: session.currency || 'usd',
      status: 'pending_access',
    }
    const { data: up } = await admin
      .from('purchases')
      .upsert(row, { onConflict: 'session_id' })
      .select('id,status')
      .maybeSingle()
    if (up) {
      purchaseId = up.id
      status = up.status
    }
  } catch (err) {
    // Stripe session may still be settling; show a gentle waiting state.
    console.error('[shop/thanks] error:', err instanceof Error ? err.message : String(err))
  }

  return (
    <main className="min-h-[70vh] mx-auto max-w-2xl px-4 py-16 text-center">
      {amountCents != null && purchaseId && (
        <script
          dangerouslySetInnerHTML={{
            __html:
              'window.dataLayer = window.dataLayer || [];' +
              "dataLayer.push({event:'purchase', ecommerce:{" +
              'transaction_id:' + JSON.stringify(purchaseId) + ',' +
              'value:' + (amountCents / 100) + ',' +
              'currency:' + JSON.stringify(currency) + ',' +
              'items:[{item_id:' + JSON.stringify(sku) +
              ',item_name:' + JSON.stringify(packTitle) +
              ',quantity:1,price:' + (amountCents / 100) + '}]' +
              '}});',
          }}
        />
      )}
      <h1 className="text-3xl font-serif mb-3">Thank you</h1>
      <p className="text-zinc-300 mb-2">Your purchase is confirmed:</p>
      <p className="text-amber-200 font-medium mb-6">{packTitle}</p>
      {amountCents != null && <p className="text-zinc-400 text-sm mb-8">Paid: {formatUsdCents(amountCents)}</p>}

      {purchaseId ? (
        <>
          <a
            href={`/api/shop/access/${purchaseId}`}
            className="inline-block bg-amber-500 text-black font-semibold px-6 py-3 rounded-lg hover:bg-amber-400"
          >
            Download your access file (.txt)
          </a>
          <p className="text-zinc-400 text-sm mt-6">
            Your Google Drive access will be authorized by an administrator within a few hours at
            the most. The access file contains your link.
          </p>
        </>
      ) : (
        <p className="text-zinc-400 text-sm">
          Processing your order… your access file and email are on the way. It will arrive within a
          few hours at the most.
        </p>
      )}

      <div className="mt-10">
        <Link href="/shop" className="text-amber-300 underline text-sm">
          Continue browsing the archives
        </Link>
      </div>
    </main>
  )
}
