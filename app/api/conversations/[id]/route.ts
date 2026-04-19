import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase/server'
import { getConversationWithMessages, updateConversation } from '@/lib/supabase/conversations'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, context: RouteContext) {
  const supabase = await getServerSupabase()

  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await context.params

  try {
    const result = await getConversationWithMessages(id)
    if (!result || result.conversation.user_id !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
  } catch {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Only allow updating certain fields
  const allowed = ['title', 'summary', 'is_starred', 'is_archived', 'last_message_at', 'message_count', 'metadata']
  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) updates[key] = (body as Record<string, unknown>)[key]
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No allowed fields to update' }, { status: 400 })
  }

  try {
    await updateConversation(id, updates)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
