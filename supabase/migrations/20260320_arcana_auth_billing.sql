create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  plan text not null default 'guest',
  subscription_status text not null default 'inactive',
  stripe_customer_id text,
  stripe_subscription_id text,
  price_id text,
  current_period_end timestamptz,
  preferred_lang text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_traditions (
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  tradition text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, tradition)
);

create table if not exists public.usage_events (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(user_id) on delete cascade,
  guest_id text,
  tradition text not null,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create index if not exists usage_events_user_day_idx on public.usage_events (user_id, created_at desc);
create index if not exists usage_events_guest_day_idx on public.usage_events (guest_id, created_at desc);
