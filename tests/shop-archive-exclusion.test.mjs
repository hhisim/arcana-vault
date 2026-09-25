import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
const read = name => fs.readFileSync(new URL(`../${name}`, import.meta.url), 'utf8')
const removed = 'etsy-4543166138'

test('removed archive is excluded from the public catalog and direct checkout lookup', () => {
  assert.match(read('lib/shop-exclusions.ts'), /etsy-4543166138/)
  assert.match(read('lib/packs.ts'), /isExcludedShopSku\(p\.sku\)/)
  assert.match(read('lib/shop.ts'), /isExcludedShopSku\(sku\)/)
})

test('removed archive is not recommended from entheogen or hyperbolic geometry essays', () => {
  assert.ok(!read('lib/pack-recs.ts').includes(removed))
})
