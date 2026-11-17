-- Allow editor+ to delete CMS rows (complement 005 update/insert policies).

create policy "Characters editor delete"
  on public.characters for delete
  using (public.is_editor_staff());

create policy "Locations editor delete"
  on public.locations for delete
  using (public.is_editor_staff());

create policy "Vehicles editor delete"
  on public.vehicles for delete
  using (public.is_editor_staff());

create policy "Businesses editor delete"
  on public.businesses for delete
  using (public.is_editor_staff());

create policy "Discoveries editor delete"
  on public.discoveries for delete
  using (public.is_editor_staff());

create policy "Articles editor delete"
  on public.articles for delete
  using (public.is_editor_staff());

create policy "Sources editor delete"
  on public.sources for delete
  using (public.is_editor_staff());

create policy "Map layers editor delete"
  on public.map_layers for delete
  using (public.is_editor_staff());

create policy "Map markers editor delete"
  on public.map_markers for delete
  using (public.is_editor_staff());

create policy "Media assets editor delete"
  on public.media_assets for delete
  using (public.is_editor_staff());

create policy "Entity sources editor delete"
  on public.entity_sources for delete
  using (public.is_editor_staff());

-- Storage object removal when purging entity heroes
create policy "entity media editor delete"
  on storage.objects for delete
  using (bucket_id = 'entity-media' and public.is_editor_staff());

create policy "map assets editor delete"
  on storage.objects for delete
  using (bucket_id = 'map-assets' and public.is_editor_staff());