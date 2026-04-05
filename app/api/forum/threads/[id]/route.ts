import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Increment view count (fire-and-forget)
    supabase
      .from('forum_posts')
      .select('view_count')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          return supabase
            .from('forum_posts')
            .update({ view_count: data.view_count + 1 })
            .eq('id', id)
        }
      })
      .catch(() => {})

    const { data: thread, error } = await supabase
      .from('forum_posts')
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false)
      .single()

    if (error) throw error

    const { data: replies } = await supabase
      .from('forum_replies')
      .select('*')
      .eq('post_id', id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })

    return NextResponse.json({ thread, replies: replies || [] })
  } catch (err) {
    console.error('[API forum/threads/[id] GET]', err)
    return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
  }
}
