import test from 'node:test'
import assert from 'node:assert/strict'
import {
  enqueueAkashaAlert,
  handleAkashaBillingEvent,
  handleAkashaFreeActivation,
  mapFreeActivationToAkashaAlert,
  mapStripeEventToAkashaAlert,
} from '../lib/akasha-subscription-alerts.ts'
import { createAkashaTelegramSender } from '../lib/akasha-telegram.ts'

const subscription = {
  id: 'sub_123',
  status: 'active',
  metadata: { plan: 'seeker' },
  customer: 'cus_123',
  items: { data: [{ price: { id: 'price_seeker', unit_amount: 800 } }] },
}

const event = (id, type, object) => ({ id, type, data: { object } })

test('initial free activation maps to a durable, non-PII alert', () => {
  const alert = mapFreeActivationToAkashaAlert('user-123')

  assert.equal(alert.kind, 'initial_free_activation')
  assert.equal(alert.dedupeKey, 'free-activation:user-123')
  assert.match(alert.text, /Free activation/)
  assert.doesNotMatch(alert.text, /subscriber@example\.com/)
})

test('checkout completion and subscription creation share one paid-subscription dedupe key', () => {
  const checkoutAlert = mapStripeEventToAkashaAlert(event(
    'evt_checkout',
    'checkout.session.completed',
    {
      id: 'cs_123',
      mode: 'subscription',
      payment_status: 'paid',
      subscription: 'sub_123',
      metadata: { plan: 'seeker' },
      customer_details: { email: 'subscriber@example.com' },
    },
  ))
  const createdAlert = mapStripeEventToAkashaAlert(event(
    'evt_created',
    'customer.subscription.created',
    subscription,
  ))

  assert.equal(checkoutAlert?.kind, 'new_paid_subscription')
  assert.equal(createdAlert?.kind, 'new_paid_subscription')
  assert.equal(checkoutAlert?.dedupeKey, createdAlert?.dedupeKey)
  assert.doesNotMatch(checkoutAlert?.text ?? '', /subscriber@example\.com/)
})

test('paid, failed, unpaid, and cancelled Stripe events map to alert kinds', () => {
  const cases = [
    ['invoice.payment_succeeded', { id: 'in_paid', amount_paid: 800, currency: 'usd' }, 'paid_invoice'],
    ['invoice.paid', { id: 'in_paid_2', amount_paid: 800, currency: 'usd' }, 'paid_invoice'],
    ['invoice.payment_failed', { id: 'in_failed', amount_due: 800, currency: 'usd' }, 'payment_failed'],
    ['invoice.unpaid', { id: 'in_unpaid', amount_due: 800, currency: 'usd' }, 'payment_unpaid'],
    ['customer.subscription.updated', { ...subscription, id: 'sub_unpaid', status: 'unpaid' }, 'payment_unpaid'],
    ['customer.subscription.deleted', { ...subscription, id: 'sub_cancelled', status: 'canceled' }, 'subscription_cancelled'],
  ]

  for (const [type, object, kind] of cases) {
    assert.equal(mapStripeEventToAkashaAlert(event(`evt_${kind}`, type, object))?.kind, kind, type)
  }
})

test('billing event handling queues once without sending Telegram', async () => {
  const queued = []
  const enqueue = async (alert) => {
    const duplicate = queued.some((item) => item.dedupeKey === alert.dedupeKey)
    if (!duplicate) queued.push(alert)
    return { inserted: !duplicate, deduplicated: duplicate }
  }

  const first = await handleAkashaBillingEvent(event(
    'evt_checkout',
    'checkout.session.completed',
    {
      id: 'cs_123',
      mode: 'subscription',
      payment_status: 'paid',
      subscription: 'sub_123',
      metadata: { plan: 'seeker' },
    },
  ), enqueue)
  const second = await handleAkashaBillingEvent(event(
    'evt_created',
    'customer.subscription.created',
    subscription,
  ), enqueue)

  assert.equal(first.handled, true)
  assert.equal(first.deduplicated, false)
  assert.equal(second.deduplicated, true)
  assert.equal(queued.length, 1)
})

test('free activation handling queues the initial activation alert', async () => {
  const queued = []
  const result = await handleAkashaFreeActivation('user-123', async (alert) => {
    queued.push(alert)
    return { inserted: true, deduplicated: false }
  })

  assert.equal(result.handled, true)
  assert.equal(queued[0]?.kind, 'initial_free_activation')
  assert.equal(queued.length, 1)
})

