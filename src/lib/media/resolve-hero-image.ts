import { STORAGE_BUCKETS } from "@/lib/storage/buckets";
import { publicStorageUrl } from "@/lib/storage/paths";

/** Site path (`/images/...`) or Supabase Storage object path → URL for `<Image>` / cards. */
export function resolveHeroImage(path?: string | null): string | undefined {
  if (!path) return undefined;
  const trimmed = path.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("/") || trimmed.startsWith("http")) return trimmed;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return undefined;
  return publicStorageUrl(supabaseUrl, STORAGE_BUCKETS.entityMedia, trimmed);
}