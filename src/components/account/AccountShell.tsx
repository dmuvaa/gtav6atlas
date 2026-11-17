import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/DashboardShell";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import Link from "next/link";
import type { UserRole } from "@/lib/auth/roles";
import { isStaffRole } from "@/lib/auth/roles";

const ACCOUNT_NAV: DashboardNavItem[] = [
  { href: "/account", label: "Overview" },
  { href: "/account/progress", label: "Progress" },
  { href: "/account/submissions", label: "Submissions" },
  { href: "/account/settings", label: "Settings" },
];

export function AccountShell({
  activePath,
  displayName,
  role,
  children,
}: {
  activePath: string;
  displayName?: string | null;
  role: UserRole | string;
  children: React.ReactNode;
}) {
  const staff = isStaffRole(role);

  return (
    <DashboardShell
      title="Your atlas"
      subtitle={displayName ?? undefined}
      nav={ACCOUNT_NAV}
      activePath={activePath}
      aside={
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted">Access level</p>
            <div className="mt-1">
              <RoleBadge role={role} />
            </div>
          </div>
          {staff ? (
            <Link
              href="/admin/login"
              className="block rounded-lg border border-vi-pink/30 bg-vi-pink/10 px-3 py-2 text-xs font-medium text-vi-pink-bright hover:bg-vi-pink/15"
            >
              Open admin console →
            </Link>
          ) : null}
        </div>
      }
    >
      {children}
    </DashboardShell>
  );
}