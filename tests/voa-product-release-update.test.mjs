import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const updates = JSON.parse(readFileSync(new URL('../lib/updates.json', import.meta.url), 'utf8'))

test('public Updates records the verified twelve-archive production release', () => {
  const update = updates.find((entry) => entry.id === 'voa-12-archive-additions-2026-09-25')
  assert.ok(update, 'expected a public Updates entry for the 12 archive additions')
  assert.equal(update.status, 'shipped')
  assert.equal(update.sourceCommit, '12f5ee0fdd7b8f6bbf36eb1c20823d37cdfe4e54')
  assert.equal(update.publishedAt, '2026-09-25T19:46:20Z')
  assert.match(update.title, /twelve/i)
  assert.match(update.details[1], /existing one-time Stripe Checkout endpoint/)
  assert.doesNotMatch(update.details[1], /no duplicate Stripe products/i)
  assert.match(update.verification, /12\/12/)
  assert.match(update.verification, /71\/71/)
})
