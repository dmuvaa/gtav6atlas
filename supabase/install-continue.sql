-- GTA6AtlasHQ — after 001 (NO enums in this file)
-- Run this when 001 is done. If you only need Table Editor roles, roles-minimal.sql is enough.


-- This file intentionally has no CREATE TYPE statements.

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
