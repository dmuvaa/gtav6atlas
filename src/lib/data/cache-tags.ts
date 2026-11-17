/** Shared cache tags for published atlas data (`revalidateTag`). */
export const ATLAS_PUBLISHED_TAG = "atlas-published";

export function atlasEntityTag(entity: string) {
  return `atlas-${entity}`;
}