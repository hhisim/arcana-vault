import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const route = readFileSync(new URL('../app/api/oracle/ask/route.ts', import.meta.url), 'utf8')
const portal = readFileSync(new URL('../app/components/OraclePortal.tsx', import.meta.url), 'utf8')

test('entitled Oracle requests use the backend stream without limiting answer length', () => {
  assert.match(route, /\/ask\/stream/)
  assert.match(route, /x-voa-oracle-proxy-secret/)
  assert.match(route, /useStream = wantsStream && Boolean\(streamSecret\)/)
  assert.match(route, /upstream\.body/)
  assert.doesNotMatch(route, /max_tokens\s*:/)
})

test('Oracle page consumes incremental SSE text and still saves the completed answer', () => {
  assert.match(portal, /readOracleSseAnswer\(/)
  assert.match(portal, /saveMessage\('assistant',\s*data\.answer\)/)
})
