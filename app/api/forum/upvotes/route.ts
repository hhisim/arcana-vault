import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = getServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { post_id, reply_id, type } = body // type: 'upvote' | 'downvote'

    if (!post_id && !reply_id) {
      return NextResponse.json({ error: 'Must specify post_id or reply_id' }, { status: 400 })
    }

    if (post_id) {
      // Check existing
      const { data: existing } = await supabase
        .from('forum_reactions')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', post_id)
        .maybeSingle()

      if (existing) {
        // Toggle: remove if same type, update if different
        const { error } = await supabase
          .from('forum_reactions')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', post_id)
        if (error) throw error
        return NextResponse.json({ action: 'removed' })
      }

      const { data: reaction, error } = await supabase
        .from('forum_reactions')
        .insert({ user_id: user.id, post_id, type: type || 'upvote' })
        .select()
        .single()

      if (error) throw error
      return NextResponse.json(reaction)
    } else if (reply_id) {
      const { data: existing } = await supabase
        .from('forum_reactions')
        .select('id')
        .eq('user_id', user.id)
        .eq('reply_id', reply_id)
        .maybeSingle()

      if (existing) {
        await supabase.from('forum_reactions').delete().eq('user_id', user.id).eq('reply_id', reply_id)
        return NextResponse.json({ action: 'removed' })
      }

      const { data: reaction, error } = await supabase
        .from('forum_reactions')
        .insert({ user_id: user.id, reply_id, type: type || 'upvote' })
        .select()
        .single()

      if (error) throw error
      return NextResponse.json(reaction)
    }
  } catch (err) {
    console.error('[API forum/upvotes POST]', err)
    return NextResponse.json({ error: 'Failed to toggle upvote' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = getServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { post_id, reply_id } = body

    if (post_id) {
      await supabase.from('forum_reactions').delete().eq('user_id', user.id).eq('post_id', post_id)
    } else if (reply_id) {
      await supabase.from('forum_reactions').delete().eq('user_id', user.id).eq('reply_id', reply_id)
    }

    return NextResponse.json({ action: 'removed' })
  } catch (err) {
    console.error('[API forum/upvotes DELETE]', err)
    return NextResponse.json({ error: 'Failed to remove upvote' }, { status: 500 })
  }
}
