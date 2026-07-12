import assert from 'node:assert/strict'
import test from 'node:test'

import {
  normalizePendingPlan,
  subscriptionActivationState,
} from '../lib/billing-flow.ts'

test('normalizes only paid signup plans and preserves free', () => {
  assert.equal(normalizePendingPlan('seeker'), 'seeker')
  assert.equal(normalizePendingPlan('adept'), 'adept')
  assert.equal(normalizePendingPlan('full'), 'full')
  assert.equal(normalizePendingPlan('free'), 'free')
  assert.equal(normalizePendingPlan('magister'), 'full')
  assert.equal(normalizePendingPlan('anything-else'), 'free')
})

test('does not call a checkout return confirmed until a paid plan is active', () => {
  assert.equal(subscriptionActivationState('guest', 'inactive'), 'pending')
  assert.equal(subscriptionActivationState('free', 'active'), 'pending')
  assert.equal(subscriptionActivationState('seeker', 'inactive'), 'pending')
  assert.equal(subscriptionActivationState('seeker', 'active'), 'active')
  assert.equal(subscriptionActivationState('adept', 'trialing'), 'active')
  assert.equal(subscriptionActivationState('full', 'active'), 'active')
})
