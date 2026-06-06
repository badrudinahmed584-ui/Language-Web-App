-- ============================================================
-- AfriQ AI — Complete Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- MIGRATION 1: Profiles
-- ============================================================
create table if not exists public.profiles (
  user_id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  bio text,
  avatar_url text,
  country text,
  native_language text default 'somali',
  learning_languages text[] default '{}',
  level text default 'beginner' check (level in ('beginner','intermediate','advanced')),
  xp integer default 0,
  streak_count integer default 0,
  last_active timestamptz default now(),
  rank text default 'Explorer' check (rank in ('Explorer','Learner','Scholar','Master','Grandmaster')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = user_id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, display_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- MIGRATION 2: XP & Gamification
-- ============================================================
create table if not exists public.xp_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  amount integer not null,
  source text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists public.badges (
  id text primary key,
  name text not null,
  description text,
  icon text,
  criteria_json jsonb default '{}'
);

create table if not exists public.user_badges (
  user_id uuid references auth.users(id) on delete cascade,
  badge_id text references public.badges(id),
  earned_at timestamptz default now(),
  primary key (user_id, badge_id)
);

alter table public.xp_transactions enable row level security;
create policy "Users see own xp" on xp_transactions for select using (auth.uid() = user_id);
create policy "Service can insert xp" on xp_transactions for insert with check (auth.uid() = user_id);

alter table public.badges enable row level security;
create policy "Badges viewable by all" on badges for select using (true);

alter table public.user_badges enable row level security;
create policy "User badges viewable by all" on user_badges for select using (true);

insert into public.badges (id, name, description, icon) values
  ('first-lesson', 'First Step', 'Complete your first lesson', '🎯'),
  ('streak-7', 'Week Warrior', 'Maintain a 7-day streak', '🔥'),
  ('streak-30', 'Month Master', 'Maintain a 30-day streak', '⚡'),
  ('xp-500', 'Learner', 'Earn 500 XP', '📚'),
  ('xp-2000', 'Scholar', 'Earn 2000 XP', '🎓'),
  ('vocab-50', 'Word Collector', 'Learn 50 vocabulary words', '📖'),
  ('community', 'Community Member', 'Join your first community', '👥'),
  ('champion', 'Champion', 'Win a community challenge', '🏆')
on conflict (id) do nothing;

-- ============================================================
-- MIGRATION 3: Communities
-- ============================================================
create table if not exists public.communities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  language text,
  type text default 'public' check (type in ('public','private')),
  avatar_url text,
  created_by uuid references auth.users(id),
  member_count integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.community_members (
  community_id uuid references public.communities(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text default 'member' check (role in ('member','admin')),
  joined_at timestamptz default now(),
  primary key (community_id, user_id)
);

create table if not exists public.community_posts (
  id uuid default uuid_generate_v4() primary key,
  community_id uuid references public.communities(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  type text default 'text',
  likes_count integer default 0,
  created_at timestamptz default now()
);

alter table public.communities enable row level security;
create policy "Public communities viewable" on communities for select using (type = 'public');
create policy "Authenticated can create communities" on communities for insert with check (auth.uid() = created_by);
create policy "Admins can update communities" on communities for update using (
  exists (select 1 from community_members where community_id = id and user_id = auth.uid() and role = 'admin')
);

alter table public.community_members enable row level security;
create policy "Members viewable" on community_members for select using (true);
create policy "Users can join communities" on community_members for insert with check (auth.uid() = user_id);

alter table public.community_posts enable row level security;
create policy "Posts in public communities viewable" on community_posts for select using (
  exists (select 1 from communities where id = community_id and type = 'public')
);
create policy "Members can post" on community_posts for insert with check (
  auth.uid() = user_id and
  exists (select 1 from community_members where community_id = community_posts.community_id and user_id = auth.uid())
);

create or replace function update_member_count()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    update communities set member_count = member_count + 1 where id = new.community_id;
  elsif TG_OP = 'DELETE' then
    update communities set member_count = greatest(0, member_count - 1) where id = old.community_id;
  end if;
  return null;
end;
$$;

drop trigger if exists on_member_change on community_members;
create trigger on_member_change
  after insert or delete on community_members
  for each row execute procedure update_member_count();

-- Seed some starter communities
insert into public.communities (name, description, language, type, member_count) values
  ('Somali Learners', 'A community for people learning Somali. Beginners welcome!', 'somali', 'public', 0),
  ('Kiswahili Masters', 'Advanced Kiswahili discussion and practice group', 'kiswahili', 'public', 0),
  ('English Fluency Club', 'Practice English for business, education, and daily life', 'english', 'public', 0),
  ('East African Language Exchange', 'Exchange languages with speakers from Kenya, Somalia, and Ethiopia', null, 'public', 0)
on conflict do nothing;

-- ============================================================
-- MIGRATION 4: Messaging
-- ============================================================
create table if not exists public.conversations (
  id uuid default uuid_generate_v4() primary key,
  type text default 'direct' check (type in ('direct','group')),
  name text,
  created_at timestamptz default now()
);

create table if not exists public.conversation_participants (
  conversation_id uuid references public.conversations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;

create policy "Participants see their conversations" on conversations for select using (
  exists (select 1 from conversation_participants where conversation_id = id and user_id = auth.uid())
);
create policy "Participants viewable" on conversation_participants for select using (
  exists (select 1 from conversation_participants cp where cp.conversation_id = conversation_id and cp.user_id = auth.uid())
);
create policy "Participants see messages" on messages for select using (
  exists (select 1 from conversation_participants where conversation_id = messages.conversation_id and user_id = auth.uid())
);
create policy "Participants send messages" on messages for insert with check (
  auth.uid() = sender_id and
  exists (select 1 from conversation_participants where conversation_id = messages.conversation_id and user_id = auth.uid())
);

-- ============================================================
-- MIGRATION 5: Learning Content
-- ============================================================
create table if not exists public.lessons (
  id uuid default uuid_generate_v4() primary key,
  language_pair text not null,
  level text not null,
  title text not null,
  content_json jsonb default '{}',
  xp_reward integer default 10,
  order_index integer default 0
);

create table if not exists public.user_progress (
  user_id uuid references auth.users(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  completed_at timestamptz default now(),
  score integer default 0,
  xp_earned integer default 0,
  primary key (user_id, lesson_id)
);

create table if not exists public.ai_conversations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  language_pair text not null,
  messages_json jsonb default '[]',
  session_title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.lessons enable row level security;
create policy "Lessons viewable by authenticated" on lessons for select using (auth.uid() is not null);

alter table public.user_progress enable row level security;
create policy "Users see own progress" on user_progress for select using (auth.uid() = user_id);
create policy "Users insert own progress" on user_progress for insert with check (auth.uid() = user_id);

alter table public.ai_conversations enable row level security;
create policy "Users see own AI convos" on ai_conversations for select using (auth.uid() = user_id);
create policy "Users manage own AI convos" on ai_conversations for all using (auth.uid() = user_id);

-- ============================================================
-- MIGRATION 6: Competition
-- ============================================================
create table if not exists public.challenges (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  community_id uuid references public.communities(id),
  type text default 'vocabulary' check (type in ('vocabulary','conversation','streak','quiz')),
  start_date timestamptz,
  end_date timestamptz,
  metrics_json jsonb default '{}',
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists public.challenge_participants (
  challenge_id uuid references public.challenges(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  community_id uuid references public.communities(id),
  score integer default 0,
  rank integer,
  primary key (challenge_id, user_id)
);

alter table public.challenges enable row level security;
create policy "Challenges viewable" on challenges for select using (true);

alter table public.challenge_participants enable row level security;
create policy "Challenge participants viewable" on challenge_participants for select using (true);
create policy "Users join challenges" on challenge_participants for insert with check (auth.uid() = user_id);

-- ============================================================
-- MIGRATION 7: Realtime & Indexes
-- ============================================================
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table community_posts;

create index if not exists idx_messages_conversation on messages(conversation_id, created_at desc);
create index if not exists idx_posts_community on community_posts(community_id, created_at desc);
create index if not exists idx_user_progress on user_progress(user_id);
create index if not exists idx_xp_transactions_user on xp_transactions(user_id, created_at desc);
create index if not exists idx_profiles_xp on profiles(xp desc);
