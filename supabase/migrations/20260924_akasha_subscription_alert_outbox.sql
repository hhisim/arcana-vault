-- Durable AKASHA subscription alert queue.
-- Apply this migration before enabling the Stripe webhook alert path.
create table if not exists public.akasha_alert_outbox (
  id uuid primary key default gen_random_uuid(),
  dedupe_key text not null,
  event_id text,
  alert_type text not null check (alert_type in (
    'initial_free_activation',
    'new_paid_subscription',
    'paid_invoice',
    'payment_failed',
    'payment_unpaid',
    'subscription_cancelled'
  )),
  source_event_type text,
  message text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'sending', 'sent', 'failed')),
  attempts integer not null default 0 check (attempts >= 0),
  next_attempt_at timestamptz not null default now(),
  sent_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Semantic keys deduplicate different Stripe deliveries of the same alert. In
-- particular, checkout.session.completed and customer.subscription.created
-- both use subscription:<id>:new-paid.
create unique index if not exists akasha_alert_outbox_dedupe_key_idx
  on public.akasha_alert_outbox (dedupe_key);

-- Stripe retries the same event with the same id. Keep this unique separately
-- from the semantic key so either replay path is harmless.
create unique index if not exists akasha_alert_outbox_event_id_idx
  on public.akasha_alert_outbox (event_id)
  where event_id is not null;

create index if not exists akasha_alert_outbox_pending_idx
  on public.akasha_alert_outbox (status, next_attempt_at, created_at);

alter table public.akasha_alert_outbox enable row level security;

-- Only the service-role server client writes or reads this operational queue.
-- No client-facing policy is intentionally granted.
revoke all on table public.akasha_alert_outbox from anon, authenticated;
grant all on table public.akasha_alert_outbox to service_role;