test('billing handling can deliver only a newly queued alert through an injected sender', async () => {
  const sent = []
  const result = await handleAkashaBillingEvent(event(
    'evt_paid_invoice',
    'invoice.payment_succeeded',
    { id: 'in_paid', amount_paid: 800, currency: 'usd' },
  ), async () => ({ inserted: true, deduplicated: false }), async (message) => {
    sent.push(message)
  })

  assert.equal(result.handled, true)
  assert.equal(sent.length, 1)
  assert.match(sent[0], /Paid invoice/)
})

test('Telegram sender is injectable and posts only the alert message to AKASHA', async () => {
  let requestUrl
  let requestInit
  const send = createAkashaTelegramSender({ token: 'not-a-real-token', chatId: '5491669332' }, async (url, init) => {
    requestUrl = url
    requestInit = init
    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  })

  await send('VOA billing alert\nPaid invoice')

  assert.match(requestUrl, /api\.telegram\.org\/botnot-a-real-token\/sendMessage$/)
  assert.equal(requestInit.method, 'POST')
  assert.deepEqual(JSON.parse(requestInit.body), {
    chat_id: '5491669332',
    text: 'VOA billing alert\nPaid invoice',
    disable_web_page_preview: true,
  })
})

test('outbox insertion claims pending retries but suppresses alerts already sent', async () => {
  const rows = []
  let status = null
  const admin = {
    from(table) {
      assert.equal(table, 'akasha_alert_outbox')
      return {
        insert(row) {
          if (rows.length === 0) {
            rows.push(row)
            status = 'pending'
            return Promise.resolve({ error: null })
          }
          return Promise.resolve({ error: { code: '23505', message: 'duplicate key' } })
        },
        select() {
          return {
            eq(column, value) {
              assert.equal(column, 'dedupe_key')
              assert.equal(value, 'free-activation:user-123')
              return { maybeSingle: async () => ({ data: status ? { status } : null, error: null }) }
            },
          }
        },
      }
    },
  }
  const alert = mapFreeActivationToAkashaAlert('user-123')

  assert.deepEqual(await enqueueAkashaAlert(admin, alert), { inserted: true, deduplicated: false })
  assert.deepEqual(await enqueueAkashaAlert(admin, alert), { inserted: true, deduplicated: false })
  status = 'sent'
  assert.deepEqual(await enqueueAkashaAlert(admin, alert), { inserted: false, deduplicated: true })
  assert.equal(rows[0].status, 'pending')
  assert.equal(rows[0].dedupe_key, 'free-activation:user-123')
  assert.equal(rows[0].payload.kind, 'initial_free_activation')
})

test('a failed invoice alerts the amount actually owed, not amount_paid', () => {
  // Real Stripe invoices always include amount_paid: 0 on failure, which used to
  // win the fallback chain and render "Payment failed: 0.00 USD".
  const failed = mapStripeEventToAkashaAlert(event('evt_failed_real', 'invoice.payment_failed', {
    id: 'in_real_failed',
    amount_due: 560,
    amount_paid: 0,
    amount_remaining: 560,
    total: 560,
    subtotal: 800,
    currency: 'usd',
    status: 'open',
  }))

  assert.equal(failed?.kind, 'payment_failed')
  assert.match(failed?.text ?? '', /Payment failed: 5\.60 USD/)
  assert.doesNotMatch(failed?.text ?? '', /0\.00/)
  assert.equal(failed?.payload?.amount, 560)
})

test('a genuinely zero-cost failed invoice still reports 0.00', () => {
  const failed = mapStripeEventToAkashaAlert(event('evt_failed_zero', 'invoice.payment_failed', {
    id: 'in_zero', amount_due: 0, amount_paid: 0, total: 0, currency: 'usd', status: 'open',
  }))
  assert.match(failed?.text ?? '', /Payment failed: 0\.00 USD/)
})

test('a paid invoice still reports the amount actually paid', () => {
  const paid = mapStripeEventToAkashaAlert(event('evt_paid_real', 'invoice.payment_succeeded', {
    id: 'in_real_paid', amount_due: 0, amount_paid: 800, total: 800, currency: 'usd', status: 'paid',
  }))
  assert.match(paid?.text ?? '', /Paid invoice: 8\.00 USD/)
})

test('unpaid subscription alert uses a real newline, not an escaped backslash-n', () => {
  const alert = mapStripeEventToAkashaAlert(event(
    'evt_sub_unpaid', 'customer.subscription.updated', { ...subscription, id: 'sub_unpaid', status: 'unpaid' },
  ))
  assert.equal(alert?.kind, 'payment_unpaid')
  assert.ok(!(alert?.text ?? '').includes('\\n'), 'text must not contain a literal backslash-n')
  assert.match(alert?.text ?? '', /^VOA billing alert\nSubscription unpaid$/)
})
