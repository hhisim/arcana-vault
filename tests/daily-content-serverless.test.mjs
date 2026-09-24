import test from 'node:test'
import assert from 'node:assert/strict'
import * as dailyContent from '../lib/daily-content.ts'

test('read-only persistence does not discard generated daily practice', async () => {
  assert.equal(typeof dailyContent.persistDailyContentSafely, 'function', 'safe persistence fallback is missing')
  const content = {
    date: '2026-09-24',
    entries: {
      tao: { title: 'Tao', teaser: 'T', fullText: 'Tao practice', tradition: 'tao', generated: '2026-09-24T00:00:00.000Z' },
      tarot: { title: 'Tarot', teaser: 'T', fullText: 'Tarot practice', tradition: 'tarot', generated: '2026-09-24T00:00:00.000Z' },
      tantra: { title: 'Tantra', teaser: 'T', fullText: 'Tantra practice', tradition: 'tantra', generated: '2026-09-24T00:00:00.000Z' },
      entheogen: { title: 'Entheogen', teaser: 'T', fullText: 'Entheogen practice', tradition: 'entheogen', generated: '2026-09-24T00:00:00.000Z' },
    },
  }
  const result = await dailyContent.persistDailyContentSafely({}, content, async () => {
    throw Object.assign(new Error('read-only filesystem'), { code: 'EROFS' })
  })
  assert.deepEqual(result, content)
})

test('daily content generation never calls a removed provider', async () => {
  const originalKey = process.env.MINIMAX_API_KEY
  const originalFetch = globalThis.fetch
  let calls = 0
  process.env.MINIMAX_API_KEY = 'test-only-invalid-key'
  globalThis.fetch = async () => {
    calls += 1
    throw new Error('external provider must not be called')
  }
  try {
    for (const tradition of ['tao', 'tarot', 'tantra', 'entheogen']) {
      const entry = await dailyContent.generateForTradition(tradition, '2026-09-24')
      assert.equal(entry.tradition, tradition)
      assert.ok(entry.fullText)
    }
    assert.equal(calls, 0)
  } finally {
    globalThis.fetch = originalFetch
    if (originalKey === undefined) delete process.env.MINIMAX_API_KEY
    else process.env.MINIMAX_API_KEY = originalKey
  }
})
