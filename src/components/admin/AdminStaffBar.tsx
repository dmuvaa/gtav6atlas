import Link from "next/link";
import { getSessionProfile } from "@/lib/auth/profile";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import type { UserRole } from "@/lib/auth/roles";

export async function AdminStaffBar() {
  const session = await getSessionProfile();
  const role = (session?.profile?.role ?? "registered_user") as UserRole;

  return (
  <div className="flex flex-wrap items-center gap-3 text-sm">
    <span className="text-muted">
      {session?.email ?? "Staff session"}
    </span>
    <RoleBadge role={role} />
    <Link href="/account" className="text-vi-pink-bright hover:underline">
      Account
    </Link>
    <form action="/auth/signout" method="post">
      <button type="submit" className="text-muted hover:text-foreground">
        Sign out
      </button>
    </form>
  </div>
  );
}