-- GTA6AtlasHQ initial schema (PRD §11.3)

create extension if not exists "pgcrypto";

create type verification_status as enum (
  'officially_confirmed',
  'reported',
  'community_discovery',
  'speculation',
  'unverified'
);

create type moderation_status as enum (
  'pending',
  'approved',
  'rejected'
);

create table characters (
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

create table locations (
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

create table vehicles (
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

create table businesses (
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

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  parent_id uuid references categories(id) on delete set null
);

create table articles (
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

create table discoveries (
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

create table sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  publisher text,
  source_type text,
  publication_date date,
  accessed_at timestamptz,
  created_at timestamptz not null default now()
);

create table entity_sources (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  source_id uuid not null references sources(id) on delete cascade,
  supporting_notes text
);

create table entity_relationships (
  id uuid primary key default gen_random_uuid(),
  source_entity_type text not null,
  source_entity_id uuid not null,
  target_entity_type text not null,
  target_entity_id uuid not null,
  relationship_type text not null
);

create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscription_type text not null default 'leonida_intel',
  consent_at timestamptz not null default now(),
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table search_queries (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  created_at timestamptz not null default now()
);

create table user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  entity_type text not null,
  entity_id uuid not null,
  completed boolean not null default false,
  notes text,
  updated_at timestamptz not null default now()
);

create table submissions (
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

create index characters_name_idx on characters (name);
create index locations_name_idx on locations (name);
create index vehicles_name_idx on vehicles (name);
create index businesses_name_idx on businesses (name);
create index articles_slug_idx on articles (slug);
create index search_queries_query_idx on search_queries (query);

alter table newsletter_subscribers enable row level security;
alter table user_progress enable row level security;
alter table submissions enable row level security;

create policy "Public read published characters"
  on characters for select
  using (published = true);

create policy "Newsletter insert"
  on newsletter_subscribers for insert
  with check (true);