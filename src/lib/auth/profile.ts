import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "./roles";

export type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export async function getSessionProfile(): Promise<{
  userId: string;
  email: string | undefined;
  profile: Profile | null;
} | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, display_name, role, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  return {
    userId: user.id,
    email: user.email,
    profile: profile as Profile | null,
  };
}