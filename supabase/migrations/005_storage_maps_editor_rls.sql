-- Maps, media registry, storage buckets, editor CMS RLS (publishable key + JWT)

-- ---------- Maps ----------
create table if not exists public.map_layers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  layer_type text not null default 'overlay',
  storage_path text,
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.map_markers (
  id uuid primary key default gen_random_uuid(),
  layer_id uuid references public.map_layers (id) on delete cascade,
  location_id uuid references public.locations (id) on delete set null,
  title text not null,
  description text not null default '',
  latitude double precision,
  longitude double precision,
  coordinate_precision text,
  icon_key text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists map_markers_layer_id_idx on public.map_markers (layer_id);

-- ---------- Media assets (Storage pointers) ----------
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  object_path text not null,
  entity_type text not null,
  entity_id uuid,
  alt_text text,
  mime_type text,
  byte_size bigint,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (bucket, object_path)
);

create index if not exists media_assets_entity_idx
  on public.media_assets (entity_type, entity_id);

-- Optional: align app "role" with DB for characters
alter table public.characters
  add column if not exists role text;

-- ---------- Staff helpers ----------
create or replace function public.is_editor_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('editor', 'administrator');
$$;

create or replace function public.is_moderator_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('moderator', 'editor', 'administrator');
$$;

-- ---------- RLS: content tables ----------
alter table public.characters enable row level security;
alter table public.locations enable row level security;
alter table public.vehicles enable row level security;
alter table public.businesses enable row level security;
alter table public.discoveries enable row level security;
alter table public.articles enable row level security;
alter table public.sources enable row level security;
alter table public.entity_sources enable row level security;
alter table public.map_layers enable row level security;
alter table public.map_markers enable row level security;
alter table public.media_assets enable row level security;

-- Characters
drop policy if exists "Public read published characters" on public.characters;
create policy "Characters public or staff read"
  on public.characters for select
  using (published = true or public.is_moderator_staff());

drop policy if exists "Characters editor insert" on public.characters;
create policy "Characters editor insert"
  on public.characters for insert
  with check (public.is_editor_staff());

drop policy if exists "Characters editor update" on public.characters;
create policy "Characters editor update"
  on public.characters for update
  using (public.is_editor_staff());

-- Locations
drop policy if exists "Locations public or staff read" on public.locations;
create policy "Locations public or staff read"
  on public.locations for select
  using (published = true or public.is_moderator_staff());

drop policy if exists "Locations editor insert" on public.locations;
create policy "Locations editor insert"
  on public.locations for insert
  with check (public.is_editor_staff());

drop policy if exists "Locations editor update" on public.locations;
create policy "Locations editor update"
  on public.locations for update
  using (public.is_editor_staff());

-- Vehicles
drop policy if exists "Vehicles public or staff read" on public.vehicles;
create policy "Vehicles public or staff read"
  on public.vehicles for select
  using (published = true or public.is_moderator_staff());

drop policy if exists "Vehicles editor insert" on public.vehicles;
create policy "Vehicles editor insert"
  on public.vehicles for insert
  with check (public.is_editor_staff());

drop policy if exists "Vehicles editor update" on public.vehicles;
create policy "Vehicles editor update"
  on public.vehicles for update
  using (public.is_editor_staff());

-- Businesses
drop policy if exists "Businesses public or staff read" on public.businesses;
create policy "Businesses public or staff read"
  on public.businesses for select
  using (published = true or public.is_moderator_staff());

drop policy if exists "Businesses editor insert" on public.businesses;
create policy "Businesses editor insert"
  on public.businesses for insert
  with check (public.is_editor_staff());

drop policy if exists "Businesses editor update" on public.businesses;
create policy "Businesses editor update"
  on public.businesses for update
  using (public.is_editor_staff());

-- Discoveries (001 has moderation_status only — add published before policies)
alter table public.discoveries
  add column if not exists published boolean not null default false;

-- Discoveries
drop policy if exists "Discoveries public or staff read" on public.discoveries;
create policy "Discoveries public or staff read"
  on public.discoveries for select
  using (
    (published = true and moderation_status = 'approved')
    or public.is_moderator_staff()
  );

drop policy if exists "Discoveries editor insert" on public.discoveries;
create policy "Discoveries editor insert"
  on public.discoveries for insert
  with check (public.is_editor_staff());

drop policy if exists "Discoveries editor update" on public.discoveries;
create policy "Discoveries editor update"
  on public.discoveries for update
  using (public.is_editor_staff());

-- Articles (guides/news)
drop policy if exists "Articles public or staff read" on public.articles;
create policy "Articles public or staff read"
  on public.articles for select
  using (status = 'published' or public.is_moderator_staff());

