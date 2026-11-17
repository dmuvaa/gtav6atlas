-- Run in Supabase SQL Editor after roles-minimal.sql (text + CHECK).
-- Supabase Table Editor shows a dropdown for enum columns, not plain text.

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

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  alter column role drop default;

alter table public.profiles
  alter column role type public.user_role
  using role::public.user_role;

alter table public.profiles
  alter column role set default 'registered_user'::public.user_role;

-- Refresh Table Editor: close and reopen the profiles tab if needed.