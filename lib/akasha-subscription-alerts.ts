import type { getAdminSupabase } from './supabase/admin'

export const AKASHA_ALERT_OUTBOX_TABLE = 'akasha_alert_outbox' as const

export type AkashaAlertKind =
  | 'initial_free_activation'
  | 'new_paid_subscription'
  | 'paid_invoice'
  | 'payment_failed'
  | 'payment_unpaid'
  | 'subscription_cancelled'

export type AkashaAlert = {
  kind: AkashaAlertKind
  dedupeKey: string
  text: string
  eventId: string | null
  sourceEventType: string | null
  payload: Record<string, unknown>
}

export type AkashaEnqueueResult = {
  inserted: boolean
  deduplicated: boolean
}

export type AkashaAlertEnqueuer = (alert: AkashaAlert) => Promise<AkashaEnqueueResult>

type JsonObject = Record<string, any>

type StripeLikeEvent = {
  id?: unknown
  type?: unknown
  data?: { object?: unknown } | null
}

const PAID_PLANS = new Set(['seeker', 'adept', 'full', 'magister'])

function asObject(value: unknown): JsonObject | null {
  return value !== null && typeof value === 'object' ? value as JsonObject : null
}

function nonEmptyString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

function eventIdOf(event: StripeLikeEvent): string | null {
  return nonEmptyString(event.id)
}

function eventTypeOf(event: StripeLikeEvent): string | null {
  return nonEmptyString(event.type)
}

function objectOf(event: StripeLikeEvent): JsonObject | null {
  return asObject(event.data?.object)
}

function metadataPlan(value: unknown): string | null {
  const metadata = asObject(value)
  const plan = nonEmptyString(metadata?.plan)?.toLowerCase() ?? null
  return plan && PAID_PLANS.has(plan) ? plan : plan
}

function planLabel(value: unknown): string {
  const plan = metadataPlan(value)
  if (plan === 'magister') return 'Magister'
  if (plan === 'full') return 'Magister'
  if (plan === 'adept') return 'Adept'
  if (plan === 'seeker') return 'Seeker'
  return 'Paid plan'
}

