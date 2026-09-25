import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const page = readFileSync(new URL('../components/correspondence/CorrespondenceCodexV2.tsx', import.meta.url), 'utf8')

test('Codex keeps source metadata out of reader-facing copy', () => {
  assert.doesNotMatch(page, /THE SOURCE LENS|Imported from|sourceSha256|uploaded CSV|uploaded Super Matrix/)
})

test('Codex offers separate atlas and VOA Companion pathways', () => {
  assert.match(page, /href="https:\/\/codexoracle\.org\/"/)
  assert.match(page, /href="https:\/\/vaultofarcana\.com\/shop\/etsy-4513179705"/)
  assert.match(page, /20-page printable Companion/)
})

test('Classic invitation reads like a human introduction without suggesting the old edition was replaced', () => {
  assert.match(page, /Browse profiles from the original edition/)
  assert.match(page, /original filters, summaries, overviews, and detailed pages/)
})
