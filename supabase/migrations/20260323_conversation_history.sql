-- Enable UUID extension (if not already)
create extension if not exists "pgcrypto";

-- Conversations table
create table if not exists public.conversations (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references public.profiles(user_id) on delete cascade,
  tradition       text not null,
  mode            text not null,
  title           text,
  summary         text,
  started_at      timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  message_count   integer not null default 0,
  is_starred      boolean not null default false,
  is_archived     boolean not null default false,
  daily_type      text,
  metadata        jsonb
);

-- Messages table
create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  role            text not null check (role in ('user', 'assistant', 'system')),
  content         text not null,
  created_at      timestamptz not null default now(),
  metadata        jsonb
);

-- Indexes
create index if not exists idx_conversations_user_time on public.conversations (user_id, last_message_at desc);
create index if not exists idx_conversations_user_tradition on public.conversations (user_id, tradition);
create index if not exists idx_messages_conversation on public.messages (conversation_id, created_at);

-- Row Level Security
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Users can only see their own conversations
create policy "users_own_conversations" on public.conversations
  for all using (auth.uid() = user_id);

create policy "users_own_messages" on public.messages
  for all using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );
