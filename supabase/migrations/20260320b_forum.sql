-- ============================================================
-- FORUM TABLES for Vault of Arcana
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- FORUM CATEGORIES
-- ============================================================
create table if not exists forum_categories (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name_en text not null,
  name_tr text not null,
  name_ru text not null,
  description_en text not null default '',
  description_tr text not null default '',
  description_ru text not null default '',
  icon text not null default '�讨论',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

-- ============================================================
-- FORUM POSTS
-- ============================================================
create table if not exists forum_posts (
  id uuid default gen_random_uuid() primary key,
  category_slug text not null references forum_categories(slug) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  author_email text,
  author_name text not null default 'Seeker',
  title text not null,
  content text not null,
  content_html text,
  is_pinned boolean not null default false,
  is_locked boolean not null default false,
  view_count int not null default 0,
  reply_count int not null default 0,
  last_reply_at timestamptz,
  last_reply_by text,
  tags text[] default '{}',
  upvotes int not null default 0,
  downvotes int not null default 0,
  is_deleted boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- FORUM REPLIES (comments)
-- ============================================================
create table if not exists forum_replies (
  id uuid default gen_random_uuid() primary key,
  post_id uuid not null references forum_posts(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  author_email text,
  author_name text not null default 'Seeker',
  content text not null,
  content_html text,
  is_deleted boolean not null default false,
  upvotes int not null default 0,
  downvotes int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- REACTIONS (likes/upvotes on posts and replies)
-- ============================================================
create table if not exists forum_reactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid references forum_posts(id) on delete cascade,
  reply_id uuid references forum_replies(id) on delete cascade,
  type text not null check (type in ('upvote', 'downvote')),
  created_at timestamptz default now(),
  constraint one_target check (
    (post_id is not null)::int + (reply_id is not null)::int = 1
  ),
  constraint no_duplicate unique (user_id, post_id),
  constraint no_duplicate_reply unique (user_id, reply_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists forum_posts_category on forum_posts(category_slug);
create index if not exists forum_posts_author on forum_posts(author_id);
create index if not exists forum_posts_created on forum_posts(created_at desc);
create index if not exists forum_posts_pinned on forum_posts(is_pinned) where is_pinned = true;
create index if not exists forum_replies_post on forum_replies(post_id);
create index if not exists forum_reactions_user on forum_reactions(user_id);

-- ============================================================
-- AUTO-UPDATE reply_count and last_reply info
-- ============================================================
create or replace function update_post_reply_stats()
returns trigger language plpgsql security definer as $$
begin
  if TG_OP = 'INSERT' then
    update forum_posts set
      reply_count = reply_count + 1,
      last_reply_at = now(),
      last_reply_by = NEW.author_name,
      updated_at = now()
    where id = NEW.post_id;
  elsif TG_OP = 'DELETE' then
    update forum_posts set
      reply_count = greatest(0, reply_count - 1),
      updated_at = now()
    where id = OLD.post_id;
  end if;
  return null;
end;
$$;

create or replace trigger trigger_update_reply_stats
after insert or delete on forum_replies
for each row execute function update_post_reply_stats();

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$;

create or replace trigger trigger_posts_updated_at
before update on forum_posts
for each row execute function update_updated_at();

create or replace trigger trigger_replies_updated_at
before update on forum_replies
for each row execute function update_updated_at();

-- ============================================================
-- SEED DEFAULT CATEGORIES
-- ============================================================
insert into forum_categories (slug, name_en, name_tr, name_ru, description_en, description_tr, description_ru, icon, sort_order) values
  ('general', 'General Discussion', 'Genel Tartışma', 'Общие вопросы', 'Philosophy, symbolcraft, and the crossroads of the unseen.', 'Felsefe, sembolyazı ve görünmezlerin kavşağı.', 'Философия, символическое ремесло и перекрёстки невидимого.', '🔥', 1),
  ('tarot', 'Tarot & Divination', 'Tarot ve Kehanet', 'Таро и гадания', 'The 78 degrees, oracle systems, spreads, and readings.', '78 derece, kahin sistemleri, açılımlar ve fal.', '78 градусов, оракульние системы, расклады и чтения.', '🌟', 2),
  ('sufism', 'Sufism & Islamic Mysticism', 'Sufizm ve İslam Mistisizmi', 'Суфизм и исламский мистицизм', 'Dhikr, tariqa, Rumi, and the path of the heart.', 'Zikir, tarikat, Rumi ve kalp yolu.', 'Дhikr, тарикат, Руми и путь сердца.', '🌙', 3),
  ('tao', 'Tao & Chinese Wisdom', 'Tao ve Çin Bilgeliği', 'Дао и китайская мудрость', 'Tao Te Ching, I Ching, Zhuangzi, and classical Chinese mysticism.', 'Tao Te Ching, I Ching, Zhuangzi ve klasik Çin mistisizmi.', 'Дао Дэ Цзин, И Цзин, Чжуан-цзы и классический китайский мистицизм.', '☯', 4),
  ('tantra', 'Tantra & Kashmir Shaivism', 'Tantra ve Kaşmir Shaivismi', 'Тантра и Кашмирский шиваизм', 'Kundalini, chakra, shakti, and the yoga of pleasure and consciousness.', 'Kundalini, çakra, şakti ve zevk ile bilinç yogası.', 'Кундалини, чакры, шакти и йога удовольствия и сознания.', '🔺', 5),
  ('entheogens', 'Entheogens & Visionary Plants', 'Enteyojenler ve Vizyoner Bitkiler', 'Энтеогены и видческие растения', 'Plant medicines, psychedelic experiences, and consciousness exploration.', 'Bitki ilaçları, psikodelik deneyimler ve bilinç keşfi.', 'Растительные лекарства, психоделические переживания и исследование сознания.', '🌀', 6),
  ('dreamwork', 'Dreamwork & Astral', 'Rüya Çalışması ve Astral', 'Работа со сновидениями и астрал', 'Lucid dreaming, astral projection, and nocturnal symbolism.', 'Rüya farkındalığı, astral yansıtma ve gece sembolizmi.', 'Осознанные сновидения, астральная проекция и ночная символика.', '🌑', 7),
  ('codex', 'The Codex & Art', 'Codex ve Sanat', 'Кодекс и искусство', 'Hakan Hisim''s Universal Transmissions, symbolic art, and the Codex Oracle.', 'Hakan Hisim''in Universal Transmissions, sembolik sanat ve Codex Kahini.', 'Universal Transmissions Хакан Хисима, символическое искусство и Оракул Кодекс.', '✦', 8),
  ('help', 'Help & Feedback', 'Yardım ve Geri Bildirim', 'Помощь и отзывы', 'Questions about the site, bugs, suggestions, and community support.', 'Site hakkında sorular, hatalar, öneriler ve topluluk desteği.', 'Вопросы о сайте, ошибки, предложения и поддержка сообщества.', '💬', 9)
on conflict (slug) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table forum_posts enable row level security;
alter table forum_replies enable row level security;
alter table forum_reactions enable row level security;
alter table forum_categories enable row level security;

-- Posts: anyone can read; authenticated users can create
create policy "Posts are publicly readable" on forum_posts for select using (is_deleted = false);
create policy "Authenticated users can create posts" on forum_posts for insert with check (auth.uid() is not null);
create policy "Authors can update their posts" on forum_posts for update using (author_id = auth.uid());
create policy "Authors can soft-delete their posts" on forum_posts for update using (author_id = auth.uid() and is_deleted = false);

-- Replies: anyone can read; authenticated users can create
create policy "Replies are publicly readable" on forum_replies for select using (is_deleted = false);
create policy "Authenticated users can reply" on forum_replies for insert with check (auth.uid() is not null);
create policy "Authors can update their replies" on forum_replies for update using (author_id = auth.uid());
create policy "Authors can soft-delete their replies" on forum_replies for update using (author_id = auth.uid() and is_deleted = false);

-- Reactions: anyone can read; authenticated users can react
create policy "Reactions are publicly readable" on forum_reactions for select using (true);
create policy "Authenticated users can react" on forum_reactions for insert with check (auth.uid() is not null);
create policy "Users can remove their reactions" on forum_reactions for delete using (user_id = auth.uid());

-- Categories: publicly readable
create policy "Categories are publicly readable" on forum_categories for select using (is_active = true);
