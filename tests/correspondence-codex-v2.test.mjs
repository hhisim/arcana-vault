import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  buildCodexArtifacts,
  normalizeCell,
  parseSupermatrixCsv,
} from '../scripts/generate-correspondence-codex-v2.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const sourcePath = path.join(here, '..', 'data', 'correspondence', 'supermatrix-v3.csv')

test('parses the decorative title row and RFC-4180 quoted cells', () => {
  const parsed = parseSupermatrixCsv(
    'COR CODEX — Super Matrix (test),\n\nSOURCE_SYSTEM,ENTRY,NOTES\nALCHEMY,"A, B","quoted ""value""; second"\n',
    { sourceFile: 'fixture.csv' },
  )

  assert.deepEqual(parsed.headers, ['SOURCE_SYSTEM', 'ENTRY', 'NOTES'])
  assert.equal(parsed.decorativeRows, 2)
  assert.equal(parsed.rows.length, 1)
  assert.equal(parsed.rows[0].sourceRow, 4)
  assert.equal(parsed.rows[0].values.ENTRY, 'A, B')
  assert.equal(parsed.rows[0].values.NOTES, 'quoted "value"; second')
})

test('normalizes semicolon lists without splitting nested annotations', () => {
  const normalized = normalizeCell(
    'Agni [Hindu]; Ares [Greek]; Pride (Arrogance, Hubris, Vanity)',
  )

  assert.deepEqual(normalized.values.map((value) => value.raw), [
    'Agni [Hindu]',
    'Ares [Greek]',
    'Pride (Arrogance, Hubris, Vanity)',
  ])
  assert.deepEqual(normalized.values[0].traditions, ['Hindu'])
  assert.equal(normalized.values[0].label, 'Agni')
  assert.deepEqual(normalized.values[2].traditions, [])
  assert.equal(normalized.raw, 'Agni [Hindu]; Ares [Greek]; Pride (Arrogance, Hubris, Vanity)')
})

test('keeps duplicate source assertions as separate provenance-bearing entries', () => {
  const csvText = fs.readFileSync(sourcePath, 'utf8')
  const parsed = parseSupermatrixCsv(csvText, { sourceFile: 'supermatrix-v3.csv' })
  const artifacts = buildCodexArtifacts(parsed, {
    sourceFile: 'supermatrix-v3.csv',
    sourceSha256: 'test-sha256',
  })

  assert.equal(parsed.rows.length, 824)
  assert.equal(artifacts.index.stats.entryCount, 824)
  assert.equal(artifacts.index.stats.uniqueRawEntryLabelCount, 810)
  assert.equal(artifacts.index.stats.uniqueEntryLabelCount, 803)
  assert.equal(artifacts.index.stats.ambiguousEntryLabelCount, 16)
  assert.equal(artifacts.details.length, 824)

  const duplicate = artifacts.details.find(
    (detail) => detail.source.sourceRow === 140,
  )
  assert.ok(duplicate)
  assert.equal(duplicate.source.sourceFile, 'supermatrix-v3.csv')
  assert.equal(duplicate.source.sourceSha256, 'test-sha256')
  assert.equal(duplicate.source.rawEntry, 'Christos [Other]')
  assert.ok(duplicate.conflicts.some((conflict) => conflict.sourceRow === 141))
  assert.ok(duplicate.mappings.some((mapping) => mapping.key === 'DEITIES'))
  assert.ok(duplicate.mappings.find((mapping) => mapping.key === 'DEITIES').values[0].traditions.includes('Other'))
})

test('produces an index small enough to load before any detail chunk', () => {
  const csvText = fs.readFileSync(sourcePath, 'utf8')
  const artifacts = buildCodexArtifacts(
    parseSupermatrixCsv(csvText, { sourceFile: 'supermatrix-v3.csv' }),
    { sourceFile: 'supermatrix-v3.csv', sourceSha256: 'test-sha256' },
  )
  const indexBytes = Buffer.byteLength(JSON.stringify(artifacts.index))

  assert.ok(indexBytes < 350_000, `index was ${indexBytes} bytes`)
  assert.ok(artifacts.index.facets.sourceSystems.length >= 20)
  assert.ok(artifacts.index.facets.traditions.some((facet) => facet.value === 'Hindu'))
})
