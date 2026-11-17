import { NextResponse } from "next/server";
import { z } from "zod";
import { roleMeetsMinimum, type UserRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(8000),
  category: z.string().min(1).max(80),
  evidenceUrl: z.string().url().optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 },
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = (profile?.role ?? "registered_user") as UserRole;
  if (!roleMeetsMinimum(role, "contributor")) {
    return NextResponse.json({ error: "Contributor role required" }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const { error } = await supabase.from("submissions").insert({
    user_id: user.id,
    title: parsed.data.title,
    description: parsed.data.description,
    category: parsed.data.category,
    evidence_url: parsed.data.evidenceUrl ?? null,
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}