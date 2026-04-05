import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = getServerSupabase()
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    let query = supabase
      .from('forum_posts')
      .select('*', { count: 'exact' })
      .eq('is_deleted', false)
      .order('is_pinned', { ascending: false })
      .order('last_reply_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category) {
      query = query.eq('category_slug', category)
    }

    const { data: threads, error, count } = await query

    if (error) throw error

    return NextResponse.json({ threads: threads || [], total: count || 0, page, limit })
  } catch (err) {
    console.error('[API forum/threads GET]', err)
    return NextResponse.json({ error: 'Failed to load threads' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { category_slug, title, content, tags } = body

    if (!category_slug || !title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const authorName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Seeker'

    const { data: thread, error } = await supabase
      .from('forum_posts')
      .insert({
        category_slug,
        author_id: user.id,
        author_name: authorName,
        title,
        content,
        tags: tags || [],
        last_reply_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(thread, { status: 201 })
  } catch (err) {
    console.error('[API forum/threads POST]', err)
    return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 })
  }
}
