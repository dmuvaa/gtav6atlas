import { CMS_ENTITIES, type CmsEntityKey } from "@/lib/cms/entity-registry";
import { getSessionProfile } from "@/lib/auth/profile";
import { roleMeetsMinimum } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import type { VerificationStatus } from "@/lib/types";

export type CmsAdminRow = {
  id: string;
  slug: string;
  name: string;
  verificationStatus: VerificationStatus;
  published: boolean;
  publicHref?: string;
  editHref: string;
  meta?: string;
  entityKey: CmsEntityKey;
};

export const ADMIN_LIST_ENTITY_KEYS: CmsEntityKey[] = [
  "character",
  "location",
  "vehicle",
  "business",
  "discovery",
  "article",
];

export async function staffListCmsEntities(
  entityKey: CmsEntityKey,
): Promise<{ rows: CmsAdminRow[]; error?: string }> {
  const def = CMS_ENTITIES[entityKey];
  const supabase = await createClient();
  const session = await getSessionProfile();

  if (!supabase || !session) {
    return { rows: [], error: "staff_auth" };
  }
  if (!roleMeetsMinimum(session.profile?.role, "moderator")) {
    return { rows: [], error: "staff_auth" };
  }

  const { data, error } = await supabase
    .from(def.table)
    .select("*")
    .order(
      entityKey === "article"
        ? "updated_at"
        : entityKey === "discovery"
          ? "title"
          : "name",
      { ascending: entityKey !== "article" },
    )
    .limit(500);

  if (error) return { rows: [], error: error.message };

  const rows: CmsAdminRow[] = (data ?? []).map((row) => {
    const r = row as Record<string, unknown>;
    const id = String(r.id);
    const slug = String(r.slug ?? "");
    const name =
      entityKey === "article" || entityKey === "discovery"
        ? String(r.title ?? "")
        : String(r.name ?? r.title ?? "");

    let verificationStatus: VerificationStatus = "unverified";
    if (typeof r.verification_status === "string") {
      verificationStatus = r.verification_status as VerificationStatus;
    } else if (entityKey === "article") {
      verificationStatus = "officially_confirmed";
    }

    const published =
      entityKey === "article"
        ? String(r.status) === "published"
        : Boolean(r.published);

    const publicHref = def.resolvePublicPath
      ? def.resolvePublicPath(r)
      : def.publicPath && slug
        ? def.publicPath(slug)
        : undefined;

    const meta =
      entityKey === "article"
        ? String(r.article_kind ?? "guide")
        : undefined;

    return {
      id,
      slug,
      name,
      verificationStatus,
      published,
      publicHref,
      editHref: `/admin/edit/${entityKey}/${id}`,
      meta,
      entityKey,
    };
  });

  return { rows };
}