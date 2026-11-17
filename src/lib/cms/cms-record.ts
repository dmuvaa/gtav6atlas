import type { SupabaseClient } from "@supabase/supabase-js";
import { requireStaffApi } from "@/lib/auth/staff-api";
import { roleMeetsMinimum, type UserRole } from "@/lib/auth/roles";
import { STORAGE_BUCKETS } from "@/lib/storage/buckets";
import { CMS_ENTITIES, type CmsEntityKey } from "./entity-registry";

export type CmsMutationResult =
  | { ok: true; id: string; slug?: string; table: string }
  | { ok: false; error: string; status: number };

export async function createCmsRecord(
  entityKey: CmsEntityKey,
  body: unknown,
): Promise<CmsMutationResult> {
  const def = CMS_ENTITIES[entityKey];
  if (!def) return { ok: false, error: "Unknown entity type", status: 404 };

  const staff = await requireStaffApi(def.minimumRole);
  if ("error" in staff && staff.error) {
    return { ok: false, error: "Unauthorized", status: staff.error.status };
  }

  const role = staff.role as UserRole;
  if (!roleMeetsMinimum(role, def.minimumRole)) {
    return { ok: false, error: "Insufficient role", status: 403 };
  }

  const parsed = def.schema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Validation failed",
      status: 400,
    };
  }

  const row = def.toRow(parsed.data as Record<string, unknown>);

  if (entityKey === "media-asset") {
    const {
      data: { user },
    } = await staff.supabase.auth.getUser();
    row.created_by = user?.id ?? null;
  }

  const { data, error } = await staff.supabase
    .from(def.table)
    .insert(row)
    .select("id, slug")
    .single();

  if (error) return { ok: false, error: error.message, status: 500 };

  const slug =
    typeof data.slug === "string"
      ? data.slug
      : typeof row.slug === "string"
        ? row.slug
        : undefined;

  return { ok: true, id: data.id, slug, table: def.table };
}

export async function getCmsRecord(entityKey: CmsEntityKey, id: string) {
  const def = CMS_ENTITIES[entityKey];
  if (!def) return { ok: false as const, error: "Unknown entity", status: 404 };

  const staff = await requireStaffApi(def.minimumRole);
  if ("error" in staff && staff.error) {
    return { ok: false as const, error: "Unauthorized", status: 401 };
  }

  const { data, error } = await staff.supabase
    .from(def.table)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return { ok: false as const, error: error.message, status: 500 };
  if (!data) return { ok: false as const, error: "Not found", status: 404 };

  const values = def.fromRow
    ? def.fromRow(data as Record<string, unknown>)
    : (data as Record<string, unknown>);

  return { ok: true as const, id, values, table: def.table };
}

export async function updateCmsRecord(
  entityKey: CmsEntityKey,
  id: string,
  body: unknown,
): Promise<CmsMutationResult> {
  const def = CMS_ENTITIES[entityKey];
  if (!def) return { ok: false, error: "Unknown entity type", status: 404 };

  const staff = await requireStaffApi(def.minimumRole);
  if ("error" in staff && staff.error) {
    return { ok: false, error: "Unauthorized", status: staff.error.status };
  }

  const parsed = def.schema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Validation failed",
      status: 400,
    };
  }

  const row = def.toRow(parsed.data as Record<string, unknown>);
  row.updated_at = new Date().toISOString();

  const { data, error } = await staff.supabase
    .from(def.table)
    .update(row)
    .eq("id", id)
    .select("id, slug")
    .single();

  if (error) return { ok: false, error: error.message, status: 500 };

  return {
    ok: true,
    id: data.id,
    slug: typeof data.slug === "string" ? data.slug : undefined,
    table: def.table,
  };
}

export async function deleteCmsRecord(
  entityKey: CmsEntityKey,
  id: string,
): Promise<CmsMutationResult> {
  const def = CMS_ENTITIES[entityKey];
  if (!def) return { ok: false, error: "Unknown entity type", status: 404 };

  const staff = await requireStaffApi(def.minimumRole);
  if ("error" in staff && staff.error) {
    return { ok: false, error: "Unauthorized", status: staff.error.status };
  }

  const { data: row, error: loadErr } = await staff.supabase
    .from(def.table)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (loadErr) return { ok: false, error: loadErr.message, status: 500 };
  if (!row) return { ok: false, error: "Not found", status: 404 };

  await staff.supabase.from("entity_sources").delete().eq("entity_id", id);

  const rowRecord = row as Record<string, unknown>;
  const pathsByBucket = new Map<string, string[]>();
  const addPath = (bucket: string, objectPath: string) => {
    if (!objectPath || objectPath.startsWith("/")) return;
    const list = pathsByBucket.get(bucket) ?? [];
    if (!list.includes(objectPath)) list.push(objectPath);
    pathsByBucket.set(bucket, list);
  };

  const hero = rowRecord.hero_image_path ?? rowRecord.storage_path;
  if (typeof hero === "string") {
    const heroBucket =
      entityKey === "map-layer" ? STORAGE_BUCKETS.mapAssets : STORAGE_BUCKETS.entityMedia;
    addPath(heroBucket, hero);
  }

  if (entityKey === "media-asset") {
    const bucket = String(rowRecord.bucket ?? STORAGE_BUCKETS.entityMedia);
    const objectPath = String(rowRecord.object_path ?? "");
    addPath(bucket, objectPath);
  }

  const { data: assets } = await staff.supabase
    .from("media_assets")
    .select("bucket, object_path")
    .eq("entity_id", id);

  for (const asset of assets ?? []) {
    if (asset.object_path && asset.bucket) {
      addPath(asset.bucket, asset.object_path);
    }
  }

  await staff.supabase.from("media_assets").delete().eq("entity_id", id);
  await staff.supabase
    .from("media_assets")
    .delete()
    .eq("id", id);

  for (const [bucket, paths] of pathsByBucket) {
    if (paths.length) {
      await staff.supabase.storage.from(bucket).remove(paths);
    }
  }

  const slug =
    typeof rowRecord.slug === "string" ? rowRecord.slug : undefined;

  const { error } = await staff.supabase.from(def.table).delete().eq("id", id);
  if (error) return { ok: false, error: error.message, status: 500 };

  return { ok: true, id, slug, table: def.table };
}

export async function staffListLocationOptions(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("locations")
    .select("id, name, slug")
    .order("name");
  if (error) return [];
  return data ?? [];
}