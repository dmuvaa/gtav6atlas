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

create policy "Staff read all profiles"
  on profiles for select
  using (
    public.current_user_role() in ('moderator', 'editor', 'administrator')
    or auth.uid() = id
  );

create policy "Administrators update roles"
  on profiles for update
  using (public.current_user_role() = 'administrator')
  with check (public.current_user_role() = 'administrator');

create policy "Staff read submissions"
  on submissions for select
  using (
    auth.uid() = user_id
    or public.current_user_role() in ('moderator', 'editor', 'administrator')
  );

create policy "Staff update submissions"
  on submissions for update
  using (public.current_user_role() in ('moderator', 'editor', 'administrator'));

create policy "Staff read search analytics"
  on search_queries for select
  using (public.current_user_role() in ('editor', 'administrator'));

create policy "Staff read newsletter"
  on newsletter_subscribers for select
  using (public.current_user_role() in ('editor', 'administrator'));