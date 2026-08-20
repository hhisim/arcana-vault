-- One-time esoteric pack purchases (delivered as Google Drive access).
-- 2026-08-04
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  sku text not null,
  pack_title text not null,
  amount_total bigint,
  currency text default 'usd',
  status text not null default 'pending_access',
  access_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists purchases_session_id_key on public.purchases (session_id);

alter table public.purchases enable row level security;

-- owner can read their own purchases (for the /account/access locker)
create policy "select own purchases" on public.purchases
  for select using (auth.uid() = user_id);

-- app writes happen via the service-role admin client, which bypasses RLS.
