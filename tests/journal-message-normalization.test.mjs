import test from 'node:test'
import assert from 'node:assert/strict'
import * as sessionState from '../lib/oracle-session-state.ts'

test('journal messages preserve assistant answers and chronological order', () => {
  const normalize = sessionState.normalizeJournalMessages
  assert.equal(typeof normalize, 'function', 'journal message normalizer must exist')

  const rows = [
    { id: 'a2', role: 'assistant', content: 'Second answer', created_at: '2026-09-24T10:02:00Z' },
    { id: 'u1', role: 'user', content: 'First question', created_at: '2026-09-24T10:00:00Z' },
    { id: 'u2', role: 'user', content: 'Second question', created_at: '2026-09-24T10:01:00Z' },
    { id: 'a1', role: 'assistant', content: 'First answer', created_at: '2026-09-24T10:00:30Z' },
  ]

  assert.deepEqual(normalize(rows).map(({ id, role, content }) => ({ id, role, content })), [
    { id: 'u1', role: 'user', content: 'First question' },
    { id: 'a1', role: 'assistant', content: 'First answer' },
    { id: 'u2', role: 'user', content: 'Second question' },
    { id: 'a2', role: 'assistant', content: 'Second answer' },
  ])
})

test('journal renderer does not treat system notices or later questions as an answer', () => {
  assert.equal(typeof sessionState.getJournalAnswer, 'function', 'journal answer pairing helper must exist')
  const messages = sessionState.normalizeJournalMessages([
    { id: 'q1', role: 'user', content: 'Question with an error', created_at: '2026-09-24T10:00:00Z' },
    { id: 's1', role: 'system', content: 'Request failed', created_at: '2026-09-24T10:00:01Z' },
    { id: 'q2', role: 'user', content: 'Question with a reply', created_at: '2026-09-24T10:01:00Z' },
    { id: 'a2', role: 'assistant', content: 'Actual answer', created_at: '2026-09-24T10:01:01Z' },
    { id: 'q3', role: 'user', content: 'Unanswered question', created_at: '2026-09-24T10:02:00Z' },
  ])
  assert.equal(sessionState.getJournalAnswer(messages, 0), null)
  assert.equal(sessionState.getJournalAnswer(messages, 2)?.content, 'Actual answer')
  assert.equal(sessionState.getJournalAnswer(messages, 4), null)
})

test('journal resume URL carries saved tradition and mode', () => {
  const buildUrl = sessionState.buildConversationResumeUrl
  assert.equal(typeof buildUrl, 'function', 'conversation resume URL builder must exist')

  const url = new URL(buildUrl({ id: 'conv-123', tradition: 'entheogen', mode: 'scholar' }), 'https://example.test')
  assert.equal(url.pathname, '/chat')
  assert.equal(url.searchParams.get('conversation'), 'conv-123')
  assert.equal(url.searchParams.get('tradition'), 'entheogen')
  assert.equal(url.searchParams.get('mode'), 'scholar')
})
