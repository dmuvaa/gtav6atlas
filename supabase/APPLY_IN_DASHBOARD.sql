-- Run once in Supabase → SQL Editor (in order: 001, then 002)
-- Or paste this combined file after reviewing migrations/

\i migrations/001_initial_schema.sql
\i migrations/002_auth_profiles.sql

-- NOTE: \i is for psql CLI. In the SQL Editor, run each file's contents separately:
-- 1. supabase/migrations/001_initial_schema.sql
-- 2. supabase/migrations/002_auth_profiles.sql