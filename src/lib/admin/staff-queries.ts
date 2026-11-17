import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/auth/profile";
import { roleMeetsMinimum, type UserRole } from "@/lib/auth/roles";

export type StaffProfileRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: UserRole;
  created_at: string;
};

/** Staff data via publishable key + user JWT (RLS). No service role. */
async function requireStaff(minimum: UserRole = "moderator") {
  const supabase = await createClient();
  const session = await getSessionProfile();
  if (!supabase || !session) return null;
  const role = (session.profile?.role ?? "registered_user") as UserRole;
  if (!roleMeetsMinimum(role, minimum)) return null;
  return { supabase, role };
}

export async function staffListSubmissions() {
  const ctx = await requireStaff("moderator");
  if (!ctx) return { rows: [], error: "staff_auth" as const };
  const { data, error } = await ctx.supabase
    .from("submissions")
    .select(
      "id, title, description, category, status, created_at, user_id, evidence_url",
    )
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [] };
}

export async function staffListProfiles() {
  const ctx = await requireStaff("moderator");
  if (!ctx) return { rows: [], error: "staff_auth" as const };
  const { data, error } = await ctx.supabase
    .from("profiles")
    .select("id, email, display_name, role, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return { rows: [], error: error.message };
  return { rows: (data ?? []) as StaffProfileRow[] };
}

export async function staffListSubscribers() {
  const ctx = await requireStaff("editor");
  if (!ctx) return { rows: [], error: "staff_auth" as const };
  const { data, error } = await ctx.supabase
    .from("newsletter_subscribers")
    .select("id, email, subscription_type, status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [] };
}

export async function staffRecentSearches() {
  const ctx = await requireStaff("editor");
  if (!ctx) return { rows: [], error: "staff_auth" as const };
  const { data, error } = await ctx.supabase
    .from("search_queries")
    .select("id, query, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return { rows: [], error: error.message };
  return { rows: data ?? [] };
}

export async function staffDashboardCounts() {
  const ctx = await requireStaff("moderator");
  if (!ctx) return { live: false as const, error: "staff_auth" as const };

  const counts = async (table: string) => {
    const { count, error } = await ctx.supabase
      .from(table)
      .select("*", { count: "exact", head: true });
    return error ? null : (count ?? 0);
  };

  const profiles = await counts("profiles");
  const submissions = await counts("submissions");
  let subscribers: number | null = null;
  let searches: number | null = null;
  if (roleMeetsMinimum(ctx.role, "editor")) {
    subscribers = await counts("newsletter_subscribers");
    searches = await counts("search_queries");
  }

  return {
    live: true as const,
    profiles,
    subscribers,
    submissions,
    searches,
  };
}

export { STAFF_ACCESS_HINT as STAFF_AUTH_HINT } from "@/lib/ui/copy";