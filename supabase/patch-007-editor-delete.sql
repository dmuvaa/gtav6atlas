-- Run if 007 was applied before storage + entity_sources delete policies were added.

create policy "Entity sources editor delete"
  on public.entity_sources for delete
  using (public.is_editor_staff());

create policy "entity media editor delete"
  on storage.objects for delete
  using (bucket_id = 'entity-media' and public.is_editor_staff());

create policy "map assets editor delete"
  on storage.objects for delete
  using (bucket_id = 'map-assets' and public.is_editor_staff());