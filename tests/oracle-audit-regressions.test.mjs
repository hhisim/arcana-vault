import test from 'node:test'
import assert from 'node:assert/strict'
import { ORACLE_CONFIG } from '../lib/oracle-ui.ts'
const sessionState = await import('../lib/oracle-session-state.ts').catch(() => ({}))
const cookieBatch = await import('../lib/supabase-cookie-batch.ts').catch(() => ({}))

test('daily deep link selects its tradition, mode, and conversation', () => {
  assert.equal(typeof sessionState.resolveOracleRouteState, 'function', 'route-state resolver is not implemented')
  assert.deepEqual(sessionState.resolveOracleRouteState('?tradition=entheogen&mode=guide&conversation=conv-7', ORACLE_CONFIG), { pack: 'entheogen', mode: 'guide', conversationId: 'conv-7' })
})

test('unknown route values fall back to the safe default', () => {
  assert.deepEqual(sessionState.resolveOracleRouteState('?tradition=invalid&mode=invalid', ORACLE_CONFIG), { pack: 'tao', mode: 'oracle', conversationId: null })
})

test('Oracle requests explicitly carry tradition, mode, and answer language', () => {
  assert.deepEqual(sessionState.buildOracleAskPayload('question', 'sufi', 'quote', 'en'), { q: 'question', pack: 'sufi', tradition: 'sufi', mode: 'quote', target_lang: 'en' })
})

test('restored messages are newest-first and retain the assistant reply', () => {
  const restored = sessionState.normalizeConversationMessages([
    { id: 'q', role: 'user', content: 'Question', created_at: '2026-09-24T10:00:00Z' },
    { id: 'a', role: 'assistant', content: 'Answer', created_at: '2026-09-24T10:00:01Z' },
  ], 'entheogen', 'guide')
  assert.deepEqual(restored.map(({ id, role, text, pack, mode }) => ({ id, role, text, pack, mode })), [
    { id: 'a', role: 'oracle', text: 'Answer', pack: 'entheogen', mode: 'guide' },
    { id: 'q', role: 'user', text: 'Question', pack: 'entheogen', mode: 'guide' },
  ])
})

test('restored conversation context is recovered from the latest completed Q&A', () => {
  assert.equal(typeof sessionState.restoreConversationContext, 'function', 'conversation context restoration is not implemented')
  const restored = sessionState.normalizeConversationMessages([
    { id: 'q1', role: 'user', content: 'First question', created_at: '2026-09-24T10:00:00Z' },
    { id: 'a1', role: 'assistant', content: 'First answer', created_at: '2026-09-24T10:00:01Z' },
    { id: 'q2', role: 'user', content: 'Latest question', created_at: '2026-09-24T10:01:00Z' },
    { id: 'a2', role: 'assistant', content: 'Latest answer', created_at: '2026-09-24T10:01:01Z' },
  ], 'tao', 'seeker')
  assert.deepEqual(sessionState.restoreConversationContext(restored), {
    tao: { userVisible: 'Latest question', prompt: 'Latest question', answer: 'Latest answer' },
  })
})

test('message persistence surfaces non-2xx responses', async () => {
  await assert.rejects(sessionState.ensureMessagePersisted(new Response('unauthorized', { status: 401 })), /401/)
})

test('context switching is blocked while an Oracle answer is in flight', () => {
  assert.equal(typeof sessionState.canChangeOracleContext, 'function', 'context-switch guard is not implemented')
  assert.equal(sessionState.canChangeOracleContext(true), false)
  assert.equal(sessionState.canChangeOracleContext(false), true)
})

test('every tradition exposes Seeker, Scholar, and Quote modes', () => {
  for (const [tradition, config] of Object.entries(ORACLE_CONFIG)) {
    const modes = new Set(config.modes.map((item) => item.value))
    for (const mode of ['seeker', 'scholar', 'quote']) assert.ok(modes.has(mode), `${tradition} is missing the ${mode} mode`)
  }
})

test('Supabase cookie batches retain every cookie on one response', () => {
  assert.equal(typeof cookieBatch.applySupabaseCookieBatch, 'function', 'cookie batch helper is not implemented')
  const requestValues = new Map()
  const request = { cookies: { set: (name, value) => requestValues.set(name, value) } }
  let responsesCreated = 0
  const makeResponse = () => {
    responsesCreated += 1
    const values = new Map()
    return { cookies: { values, set: (name, value, options) => values.set(name, { value, options }) } }
  }
  const response = cookieBatch.applySupabaseCookieBatch(request, makeResponse, [
    { name: 'auth.0', value: 'a', options: { httpOnly: true } },
    { name: 'auth.1', value: 'b', options: { httpOnly: true } },
  ])
  assert.equal(responsesCreated, 1)
  assert.equal(requestValues.size, 2)
  assert.equal(response.cookies.values.size, 2)
  assert.deepEqual(response.cookies.values.get('auth.0'), { value: 'a', options: { httpOnly: true } })
})
