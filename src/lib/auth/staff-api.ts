import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "./profile";
import type { UserRole } from "./roles";
import { roleMeetsMinimum } from "./roles";

export async function requireStaffApi(minimum: UserRole = "moderator") {
  const session = await getSessionProfile();
  if (!session) {
    return {
      error: NextResponse.json({ error: "Sign in required" }, { status: 401 }),
    };
  }
  const role = (session.profile?.role ?? "registered_user") as UserRole;
  if (!roleMeetsMinimum(role, minimum)) {
    return {
      error: NextResponse.json({ error: "Insufficient role" }, { status: 403 }),
    };
  }
  const supabase = await createClient();
  if (!supabase) {
    return {
      error: NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 },
      ),
    };
  }
  return { supabase, session, role };
}