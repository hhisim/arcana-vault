import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = getServerSupabase()

    // Increment view count
    await supabase.rpc('increment_view_count', { post_id: id }).catch(() => {
      // Fallback: direct update if RPC doesn't exist
      return supabase
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
    })

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