function priceAmount(value: unknown): number | null {
  const object = asObject(value)
  const items = asObject(object?.items)
  const data = Array.isArray(items?.data) ? items.data : []
  const first = asObject(data[0])
  const price = asObject(first?.price)
  const amount = price?.unit_amount
  if (typeof amount === 'number' && Number.isFinite(amount)) return amount
  const decimal = price?.unit_amount_decimal
  if (typeof decimal === 'string' && /^\d+(?:\.\d+)?$/.test(decimal)) {
    const parsed = Number(decimal)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function invoiceAmount(value: JsonObject): number | null {
  const candidates = [value.amount_paid, value.amount_due, value.total]
  for (const candidate of candidates) {
    if (typeof candidate === 'number' && Number.isFinite(candidate)) return candidate
  }
  return null
}

function currencyLabel(value: unknown): string {
  return typeof value === 'string' && value.length > 0 ? value.toUpperCase() : 'USD'
}

function formatAmount(amount: number | null, currency: unknown, label: string): string {
  if (amount === null) return label
  return `${label}: ${(amount / 100).toFixed(2)} ${currencyLabel(currency)}`
}

function makeAlert({
  kind,
  dedupeKey,
  text,
  event,
  payload,
}: {
  kind: AkashaAlertKind
  dedupeKey: string
  text: string
  event?: StripeLikeEvent
  payload: Record<string, unknown>
}): AkashaAlert {
  return {
    kind,
    dedupeKey,
    text,
    eventId: event ? eventIdOf(event) : null,
    sourceEventType: event ? eventTypeOf(event) : null,
    payload,
  }
}

export function mapFreeActivationToAkashaAlert(userId: string): AkashaAlert {
  if (!userId) throw new Error('A user id is required for a free activation alert')

  return makeAlert({
    kind: 'initial_free_activation',
    dedupeKey: `free-activation:${userId}`,
    text: 'VOA billing alert\nFree activation\nPlan: Free',
    payload: { kind: 'initial_free_activation', user_id: userId, plan: 'free' },
  })
}

function isPaidSubscription(subscription: JsonObject): boolean {
  const plan = metadataPlan(subscription.metadata)
  if (plan === 'free' || plan === 'guest') return false
  if (plan && PAID_PLANS.has(plan)) return true

  const amount = priceAmount(subscription)
  if (amount !== null) return amount > 0

  // Stripe subscription checkout is only created for the paid plans in this app.
  return true
}

function mapSubscriptionCreated(event: StripeLikeEvent, subscription: JsonObject): AkashaAlert | null {
  const status = nonEmptyString(subscription.status)
  if (status && !['active', 'trialing'].includes(status)) return null
  if (!isPaidSubscription(subscription)) return null

  const subscriptionId = nonEmptyString(subscription.id)
  if (!subscriptionId) return null
  const plan = planLabel(subscription.metadata)

  return makeAlert({
    kind: 'new_paid_subscription',
    dedupeKey: `subscription:${subscriptionId}:new-paid`,
    text: `VOA billing alert\nNew paid subscription\nPlan: ${plan}`,
    event,
    payload: {
      kind: 'new_paid_subscription',
      subscription_id: subscriptionId,
      plan,
      status: status ?? 'active',
    },
  })
}

function mapCheckoutCompleted(event: StripeLikeEvent, session: JsonObject): AkashaAlert | null {
  if (session.mode !== 'subscription') return null
  const subscriptionId = nonEmptyString(session.subscription)
  if (!subscriptionId) return null
  if (session.payment_status && !['paid', 'no_payment_required'].includes(String(session.payment_status))) {
    return null
  }
  const plan = planLabel(session.metadata)

  return makeAlert({
    kind: 'new_paid_subscription',
    dedupeKey: `subscription:${subscriptionId}:new-paid`,
    text: `VOA billing alert\nNew paid subscription\nPlan: ${plan}`,
    event,
    payload: {
      kind: 'new_paid_subscription',
      subscription_id: subscriptionId,
      plan,
      status: 'active',
    },
  })
}

function mapInvoice(event: StripeLikeEvent, invoice: JsonObject, kind: AkashaAlertKind, label: string): AkashaAlert | null {
  const invoiceId = nonEmptyString(invoice.id)
  if (!invoiceId) return null
  const amount = invoiceAmount(invoice)
  const currency = currencyLabel(invoice.currency)
  const textAmount = formatAmount(amount, currency, label)

  return makeAlert({
    kind,
    dedupeKey: `invoice:${invoiceId}:${kind}`,
    text: `VOA billing alert\n${textAmount}`,
    event,
    payload: {
      kind,
      invoice_id: invoiceId,
      amount,
      currency,
      status: nonEmptyString(invoice.status),
    },
  })
}

function mapSubscriptionCancellation(event: StripeLikeEvent, subscription: JsonObject): AkashaAlert | null {
  const subscriptionId = nonEmptyString(subscription.id)
  if (!subscriptionId) return null

  return makeAlert({
    kind: 'subscription_cancelled',
    dedupeKey: `subscription:${subscriptionId}:cancelled`,
    text: 'VOA billing alert\nSubscription cancelled',
    event,
    payload: {
      kind: 'subscription_cancelled',
      subscription_id: subscriptionId,
      status: nonEmptyString(subscription.status) ?? 'canceled',
    },
  })
}

function mapSubscriptionUnpaid(event: StripeLikeEvent, subscription: JsonObject): AkashaAlert | null {
  const subscriptionId = nonEmptyString(subscription.id)
  if (!subscriptionId) return null

  return makeAlert({
    kind: 'payment_unpaid',
    dedupeKey: `subscription:${subscriptionId}:unpaid`,
    text: 'VOA billing alert\\nSubscription unpaid',
    event,
    payload: {
      kind: 'payment_unpaid',
      subscription_id: subscriptionId,
      status: 'unpaid',
    },
  })
}

export function mapStripeEventToAkashaAlert(event: StripeLikeEvent): AkashaAlert | null {
  const type = eventTypeOf(event)
  const object = objectOf(event)
  if (!type || !object) return null

  if (type === 'checkout.session.completed') return mapCheckoutCompleted(event, object)

  if (type === 'customer.subscription.created') return mapSubscriptionCreated(event, object)

  if (type === 'customer.subscription.deleted') return mapSubscriptionCancellation(event, object)

  if (type === 'customer.subscription.updated') {
    if (object.status === 'canceled' || object.cancel_at_period_end === true) {
      return mapSubscriptionCancellation(event, object)
    }
    if (object.status === 'unpaid') return mapSubscriptionUnpaid(event, object)
  }

  if (type === 'invoice.payment_succeeded' || type === 'invoice.paid') {
    return mapInvoice(event, object, 'paid_invoice', 'Paid invoice')
  }

  if (type === 'invoice.payment_failed') {
    return mapInvoice(event, object, 'payment_failed', 'Payment failed')
  }

  if (type === 'invoice.unpaid') {
    return mapInvoice(event, object, 'payment_unpaid', 'Invoice unpaid')
  }

  return null
}

export type AkashaAlertSender = (message: string, alert: AkashaAlert) => Promise<void> | void

export async function handleAkashaBillingEvent(
  event: StripeLikeEvent,
  enqueue: AkashaAlertEnqueuer,
  send?: AkashaAlertSender,
): Promise<{ handled: boolean; deduplicated: boolean; alert: AkashaAlert | null }> {
  const alert = mapStripeEventToAkashaAlert(event)
  if (!alert) return { handled: false, deduplicated: false, alert: null }

  const result = await enqueue(alert)
  if (send && result.inserted && !result.deduplicated) await send(alert.text, alert)
  return { handled: true, deduplicated: result.deduplicated, alert }
}

export async function handleAkashaFreeActivation(
  userId: string,
  enqueue: AkashaAlertEnqueuer,
  send?: AkashaAlertSender,
): Promise<{ handled: true; deduplicated: boolean; alert: AkashaAlert }> {
  const alert = mapFreeActivationToAkashaAlert(userId)
  const result = await enqueue(alert)
  if (send && result.inserted && !result.deduplicated) await send(alert.text, alert)
  return { handled: true, deduplicated: result.deduplicated, alert }
}

type OutboxInsertRow = {
  dedupe_key: string
  event_id: string | null
  alert_type: AkashaAlertKind
  source_event_type: string | null
  message: string
  payload: Record<string, unknown>
  status: 'pending'
  attempts: number
  next_attempt_at: string
}

type SupabaseError = { code?: unknown; message?: unknown }

type SupabaseAdminLike = ReturnType<typeof getAdminSupabase>

function isUniqueViolation(error: SupabaseError | null): boolean {
  return error?.code === '23505'
}

export async function enqueueAkashaAlert(
  admin: SupabaseAdminLike,
  alert: AkashaAlert,
): Promise<AkashaEnqueueResult> {
  const row: OutboxInsertRow = {
    dedupe_key: alert.dedupeKey,
    event_id: alert.eventId,
    alert_type: alert.kind,
    source_event_type: alert.sourceEventType,
    message: alert.text,
    payload: alert.payload,
    status: 'pending',
    attempts: 0,
    next_attempt_at: new Date().toISOString(),
  }
  const { error } = await admin.from(AKASHA_ALERT_OUTBOX_TABLE).insert(row)

  if (!error) return { inserted: true, deduplicated: false }
  if (isUniqueViolation(error)) {
    const { data: existing, error: lookupError } = await admin
      .from(AKASHA_ALERT_OUTBOX_TABLE)
      .select('status')
      .eq('dedupe_key', alert.dedupeKey)
      .maybeSingle()
    if (lookupError) throw new Error(`AKASHA alert outbox lookup failed: ${lookupError.message}`)
    if (existing?.status === 'pending') return { inserted: true, deduplicated: false }
    if (existing?.status === 'failed') {
      const { data: retried, error: retryError } = await admin
        .from(AKASHA_ALERT_OUTBOX_TABLE)
        .update({ status: 'pending', next_attempt_at: new Date().toISOString(), last_error: null })
        .eq('dedupe_key', alert.dedupeKey)
        .eq('status', 'failed')
        .select('id')
        .maybeSingle()
      if (retryError) throw new Error(`AKASHA alert retry reset failed: ${retryError.message}`)
      if (retried) return { inserted: true, deduplicated: false }
    }
    return { inserted: false, deduplicated: true }
  }

  const detail = typeof error.message === 'string' ? error.message : 'unknown database error'
  throw new Error(`AKASHA alert outbox insert failed: ${detail}`)
}
