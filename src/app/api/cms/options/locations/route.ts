import { NextResponse } from "next/server";
import { requireStaffApi } from "@/lib/auth/staff-api";
import { staffListLocationOptions } from "@/lib/cms/cms-record";

export async function GET() {
  const staff = await requireStaffApi("moderator");
  if ("error" in staff && staff.error) {
    return staff.error;
  }

  const locations = await staffListLocationOptions(staff.supabase);
  return NextResponse.json({ locations });
}