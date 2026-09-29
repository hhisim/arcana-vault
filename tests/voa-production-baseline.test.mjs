import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const text = p => readFileSync(resolve(root, p), 'utf8')
const hash = p => createHash('sha256').update(readFileSync(resolve(root, p))).digest('hex')

test('accepted VOA release routes and article remain in source', () => {
  for (const p of [
    'app/updates/page.tsx',
    'app/correspondence-engine/page.tsx',
    'app/correspondence-engine/classic/page.tsx',
    'components/correspondence/CorrespondenceCodexV2.tsx',
    'content/blog/red-book-active-imagination-ethics-image.mdx',
    'content/blog/the-shape-before-the-world.mdx',
  ]) assert.ok(existsSync(resolve(root, p)), `Missing accepted live source: ${p}`)
  assert.match(text('app/sitemap.ts'), /\/updates/)
  assert.match(text('lib/posts.ts'), /red-book-active-imagination-ethics-image/)
  assert.match(text('lib/posts.ts'), /the-shape-before-the-world/)
})

test('accepted Red Book hero and thumbnail are byte-for-byte in source', () => {
  assert.equal(hash('public/images/blog/red-book-active-imagination/hero-wide.png'), '3f812d952dd7c60a45165ebdfca840c066b3fc16a8792ebc1d59c23f3297aea4')
  assert.equal(hash('public/images/blog/red-book-active-imagination/thumbnail.png'), '59ec578e0c50cb4cfb783fd543f0d8d03e1d18ba21c829cd07ab123d1d7d550f')
})
