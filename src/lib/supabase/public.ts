import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Anonymous server client for published, RLS-public reads.
 * Safe in generateStaticParams / build (no `cookies()`).
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key);
}