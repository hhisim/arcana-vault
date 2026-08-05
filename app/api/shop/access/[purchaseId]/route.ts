import { NextRequest, NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { packFromSku, buildAccessTxt, type ShopPack } from '@/lib/shop'

export const runtime = 'nodejs'

/**
 * Returns the access .txt for a purchase. The file includes the buyer's
 * link and the "admin will authorize access within a few hours" note. If an
 * admin has set access_link, it is included; otherwise it points at the
 * buyer's access page.
 */
export async function GET(_req: NextRequest, { params }: { params: { purchaseId: string } }) {
  const admin = getAdminSupabase()
  const { data, error } = await admin.from('purchases').select('*').eq('id', params.purchaseId).maybeSingle()
  if (error || !data) {
    return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
  }

  const pack = packFromSku(data.sku)
  const fallback: ShopPack = {
    sku: data.sku,
    etsyListingId: 0,
    title: data.pack_title,
    price: data.currency === 'usd' && data.amount_total ? data.amount_total / 100 : 0,
    stripePriceId: '',
    views: 0,
    favs: 0,
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vaultofarcana.com'
  const txt = buildAccessTxt({
    pack: pack ?? fallback,
    email: data.email,
    accessLink: data.access_link,
    siteUrl: site,
    status: data.status,
  })

  return new NextResponse(txt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="vault-of-arcana-access.txt"',
    },
  })
}
