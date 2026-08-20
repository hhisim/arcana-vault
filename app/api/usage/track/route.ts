import { NextRequest, NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tool, action, meta, timestamp } = body

    if (!tool || !action) {
      return NextResponse.json({ error: 'tool and action are required' }, { status: 400 })
    }

    // Get user from auth header if present
    const authHeader = req.headers.get('authorization')
    const userId = authHeader?.replace('Bearer ', '') || null
    const safeMeta = meta && typeof meta === 'object' ? meta : {}

    const supabase = getAdminSupabase()

    const { error } = await supabase.from('archive_sale_events').insert({
      tool,
      action,
      meta: safeMeta,
      user_id: userId,
      path: typeof safeMeta.href === 'string' ? safeMeta.href : null,
      placement: typeof safeMeta.placement === 'string' ? safeMeta.placement : null,
      sku: typeof safeMeta.sku === 'string' ? safeMeta.sku : null,
      user_agent: req.headers.get('user-agent'),
      created_at: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString(),
    })

    if (error) {
      console.error('[usage-track] insert error:', error)
      return NextResponse.json({ error: 'failed to log usage' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[usage-track] error:', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
