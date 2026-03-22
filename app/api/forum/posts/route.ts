import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = getServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { post_id, content } = body

    if (!post_id || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const authorName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Seeker'

    const { data: reply, error } = await supabase
      .from('forum_replies')
      .insert({
        post_id,
        author_id: user.id,
        author_name: authorName,
        content,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(reply, { status: 201 })
  } catch (err) {
    console.error('[API forum/posts POST]', err)
    return NextResponse.json({ error: 'Failed to post reply' }, { status: 500 })
  }
}
