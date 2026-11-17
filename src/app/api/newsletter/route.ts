import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  email: z.string().email(),
  subscriptionType: z.enum(["leonida_intel", "creator_brief"]).default("leonida_intel"),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  if (supabase) {
    const { error } = await supabase.from("newsletter_subscribers").upsert(
      {
        email: parsed.data.email.toLowerCase(),
        subscription_type: parsed.data.subscriptionType,
        status: "pending",
        consent_at: new Date().toISOString(),
      },
      { onConflict: "email" },
    );
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}