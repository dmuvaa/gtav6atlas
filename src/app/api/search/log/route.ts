import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  query: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }

  const supabase = await createClient();
  if (supabase) {
    await supabase.from("search_queries").insert({
      query: parsed.data.query.trim().toLowerCase(),
    });
  }

  return NextResponse.json({ ok: true });
}