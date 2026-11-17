-- Extra columns for seed parity + hero images

alter table public.locations
  add column if not exists real_world_inspiration text;

alter table public.characters
  add column if not exists hero_image_path text;

alter table public.locations
  add column if not exists hero_image_path text;

alter table public.vehicles
  add column if not exists hero_image_path text;

alter table public.businesses
  add column if not exists hero_image_path text;

alter table public.discoveries
  add column if not exists hero_image_path text;

alter table public.articles
  add column if not exists hero_image_path text;

alter table public.articles
  add column if not exists article_kind text not null default 'guide'
    check (article_kind in ('guide', 'news'));

create unique index if not exists sources_url_unique on public.sources (url);