import { NextRequest, NextResponse } from 'next/server'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { createConversation, getUserConversations } from '@/lib/supabase/conversations'

export async function GET(request: NextRequest) {
  const supabase = getAdminSupabase()

  // Get authenticated user from session cookie
  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const tradition = searchParams.get('tradition') ?? undefined

  try {
    const conversations = await getUserConversations(user.id, tradition)
    return NextResponse.json(conversations)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = getAdminSupabase()

  // Get authenticated user from session cookie
  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { tradition?: string; mode?: string; title?: string; summary?: string; daily_type?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { tradition, mode, title, summary, daily_type } = body
  if (!tradition || !mode) {
    return NextResponse.json({ error: 'tradition and mode are required' }, { status: 400 })
  }

  try {
    const conversation = await createConversation(user.id, tradition, mode, { title, summary, daily_type })
    return NextResponse.json(conversation, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
