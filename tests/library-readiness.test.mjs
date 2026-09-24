import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import * as plans from '../lib/plans.ts'

const source = readFileSync(new URL('../app/library/page.tsx', import.meta.url), 'utf8')

test('Adept+ library access matches Adept and Magister entitlements', () => {
  const canAccess = plans.canAccessLibraryBook
  assert.equal(typeof canAccess, 'function', 'library access policy must be centralized')
  assert.equal(canAccess('Free', 'guest'), true)
  assert.equal(canAccess('Adept+', 'adept'), true)
  assert.equal(canAccess('Adept+', 'full'), true)
  assert.equal(canAccess('Adept+', 'seeker'), false)
  assert.equal(canAccess('Adept+', 'free'), false)
})

test('Dream book title points to the matching Archive.org item', () => {
  const dreamEntry = source.split(String.fromCharCode(10)).find((line) => line.includes("id: 'exploring'"))
  assert.ok(dreamEntry, 'Dream catalog entry must exist')
  assert.match(dreamEntry, /url: 'stephan_laberge_-_exploring_the_world_of_lucid_dreaming'/)
})

test('Osho title points to the verified matching Archive.org item', () => {
  const oshoEntry = source.split('\n').find((line) => line.includes("id: 'osho'"))
  assert.ok(oshoEntry, 'Osho catalog entry must exist')
  assert.match(oshoEntry, /url: 'tantra-the-supreme-understanding-1'/)
})
