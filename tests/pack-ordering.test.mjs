import test from 'node:test'
import assert from 'node:assert/strict'
import { orderArchivePacks, pickHomePacks } from '../lib/pack-ordering.ts'

const packs = ['a', 'etsy-4330541166', 'b', 'c', 'd', 'e', 'f', 'g'].map(sku => ({ sku }))

test('Archives shuffles all non-Osho packs but pins Osho last without losing or duplicating packs', () => {
  const first = orderArchivePacks(packs, () => 0)
  const second = orderArchivePacks(packs, () => 0.999)
  for (const order of [first, second]) {
    assert.equal(order.at(-1).sku, 'etsy-4330541166')
    assert.deepEqual(order.map(p => p.sku).sort(), packs.map(p => p.sku).sort())
  }
  assert.notDeepEqual(first.map(p => p.sku), second.map(p => p.sku))
  assert.deepEqual(packs.map(p => p.sku), ['a', 'etsy-4330541166', 'b', 'c', 'd', 'e', 'f', 'g'])
})

test('Homepage shows six distinct packs and varies the selection on a new visit', () => {
  const first = pickHomePacks(packs, 6, () => 0)
  const second = pickHomePacks(packs, 6, () => 0.999)
  assert.equal(first.length, 6)
  assert.equal(new Set(first.map(p => p.sku)).size, 6)
  assert.equal(second.length, 6)
  assert.notDeepEqual(first.map(p => p.sku), second.map(p => p.sku))
})
