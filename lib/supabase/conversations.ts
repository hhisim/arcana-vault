// Helper functions for conversation CRUD operations
// Uses getAdminSupabase() for server-side operations
// Uses getBrowserSupabase() for client-side operations

import { getAdminSupabase } from './admin'
import { getBrowserSupabase } from './client'

export type Conversation = {
  id: string
  user_id: string
  tradition: string
  mode: string
  title: string | null
  summary: string | null
  started_at: string
  last_message_at: string
  message_count: number
  is_starred: boolean
  is_archived: boolean
  daily_type: string | null
  metadata: Record<string, unknown> | null
}

export type Message = {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
  metadata: Record<string, unknown> | null
}

// Server-side: create a new conversation
export async function createConversation(
  userId: string,
  tradition: string,
  mode: string,
  extras?: { title?: string; summary?: string; daily_type?: string; metadata?: Record<string, unknown> }
): Promise<Conversation> {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: userId,
      tradition,
      mode,
      title: extras?.title ?? null,
      summary: extras?.summary ?? null,
      daily_type: extras?.daily_type ?? null,
      metadata: extras?.metadata ?? null,
    })
    .select()
    .single()

  if (error) throw new Error(`createConversation failed: ${error.message}`)
  return data as Conversation
}

// Server-side: add a message to a conversation
export async function addMessage(
  conversationId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  metadata?: Record<string, unknown>
): Promise<Message> {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      role,
      content,
      metadata: metadata ?? null,
    })
    .select()
    .single()

  if (error) throw new Error(`addMessage failed: ${error.message}`)
  return data as Message
}

// Server-side: update conversation (last_message_at, message_count, title, summary, etc.)
export async function updateConversation(
  conversationId: string,
  updates: Partial<Conversation>
): Promise<void> {
  const supabase = getAdminSupabase()
  const { error } = await supabase
    .from('conversations')
    .update(updates)
    .eq('id', conversationId)

  if (error) throw new Error(`updateConversation failed: ${error.message}`)
}

// Server-side: get user's conversations (for history page)
export async function getUserConversations(
  userId: string,
  tradition?: string
): Promise<Conversation[]> {
  const supabase = getAdminSupabase()
  let query = supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', false)
    .order('last_message_at', { ascending: false })

  if (tradition) {
    query = query.eq('tradition', tradition)
  }

  const { data, error } = await query
  if (error) throw new Error(`getUserConversations failed: ${error.message}`)
  return (data as Conversation[]) ?? []
}

// Server-side: get a single conversation with its messages
export async function getConversationWithMessages(
  conversationId: string
): Promise<{ conversation: Conversation; messages: Message[] } | null> {
  const supabase = getAdminSupabase()

  const { data: conv, error: convErr } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single()

  if (convErr) return null

  const { data: msgs, error: msgsErr } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (msgsErr) throw new Error(`getConversationWithMessages failed: ${msgsErr.message}`)

  return {
    conversation: conv as Conversation,
    messages: (msgs as Message[]) ?? [],
  }
}

// Client-side: subscribe to a conversation's messages in real-time
export function subscribeToConversation(
  conversationId: string,
  callback: (msg: Message, type: 'INSERT' | 'UPDATE' | 'DELETE') => void
): () => void {
  const supabase = getBrowserSupabase()

  const channel = supabase
    .channel(`conversation:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        callback(payload.new as Message, payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE')
      }
    )
    .subscribe()

  return () => {
    void supabase.removeChannel(channel)
  }
}
