import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import {
  mapArticleRow,
  mapBusinessRow,
  mapCharacterRow,
  mapDiscoveryRow,
  mapLocationRow,
  mapVehicleRow,
} from "./supabase-mappers";
import { ATLAS_PUBLISHED_TAG, atlasEntityTag } from "./cache-tags";

export function useSupabaseCms(): boolean {
  return process.env.NEXT_PUBLIC_USE_SUPABASE_CMS === "true";
}

export async function fetchPublishedCharacters() {
  "use cache";
  cacheTag(ATLAS_PUBLISHED_TAG, atlasEntityTag("characters"));
  cacheLife("hours");
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("published", true)
    .order("name");
  if (error) return null;
  return (data ?? []).map((r) => mapCharacterRow(r));
}

export async function fetchCharacterBySlug(slug: string) {
  "use cache";
  cacheTag(ATLAS_PUBLISHED_TAG, atlasEntityTag("characters"), `character:${slug}`);
  cacheLife("hours");
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("characters")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data ? mapCharacterRow(data) : null;
}

export async function fetchPublishedLocations() {
  "use cache";
  cacheTag(ATLAS_PUBLISHED_TAG, atlasEntityTag("locations"));
  cacheLife("hours");
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("published", true)
    .order("name");
  if (error) return null;
  return (data ?? []).map((r) => mapLocationRow(r));
}

export async function fetchLocationBySlug(slug: string) {
  "use cache";
  cacheTag(ATLAS_PUBLISHED_TAG, atlasEntityTag("locations"), `location:${slug}`);
  cacheLife("hours");
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("locations")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data ? mapLocationRow(data) : null;
}

export async function fetchPublishedVehicles() {
  "use cache";
  cacheTag(ATLAS_PUBLISHED_TAG, atlasEntityTag("vehicles"));
  cacheLife("hours");
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("published", true)
    .order("name");
  if (error) return null;
  return (data ?? []).map((r) => mapVehicleRow(r));
}

export async function fetchVehicleBySlug(slug: string) {
  "use cache";
  cacheTag(ATLAS_PUBLISHED_TAG, atlasEntityTag("vehicles"), `vehicle:${slug}`);
  cacheLife("hours");
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("vehicles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data ? mapVehicleRow(data) : null;
}

export async function fetchPublishedBusinesses() {
  "use cache";
  cacheTag(ATLAS_PUBLISHED_TAG, atlasEntityTag("businesses"));
  cacheLife("hours");
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("businesses")
    .select("*, locations(slug)")
    .eq("published", true)
    .order("name");
  if (error) return null;
  return (data ?? []).map((r) => {
    const loc = r.locations as { slug?: string } | null;
    const { locations: _, ...row } = r;
    return mapBusinessRow(row, loc?.slug);
  });
}

export async function fetchPublishedDiscoveries() {
  "use cache";
  cacheTag(ATLAS_PUBLISHED_TAG, atlasEntityTag("discoveries"));
  cacheLife("hours");
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("discoveries")
    .select("*")
    .eq("published", true)
    .order("updated_at", { ascending: false });
  if (error) return null;
  return (data ?? []).map((r) => mapDiscoveryRow(r));
}

export async function fetchPublishedArticles() {
  "use cache";
  cacheTag(ATLAS_PUBLISHED_TAG, atlasEntityTag("articles"));
  cacheLife("hours");
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) return null;
  return (data ?? []).map((r) => mapArticleRow(r));
}

export async function fetchArticleBySlug(slug: string) {
  "use cache";
  cacheTag(ATLAS_PUBLISHED_TAG, atlasEntityTag("articles"), `article:${slug}`);
  cacheLife("hours");
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data ? mapArticleRow(data) : null;
}