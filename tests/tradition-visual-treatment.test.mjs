import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(new URL('..', import.meta.url).pathname)
const pageSource = readFileSync(resolve(root, 'app/traditions/page.tsx'), 'utf8')
const stylesSource = readFileSync(resolve(root, 'app/globals.css'), 'utf8')

const liveSlugs = ['tao', 'tarot', 'tantra', 'entheogens', 'sufi', 'dreamwalker', 'chaos-magick', 'kabbalah']

test('each live tradition has a real, repository-hosted low-bandwidth visual', () => {
  const artPath = resolve(root, 'lib/tradition-art.ts')
  assert.ok(existsSync(artPath), 'tradition art manifest must exist')
  const artSource = readFileSync(artPath, 'utf8')

  for (const slug of liveSlugs) {
    assert.match(artSource, new RegExp(`(?:['"])?${slug}(?:['"])?\\s*:`), `${slug} needs an art entry`)
  }

  const assetPaths = [...artSource.matchAll(/src:\s*['"]([^'"]+)['"]/g)].map((match) => match[1])
  assert.equal(assetPaths.length, liveSlugs.length, 'the live visual manifest should stay one-to-one with live traditions')
  for (const assetPath of assetPaths) {
    assert.ok(assetPath.startsWith('/images/'), `${assetPath} should use a public image asset`)
    assert.ok(existsSync(resolve(root, 'public', assetPath.slice(1))), `${assetPath} must exist in public/`)
  }
})

test('tradition visuals are lazy, decorative, and keyboard-revealed rather than hover-only', () => {
  assert.match(pageSource, /tradition-card/, 'live cards need the shared interaction hook')
  assert.match(pageSource, /loading="lazy"/, 'card visuals must be lazy-loaded')
  assert.match(pageSource, /decoding="async"/, 'card visuals must decode off the critical path')
  assert.match(pageSource, /aria-hidden="true"/, 'decorative artwork must not be announced twice')
  assert.match(stylesSource, /\.tradition-card:focus-visible/, 'keyboard focus must reveal the visual treatment')
  assert.match(stylesSource, /\.tradition-card__visual[^\n]*opacity/, 'visuals need a quiet default state')
  assert.match(stylesSource, /\.tradition-card:hover \.tradition-card__visual/, 'pointer hover should enhance the visual')
})

test('motion and touch alternatives are explicitly defined', () => {
  assert.match(stylesSource, /@media \(prefers-reduced-motion: reduce\)/, 'reduced motion must be handled')
  assert.match(stylesSource, /\.tradition-card__visual[^}]*transition:\s*none/, 'reduced motion must remove visual transitions')
  assert.match(stylesSource, /@media \((?:hover: none)|(?:max-width: 767px)\)/, 'touch/mobile behavior must not depend on hover')
  assert.match(stylesSource, /\.tradition-card__visual[^}]*opacity:\s*0\.[45]/, 'touch/mobile cards need a visible static visual')
})
