import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const updatesPath = fileURLToPath(new URL('../lib/updates.json', import.meta.url))
const updates = JSON.parse(readFileSync(updatesPath, 'utf8'))

const RELEASE_SHA = '0aaec29ae20896b3f0172143a920354c9abad280'
const RELEASED_AT = '2026-09-24T20:05:43Z'

function assertUtcTimestamp(value) {
  assert.match(value, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)
  assert.equal(new Date(value).toISOString().replace('.000Z', 'Z'), value)
}

test('public updates expose a descending, verifiable UTC timeline', () => {
  assert.ok(Array.isArray(updates))
  assert.ok(updates.length >= 5)

  for (let index = 0; index < updates.length; index += 1) {
    const update = updates[index]
    assert.ok(update.id)
    assertUtcTimestamp(update.publishedAt)
    assert.ok(update.sourceCommit === '' || /^[0-9a-f]{40}$/.test(update.sourceCommit))
    assert.ok(update.title)
    assert.ok(update.summary)
    assert.ok(update.details.length > 0)
    assert.ok(['shipped', 'in-verification'].includes(update.status))
    if (index > 0) {
      assert.ok(Date.parse(updates[index - 1].publishedAt) > Date.parse(update.publishedAt))
    }
  }
})

test('the September website release is tied to its shipped commit and timestamp', () => {
  const release = updates.find((entry) => entry.id === 'release-2026-09-24')
  assert.ok(release)
  assert.equal(release.sourceCommit, RELEASE_SHA)
  assert.equal(release.publishedAt, RELEASED_AT)
  assert.match(release.verification, /35\/35/)
  assert.match(release.verification, /195/)
})

test('the latest Dreamwalker update is limited to the verified backend behavior', () => {
  assert.equal(updates[0].id, 'dreamwalker-remote-viewing-2026-09-24')
  assert.match(updates[0].verification, /live Dreamwalker API/)
  assert.match(updates[0].details.join(' '), /browser journeys are still under review/)
})

test('public copy does not claim unverified member success or external notification delivery', () => {
  const copy = JSON.stringify(updates).toLowerCase()
  assert.doesNotMatch(copy, /telegram.{0,30}(sent|delivered)/)
  assert.doesNotMatch(copy, /(member|magister).{0,30}(flow|journey).{0,30}(passed|working|verified)/)
  assert.match(copy, /under verification/)
})
