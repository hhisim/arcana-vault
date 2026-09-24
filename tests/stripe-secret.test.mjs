import test from 'node:test'
import assert from 'node:assert/strict'
const stripeSecret = await import('../lib/stripe-secret.ts').catch(() => ({}))

test('Stripe secret normalization removes surrounding whitespace before client use', () => {
  assert.equal(typeof stripeSecret.normalizeStripeSecret, 'function')
  assert.equal(stripeSecret.normalizeStripeSecret('  sk_live_valid-example  \n'), 'sk_live_valid-example')
  assert.equal(stripeSecret.normalizeStripeSecret('   \n\t'), null)
  assert.equal(stripeSecret.normalizeStripeSecret(undefined), null)
  assert.equal(stripeSecret.normalizeStripeSecret('sk_test_valid-example'), 'sk_test_valid-example')
})
