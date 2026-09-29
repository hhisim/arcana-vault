import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const enriched = JSON.parse(readFileSync(new URL('../lib/shop-packs-enriched.json', import.meta.url), 'utf8'))
const expected = [
  [4561328273, 37.99, 4],
  [4562868882, 52.99, 4],
  [4561655541, 22.00, 4],
  [4561633018, 27.99, 4],
  [4561586193, 22.99, 4],
  [4561531962, 52.99, 4],
  [4561350260, 27.99, 4],
  [4556298212, 32.99, 10],
  [4546962947, 31.95, 10],
  [4491074798, 9.99, 10],
  [4488448861, 12.99, 9],
  [4334241254, 52.99, 4],
]

test('all 12 owner-authorized Etsy archive editions are in both VOA catalogs and have local page-gallery assets', () => {
  const baseSource = readFileSync(new URL('../lib/shop-catalog.ts', import.meta.url), 'utf8')
  const checkoutSource = readFileSync(new URL('../app/api/shop/checkout/route.ts', import.meta.url), 'utf8')
  assert.match(checkoutSource, /packFromSku\(sku\)/)
  assert.match(checkoutSource, /archivePackSaleUnitAmountCents\(pack\.price\)/)
  assert.match(checkoutSource, /etsy_listing_id: String\(pack\.etsyListingId\)/)
  for (const [listingId, price, imageCount] of expected) {
    const sku = `etsy-${listingId}`
    const rows = enriched.filter((p) => p.etsyListingId === listingId)
    assert.equal(rows.length, 1, `${sku} appears exactly once in enriched catalog`)
    assert.equal(rows[0].sku, sku)
    assert.equal(rows[0].price, price)
    assert.equal(rows[0].images.length, imageCount, `${sku} retains all Etsy gallery images`)
    for (const image of rows[0].images) {
      assert.ok(image.startsWith('/shop/'), `${sku} image is self-hosted: ${image}`)
      assert.ok(existsSync(fileURLToPath(new URL(`../public${image}`, import.meta.url))), `${image} exists`)
    }
    const sourceRows = baseSource.split('\n').filter((line) => line.includes(`etsyListingId: ${listingId},`))
    assert.equal(sourceRows.length, 1, `${sku} appears exactly once in the Stripe source catalog`)
    assert.ok(sourceRows[0].includes(`sku: "${sku}"`))
    const priceMatch = sourceRows[0].match(/price:\s*([\d.]+)/)
    assert.ok(priceMatch, `${sku} has a numeric catalog price`)
    assert.equal(Number(priceMatch[1]), price)
  }
})
