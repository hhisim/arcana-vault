import type { ChatMessage, OracleMode, OraclePack } from './oracle-ui'

export type OracleRouteConfig = Record<string, {
  defaultMode: string
  modes: Array<{ value: string }>
}>

export type OracleRouteState = {
  pack: string
  mode: string
  conversationId: string | null
}

export function resolveOracleRouteState(search: string, config: OracleRouteConfig): OracleRouteState {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const requested = params.get('tradition') || params.get('pack') || ''
  const aliases: Record<string, string> = { sufism: 'sufi', dream: 'dreamwalker' }
  const candidate = aliases[requested] || requested
  const pack = Object.prototype.hasOwnProperty.call(config, candidate) ? candidate : 'tao'
  const packConfig = config[pack] ?? config[Object.keys(config)[0]]
  const requestedMode = params.get('mode') || ''
  const mode = packConfig?.modes.some((item) => item.value === requestedMode)
    ? requestedMode
    : (packConfig?.defaultMode || 'oracle')

  return { pack, mode, conversationId: params.get('conversation') || null }
}

export function buildOracleAskPayload(q: string, pack: string, mode: string, lang: string) {
  return { q, pack, tradition: pack, mode, target_lang: lang }
}

export type PersistedOracleMessage = {
  id?: string | number
  role?: string
  content?: string | null
  text?: string | null
  created_at?: string | null
  mode?: string | null
  pack?: string | null
  tradition?: string | null
  metadata?: Record<string, unknown> | null
}

const SUPPORTED_PACKS: readonly OraclePack[] = ['tao', 'tarot', 'tantra', 'entheogen', 'sufi', 'dreamwalker', 'kabbalah', 'chaos-magick']

export function normalizeConversationMessages(input: unknown, fallbackPack: OraclePack, fallbackMode: OracleMode): ChatMessage[] {
  if (!Array.isArray(input)) return []

  return input
    .map((item, index) => ({ item: item as PersistedOracleMessage, index }))
    .filter(({ item }) => ['user', 'assistant', 'system'].includes(String(item.role)))
    .sort((a, b) => {
      const ta = Date.parse(a.item.created_at || '')
      const tb = Date.parse(b.item.created_at || '')
      if (Number.isFinite(ta) && Number.isFinite(tb) && ta !== tb) return tb - ta
      return b.index - a.index
    })
    .map(({ item }, index) => {
      const metadata = item.metadata ?? {}
      const requestedPack = String(item.pack || item.tradition || metadata.pack || metadata.tradition || '')
      const pack = SUPPORTED_PACKS.includes(requestedPack as OraclePack) ? requestedPack as OraclePack : fallbackPack
      const mode = String(item.mode || metadata.mode || fallbackMode) as OracleMode
      return {
        id: String(item.id ?? `restored-${index}`),
        role: (item.role === 'assistant' ? 'oracle' : item.role) as ChatMessage['role'],
        text: String(item.content ?? item.text ?? ''),
        pack,
        mode,
        audioUrl: typeof metadata.audioUrl === 'string' ? metadata.audioUrl : null,
      }
    })
}

export type RestoredOracleContext = Partial<Record<OraclePack, { userVisible: string; prompt: string; answer: string }>>

/** Recover the latest completed question/answer pair per tradition from newest-first messages. */
export function restoreConversationContext(messages: ChatMessage[]): RestoredOracleContext {
  const pendingQuestions = new Map<OraclePack, ChatMessage>()
  const context: RestoredOracleContext = {}

  for (const message of [...messages].reverse()) {
    const pack = message.pack
    if (!pack || !SUPPORTED_PACKS.includes(pack)) continue
    if (message.role === 'user') {
      pendingQuestions.set(pack, message)
    } else if (message.role === 'oracle') {
      const question = pendingQuestions.get(pack)
      if (!question) continue
      context[pack] = {
        userVisible: question.text,
        prompt: question.text,
        answer: message.text,
      }
      pendingQuestions.delete(pack)
    }
  }

  return context
}

export type JournalMessage = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string | null
  metadata: Record<string, unknown> | null
}

export function normalizeJournalMessages(input: unknown): JournalMessage[] {
  if (!Array.isArray(input)) return []

  return input
    .map((value, index) => ({ item: value as PersistedOracleMessage, index }))
    .filter(({ item }) => ['user', 'assistant', 'system'].includes(String(item.role)))
    .sort((a, b) => {
      const ta = Date.parse(a.item.created_at || '')
      const tb = Date.parse(b.item.created_at || '')
      if (Number.isFinite(ta) && Number.isFinite(tb) && ta !== tb) return ta - tb
      return a.index - b.index
    })
    .map(({ item, index }) => ({
      id: String(item.id ?? `journal-${index}`),
      role: item.role as JournalMessage['role'],
      content: String(item.content ?? item.text ?? ''),
      created_at: item.created_at ?? null,
      metadata: item.metadata ?? null,
    }))
}

export function getJournalAnswer(messages: JournalMessage[], questionIndex: number): JournalMessage | null {
  const question = messages[questionIndex]
  if (!question || question.role !== 'user') return null
  const next = messages[questionIndex + 1]
  return next?.role === 'assistant' ? next : null
}

export function buildConversationResumeUrl(conversation: { id: string; tradition: string; mode: string | null }): string {
  const params = new URLSearchParams()
  params.set('conversation', conversation.id)
  params.set('tradition', conversation.tradition)
  if (conversation.mode) params.set('mode', conversation.mode)
  return `/chat?${params.toString()}`
}

export function canChangeOracleContext(isBusy: boolean): boolean {
  return !isBusy
}

export function buildMessagePersistencePayload(role: 'user' | 'assistant' | 'system', content: string, pack: string, mode: string) {
  return { role, content, metadata: { pack, mode } }
}

export async function ensureMessagePersisted(response: Response): Promise<void> {
  if (response.ok) return
  throw new Error(`Message persistence failed (HTTP ${response.status})`)
}
