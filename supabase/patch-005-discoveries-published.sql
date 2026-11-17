-- If 005 failed on discoveries "published does not exist", run this then re-run 005
-- (or run from line "Discoveries" onward in 005_storage_maps_editor_rls.sql)

alter table public.discoveries
  add column if not exists published boolean not null default false;