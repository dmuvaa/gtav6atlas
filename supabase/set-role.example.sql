-- Step 2 (after install): set a user's role manually
-- Prerequisite: run supabase/roles-minimal.sql (or install-continue.sql)
-- User must have signed up once so a profiles row exists.
--
-- Replace the email and role. Allowed roles:
--   registered_user | contributor | moderator | editor | administrator

update public.profiles
set
  role = 'administrator'::public.user_role,
  updated_at = now()
where email = 'your-email@example.com';

-- Optional: confirm
select id, email, display_name, role, created_at
from public.profiles
where email = 'your-email@example.com';