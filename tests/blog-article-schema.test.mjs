import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const page = readFileSync(new URL('../app/blog/[slug]/page.tsx', import.meta.url), 'utf8')

test('registered blog posts emit Article schema without an essayMeta override', () => {
  assert.match(page, /const jsonLd = post \? \{/)
  assert.match(page, /description: meta\?\.description \|\| post\.excerpt/)
  assert.match(page, /keywords: meta\?\.keywords\.join\(', '\)/)
})
