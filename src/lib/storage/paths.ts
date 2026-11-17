import type { StorageBucketId } from "./buckets";

export function entityMediaPath(
  entityType: string,
  entitySlug: string,
  fileName: string,
) {
  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${entityType}/${entitySlug}/${safe}`;
}

export function mapAssetPath(layerSlug: string, fileName: string) {
  return `${layerSlug}/${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
}

export function submissionEvidencePath(userId: string, fileName: string) {
  return `${userId}/${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
}

export function avatarPath(userId: string, fileName: string) {
  return `${userId}/${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
}

export function publicStorageUrl(
  supabaseUrl: string,
  bucket: StorageBucketId,
  objectPath: string,
) {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${objectPath}`;
}