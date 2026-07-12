import assert from 'node:assert/strict'
import test from 'node:test'

process.env.NEXT_PUBLIC_STRIPE_PRICE_SEEKER_MONTHLY_V2 = 'price_runtime_seeker'
process.env.NEXT_PUBLIC_STRIPE_PRICE_ADEPT_MONTHLY = 'price_runtime_adept'
process.env.NEXT_PUBLIC_STRIPE_PRICE_MAGISTER_MONTHLY = 'price_runtime_magister'

const { planFromPriceId } = await import('../lib/plans.ts')

test('maps deployment price IDs to the correct paid plan during webhook reconciliation', () => {
  assert.equal(planFromPriceId('price_runtime_seeker'), 'seeker')
  assert.equal(planFromPriceId('price_runtime_adept'), 'adept')
  assert.equal(planFromPriceId('price_runtime_magister'), 'full')
})
