import { NextRequest, NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { addMessage, getConversationWithMessages, updateConversation } from '@/lib/supabase/conversations'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, context: RouteContext) {
  const supabase = getAdminSupabase()

  // Get authenticated user from session cookie
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
    return NextResponse.json(result.messages)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const supabase = getAdminSupabase()

  // Get authenticated user from session cookie
  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await context.params

  // Verify user owns this conversation
  let currentMessageCount = 0
  try {
    const result = await getConversationWithMessages(id)
    if (!result || result.conversation.user_id !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    currentMessageCount = result.messages.length
  } catch {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
  }

  let body: { role?: string; content?: string; metadata?: Record<string, unknown> }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { role, content, metadata } = body
  if (!role || !content) {
    return NextResponse.json({ error: 'role and content are required' }, { status: 400 })
  }

  if (!['user', 'assistant', 'system'].includes(role)) {
    return NextResponse.json({ error: 'role must be user, assistant, or system' }, { status: 400 })
  }

  try {
    const message = await addMessage(id, role as 'user' | 'assistant' | 'system', content, metadata)

    // Update conversation's last_message_at and message_count
    await updateConversation(id, {
      last_message_at: new Date().toISOString(),
      message_count: currentMessageCount + 1,
    })

    return NextResponse.json(message, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
