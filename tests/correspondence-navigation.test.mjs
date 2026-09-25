import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { findMappedEntry, codexSystemHref, codexEntryHref, codexFocusHref, visualForMapping, classicOnlyEntries, classicEntryHref } from '../lib/correspondence-v2.ts'

const index = JSON.parse(fs.readFileSync(new URL('../public/data/correspondence-v2/index.json', import.meta.url)))
const calcination = JSON.parse(fs.readFileSync(new URL('../public/data/correspondence-v2/details/calcination--alchemy--r3.json', import.meta.url)))
const mapping = key => calcination.mappings.find(item => item.key === key)

test('system cards link to real filtered Codex systems, not nonexistent external routes', () => {
  assert.equal(codexSystemHref(index, 'COLORS'), '/correspondence-engine?system=COLORS')
  assert.equal(codexSystemHref(index, 'CHAKRAS'), '/correspondence-engine?system=CHAKRAS')
  assert.equal(codexSystemHref(index, 'NO_SUCH_SYSTEM'), null)
})

test('value links resolve the actual target source row rather than the current row', () => {
  for (const [key, value] of [['COLORS','Red'], ['ELEMENTS','Fire'], ['CHAKRAS','SOLAR-PLEXUS-MANIPURA'], ['GEOMETRY','Triangle'], ['PLATONIC_SOLIDS','Tetrahedron']]) {
    const target = findMappedEntry(index, key, mapping(key).values.find(item => item.label === value).label)
    assert.ok(target, `${key}: ${value}`)
    assert.equal(target.sourceSystem, key)
    assert.equal(codexEntryHref(target), `/correspondence-engine?system=${key}&entry=${encodeURIComponent(target.id)}`)
  }
  const deity = findMappedEntry(index, 'DEITIES', 'Ares', ['Greek'])
  assert.equal(deity?.label, 'Ares [Greek]')
  assert.equal(findMappedEntry(index, 'ALCHEMY', '1. Calcination')?.label, 'Calcination')
  assert.equal(findMappedEntry(index, 'CHAKRAS', 'not in source'), null)
  assert.equal(findMappedEntry(index, 'NUMBERS', '14'), null)
  assert.equal(codexFocusHref(calcination.id, 'NUMBERS', '14'), `/correspondence-engine?entry=${calcination.id}&focusSystem=NUMBERS&focusValue=14`)
})

test('visual cues use explicit curated values, not invented source color claims', () => {
  assert.equal(visualForMapping('COLORS', 'Red').color, '#c84d52')
  assert.equal(visualForMapping('CHAKRAS', 'SOLAR-PLEXUS-MANIPURA').color, '#e7bd4e')
  assert.equal(visualForMapping('GEOMETRY', 'Triangle').symbol, 'triangle')
  assert.equal(visualForMapping('PLATONIC_SOLIDS', 'Tetrahedron').symbol, 'tetrahedron')
  assert.equal(visualForMapping('COLORS', 'Unknown shade').color, undefined)
})

test('the UI renders separate accessible card links and value links with distinct destinations', () => {
  const component = fs.readFileSync(new URL('../components/correspondence/CorrespondenceCodexV2.tsx', import.meta.url), 'utf8')
  assert.match(component, /codexSystemHref\(index, mapping\.key\)/)
  assert.match(component, /findMappedEntry\(index, mapping\.key, value\.label, value\.traditions\)/)
  assert.match(component, /codexEntryHref\(target\)/)
  assert.match(component, /<GeometryGlyph /)
  assert.match(component, /setSystem\(requestedSystem\)/)
})

test('classic-only discoveries preserve their original catalog and deep-link', () => {
  const classic = JSON.parse(fs.readFileSync(new URL('../public/data/correspondence/index.json', import.meta.url)))
  const extras = classicOnlyEntries(index, classic.entries)
  assert.equal(extras.length, 205)
  assert.equal(extras.some(e => e.slug === 'aphrodite'), false)
  assert.ok(extras.some(e => e.slug === 'fire-agate'))
  assert.ok(extras.some(e => e.slug === 'hephaestus'))
  assert.equal(extras.some(e => e.slug === 'venus'), false)
  assert.equal(classicEntryHref('fire-agate'), '/correspondence-engine/classic?entry=fire-agate')
})
