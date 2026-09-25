import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { filterCodexEntries, pickDailyEntry, detailUrl } from '../lib/correspondence-v2.ts'

const index = JSON.parse(fs.readFileSync(new URL('../public/data/correspondence-v2/index.json', import.meta.url), 'utf8'))

test('filters the real 824-row index by source, field, and label without loading detail files', () => {
  assert.equal(index.entries.length, 824)
  assert.equal(filterCodexEntries(index, { system: 'CHAKRAS' }).length, 7)
  assert.ok(filterCodexEntries(index, { field: 'CHAKRAS' }).length >= 800)
  assert.ok(filterCodexEntries(index, { query: 'Christos' }).length > 0)
  assert.deepEqual(filterCodexEntries(index, { system: 'NOT_A_SYSTEM' }), [])
})

test('daily selection is stable and safe for an empty result set', () => {
  assert.equal(pickDailyEntry([], '2026-09-24'), undefined)
  assert.deepEqual(pickDailyEntry(index.entries, '2026-09-24'), pickDailyEntry(index.entries, '2026-09-24'))
})

test('detail URL accepts only generated row IDs', () => {
  const url = detailUrl(index.entries[0].id)
  assert.ok(url.startsWith('/data/correspondence-v2/details/'))
  assert.throws(() => detailUrl('../.env'))
})
