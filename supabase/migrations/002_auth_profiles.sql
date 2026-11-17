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

create policy "Users read own profile"
  on profiles for select
  using (auth.uid() = id);

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

create policy "Users manage own progress"
  on user_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Authenticated users insert submissions"
  on submissions for insert
  with check (auth.uid() = user_id);

create policy "Users read own submissions"
  on submissions for select
  using (auth.uid() = user_id);