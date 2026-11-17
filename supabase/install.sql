-- GTA6AtlasHQ — full install (fresh project only)
-- If you see verification_status already exists: do NOT use this file. Run roles-minimal.sql or install-continue.sql instead.

-- GTA6AtlasHQ initial schema (PRD §11.3)

create extension if not exists "pgcrypto";

do $enum$ begin
  create type verification_status as enum ('officially_confirmed', 'reported', 'community_discovery', 'speculation', 'unverified');
exception when duplicate_object then null;
end $enum$;

do $enum$ begin
  create type moderation_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null;
end $enum$;

create table if not exists characters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  aliases text[] default '{}',
  category text,
  verification_status verification_status not null default 'unverified',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  location_type text not null,
  region text,
  latitude double precision,
  longitude double precision,
  coordinate_precision text,
  verification_status verification_status not null default 'unverified',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  manufacturer text,
  vehicle_category text not null,
  verification_status verification_status not null default 'unverified',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  business_category text not null,
  location_id uuid references locations(id) on delete set null,
  verification_status verification_status not null default 'unverified',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  parent_id uuid references categories(id) on delete set null
);

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  category_id uuid references categories(id) on delete set null,
  author_id uuid,
  status text not null default 'draft',
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  seo_title text,
  seo_description text
);

create table if not exists discoveries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  category text not null,
  location_id uuid references locations(id) on delete set null,
  submitted_by uuid,
  verification_status verification_status not null default 'unverified',
  moderation_status moderation_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  publisher text,
  source_type text,
  publication_date date,
  accessed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists entity_sources (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  source_id uuid not null references sources(id) on delete cascade,
  supporting_notes text
);

create table if not exists entity_relationships (
  id uuid primary key default gen_random_uuid(),
  source_entity_type text not null,
  source_entity_id uuid not null,
  target_entity_type text not null,
  target_entity_id uuid not null,
  relationship_type text not null
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscription_type text not null default 'leonida_intel',
  consent_at timestamptz not null default now(),
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists search_queries (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  created_at timestamptz not null default now()
);

create table if not exists user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  entity_type text not null,
  entity_id uuid not null,
  completed boolean not null default false,
  notes text,
  updated_at timestamptz not null default now()
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  title text not null,
  description text not null,
  category text not null,
  evidence_url text,
  status moderation_status not null default 'pending',
  moderator_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists characters_name_idx on characters (name);
create index if not exists locations_name_idx on locations (name);
create index if not exists vehicles_name_idx on vehicles (name);
create index if not exists businesses_name_idx on businesses (name);
create index if not exists articles_slug_idx on articles (slug);
create index if not exists search_queries_query_idx on search_queries (query);

alter table newsletter_subscribers enable row level security;
alter table user_progress enable row level security;
alter table submissions enable row level security;

drop policy if exists "Public read published characters" on characters;
create policy "Public read published characters"
  on characters for select
  using (published = true);

drop policy if exists "Newsletter insert" on newsletter_subscribers;
create policy "Newsletter insert"
  on newsletter_subscribers for insert
  with check (true);
-- Auth helpers: profiles linked to Supabase Auth users (PRD §7)

do $enum$ begin
  create type public.user_role as enum (
    'registered_user',
    'contributor',
    'moderator',
    'editor',
    'administrator'
  );
exception when duplicate_object then null;
end $enum$;

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  role public.user_role not null default 'registered_user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

drop policy if exists "Users read own profile" on profiles;
create policy "Users read own profile"
  on profiles for select
  using (auth.uid() = id);

drop policy if exists "Users update own profile" on profiles;
create policy "Users update own profile"
  on profiles for update
  using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table user_progress
  drop constraint if exists user_progress_user_id_fkey;
alter table user_progress
  add constraint user_progress_user_id_fkey
  foreign key (user_id) references auth.users (id) on delete cascade;

drop policy if exists "Users manage own progress" on user_progress;
create policy "Users manage own progress"
  on user_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Authenticated users insert submissions" on submissions;
create policy "Authenticated users insert submissions"
  on submissions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users read own submissions" on submissions;
create policy "Users read own submissions"
  on submissions for select
  using (auth.uid() = user_id);
-- Staff RLS: role-aware reads/writes without service role for signed-in staff

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role::text from public.profiles where id = auth.uid();
$$;

drop policy if exists "Staff read all profiles" on profiles;
create policy "Staff read all profiles"
  on profiles for select
  using (
    public.current_user_role() in ('moderator', 'editor', 'administrator')
    or auth.uid() = id
  );

drop policy if exists "Administrators update roles" on profiles;
create policy "Administrators update roles"
  on profiles for update
  using (public.current_user_role() = 'administrator')
  with check (public.current_user_role() = 'administrator');

drop policy if exists "Staff read submissions" on submissions;
create policy "Staff read submissions"
  on submissions for select
  using (
    auth.uid() = user_id
    or public.current_user_role() in ('moderator', 'editor', 'administrator')
  );

drop policy if exists "Staff update submissions" on submissions;
create policy "Staff update submissions"
  on submissions for update
  using (public.current_user_role() in ('moderator', 'editor', 'administrator'));

drop policy if exists "Staff read search analytics" on search_queries;
create policy "Staff read search analytics"
  on search_queries for select
  using (public.current_user_role() in ('editor', 'administrator'));

drop policy if exists "Staff read newsletter" on newsletter_subscribers;
create policy "Staff read newsletter"
  on newsletter_subscribers for select
  using (public.current_user_role() in ('editor', 'administrator'));
