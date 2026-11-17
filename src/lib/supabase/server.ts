import { cookies } from "next/headers";
import { createClient as createUtilsServerClient } from "@/utils/supabase/server";

/** Server Supabase client (null if env is missing). */
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;

  const cookieStore = await cookies();
  return createUtilsServerClient(cookieStore);
}