drop policy if exists "Articles editor insert" on public.articles;
create policy "Articles editor insert"
  on public.articles for insert
  with check (public.is_editor_staff());

drop policy if exists "Articles editor update" on public.articles;
create policy "Articles editor update"
  on public.articles for update
  using (public.is_editor_staff());

-- Sources + links
drop policy if exists "Sources public read" on public.sources;
create policy "Sources public read"
  on public.sources for select
  using (true);

drop policy if exists "Sources editor write" on public.sources;
create policy "Sources editor insert"
  on public.sources for insert
  with check (public.is_editor_staff());

drop policy if exists "Sources editor update" on public.sources;
create policy "Sources editor update"
  on public.sources for update
  using (public.is_editor_staff());

drop policy if exists "Entity sources editor" on public.entity_sources;
create policy "Entity sources public read"
  on public.entity_sources for select
  using (true);

create policy "Entity sources editor insert"
  on public.entity_sources for insert
  with check (public.is_editor_staff());

-- Maps
drop policy if exists "Map layers public or staff read" on public.map_layers;
create policy "Map layers public or staff read"
  on public.map_layers for select
  using (published = true or public.is_moderator_staff());

drop policy if exists "Map layers editor insert" on public.map_layers;
create policy "Map layers editor insert"
  on public.map_layers for insert
  with check (public.is_editor_staff());

drop policy if exists "Map layers editor update" on public.map_layers;
create policy "Map layers editor update"
  on public.map_layers for update
  using (public.is_editor_staff());

drop policy if exists "Map markers public or staff read" on public.map_markers;
create policy "Map markers public or staff read"
  on public.map_markers for select
  using (published = true or public.is_moderator_staff());

drop policy if exists "Map markers editor insert" on public.map_markers;
create policy "Map markers editor insert"
  on public.map_markers for insert
  with check (public.is_editor_staff());

drop policy if exists "Map markers editor update" on public.map_markers;
create policy "Map markers editor update"
  on public.map_markers for update
  using (public.is_editor_staff());

-- Media assets
drop policy if exists "Media assets public read" on public.media_assets;
create policy "Media assets public read"
  on public.media_assets for select
  using (true);

drop policy if exists "Media assets editor insert" on public.media_assets;
create policy "Media assets editor insert"
  on public.media_assets for insert
  with check (public.is_editor_staff());

drop policy if exists "Media assets editor update" on public.media_assets;
create policy "Media assets editor update"
  on public.media_assets for update
  using (public.is_editor_staff());

-- Search log (anon + auth insert)
drop policy if exists "Public insert search queries" on public.search_queries;
create policy "Public insert search queries"
  on public.search_queries for insert
  with check (true);

-- ---------- Storage buckets ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'entity-media',
    'entity-media',
    true,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'map-assets',
    'map-assets',
    true,
    20971520,
    array['image/png', 'image/webp', 'application/json']
  ),
  (
    'submission-evidence',
    'submission-evidence',
    false,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  ),
  (
    'avatars',
    'avatars',
    true,
    2097152,
    array['image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage RLS (storage.objects)
drop policy if exists "entity media public read" on storage.objects;
create policy "entity media public read"
  on storage.objects for select
  using (bucket_id = 'entity-media');

drop policy if exists "entity media editor upload" on storage.objects;
create policy "entity media editor upload"
  on storage.objects for insert
  with check (
    bucket_id = 'entity-media'
    and public.is_editor_staff()
  );

drop policy if exists "entity media editor update" on storage.objects;
create policy "entity media editor update"
  on storage.objects for update
  using (bucket_id = 'entity-media' and public.is_editor_staff());

drop policy if exists "map assets public read" on storage.objects;
create policy "map assets public read"
  on storage.objects for select
  using (bucket_id = 'map-assets');

drop policy if exists "map assets editor upload" on storage.objects;
create policy "map assets editor upload"
  on storage.objects for insert
  with check (bucket_id = 'map-assets' and public.is_editor_staff());

drop policy if exists "submission evidence owner upload" on storage.objects;
create policy "submission evidence owner upload"
  on storage.objects for insert
  with check (
    bucket_id = 'submission-evidence'
    and auth.uid() is not null
    and (storage.foldername (name))[1] = auth.uid()::text
  );

drop policy if exists "submission evidence staff read" on storage.objects;
create policy "submission evidence staff read"
  on storage.objects for select
  using (
    bucket_id = 'submission-evidence'
    and (
      (storage.foldername (name))[1] = auth.uid()::text
      or public.is_moderator_staff()
    )
  );

drop policy if exists "avatars public read" on storage.objects;
create policy "avatars public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "avatars owner upload" on storage.objects;
create policy "avatars owner upload"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and (storage.foldername (name))[1] = auth.uid()::text
  );