import test from 'node:test'
import assert from 'node:assert/strict'
import { accountMeFailureResponse } from '../lib/account-me-failure.ts'

test('account lookup failure is not reported as a successful guest session', async () => {
  const response = accountMeFailureResponse()
  const payload = await response.json()

  assert.equal(response.status, 503)
  assert.equal(payload.isAuthenticated, undefined)
  assert.equal(payload.error, 'account_unavailable')
})
