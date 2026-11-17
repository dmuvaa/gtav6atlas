import { revalidatePath, revalidateTag } from "next/cache";
import { ATLAS_PUBLISHED_TAG, atlasEntityTag } from "@/lib/data/cache-tags";
import { CMS_ENTITIES, type CmsEntityKey } from "./entity-registry";

const ENTITY_CACHE_KEY: Partial<Record<CmsEntityKey, string>> = {
  character: "characters",
  location: "locations",
  vehicle: "vehicles",
  business: "businesses",
  discovery: "discoveries",
  article: "articles",
};

const LIST_PATHS: Partial<Record<CmsEntityKey, string>> = {
  character: "/characters",
  location: "/locations",
  vehicle: "/vehicles",
  business: "/businesses",
  discovery: "/discoveries",
  article: "/guides",
};

export function revalidateCmsPublicPaths(
  entityKey: CmsEntityKey,
  slug?: string,
  row?: Record<string, unknown>,
) {
  const def = CMS_ENTITIES[entityKey];
  const cacheProfile = { expire: 0 };
  revalidateTag(ATLAS_PUBLISHED_TAG, cacheProfile);
  const cacheKey = ENTITY_CACHE_KEY[entityKey];
  if (cacheKey) revalidateTag(atlasEntityTag(cacheKey), cacheProfile);
  if (slug && cacheKey) {
    const singular = cacheKey.endsWith("ies")
      ? `${cacheKey.slice(0, -3)}y`
      : cacheKey.endsWith("s")
        ? cacheKey.slice(0, -1)
        : cacheKey;
    revalidateTag(`${singular}:${slug}`, cacheProfile);
  }

  const list = LIST_PATHS[entityKey];
  if (list) revalidatePath(list);
  if (entityKey === "article") revalidatePath("/news");
  revalidatePath("/");
  revalidatePath("/search");

  if (!slug) return;

  if (def.resolvePublicPath && row) {
    const path = def.resolvePublicPath({ ...row, slug });
    if (path) revalidatePath(path);
  } else if (def.publicPath) {
    revalidatePath(def.publicPath(slug));
  }
}