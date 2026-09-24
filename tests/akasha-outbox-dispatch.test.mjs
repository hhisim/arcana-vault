import test from 'node:test'
import assert from 'node:assert/strict'
const dispatcher = await import('../lib/akasha-outbox-dispatch.ts').catch(() => ({}))

const alert = {
  kind: 'paid_invoice',
  dedupeKey: 'invoice:in_123:paid_invoice',
  text: 'VOA billing alert\nPaid invoice: 8.00 USD',
  eventId: 'evt_123',
  sourceEventType: 'invoice.paid',
  payload: { invoice_id: 'in_123' },
}

test('claimed outbox alert sends once then marks it sent', async () => {
  assert.equal(typeof dispatcher.dispatchAkashaAlert, 'function')
  const calls = []
  const repository = {
    claim: async (key) => (calls.push(['claim', key]), true),
    markSent: async (key) => calls.push(['sent', key]),
    markFailed: async (...args) => calls.push(['failed', ...args]),
  }
  let message = ''
  const result = await dispatcher.dispatchAkashaAlert(alert, repository, async (text) => { message = text })
  assert.deepEqual(result, { claimed: true, sent: true })
  assert.equal(message, alert.text)
  assert.deepEqual(calls, [['claim', alert.dedupeKey], ['sent', alert.dedupeKey]])
})

test('unclaimed outbox alert does not send', async () => {
  const calls = []
  const repository = {
    claim: async () => false,
    markSent: async () => calls.push('sent'),
    markFailed: async () => calls.push('failed'),
  }
  const result = await dispatcher.dispatchAkashaAlert(alert, repository, async () => calls.push('send'))
  assert.deepEqual(result, { claimed: false, sent: false })
  assert.deepEqual(calls, [])
})

test('failed Telegram delivery records failure and rethrows for Stripe retry', async () => {
  const calls = []
  const repository = {
    claim: async () => true,
    markSent: async () => calls.push('sent'),
    markFailed: async (key, message) => calls.push(['failed', key, message]),
  }
  await assert.rejects(
    dispatcher.dispatchAkashaAlert(alert, repository, async () => { throw new Error('Telegram unavailable') }),
    /Telegram unavailable/,
  )
  assert.equal(calls[0][0], 'failed')
  assert.equal(calls[0][1], alert.dedupeKey)
  assert.match(calls[0][2], /Telegram unavailable/)
})
