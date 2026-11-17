import { Suspense } from "react";
import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import {
  STAFF_AUTH_HINT,
  staffListProfiles,
  type StaffProfileRow,
} from "@/lib/admin/staff-queries";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Users",
  description: "User management",
  path: "/admin/users",
  noIndex: true,
});

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading users…</p>}>
      <AdminUsersContent />
    </Suspense>
  );
}

async function AdminUsersContent() {
  const { rows, error } = await staffListProfiles();

  const columns: DataTableColumn<StaffProfileRow>[] = [
    {
      key: "email",
      header: "Email",
      cell: (r) => <span className="text-foreground">{r.email ?? "—"}</span>,
    },
    {
      key: "name",
      header: "Display name",
      cell: (r) => <span className="text-muted">{r.display_name ?? "—"}</span>,
    },
    {
      key: "role",
      header: "Role",
      cell: (r) => <RoleBadge role={r.role} />,
    },
    {
      key: "joined",
      header: "Joined",
      cell: (r) => (
        <time className="text-xs text-muted">
          {new Date(r.created_at).toLocaleDateString()}
        </time>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-foreground">Users</h1>
        <p className="mt-2 text-sm text-muted">
          Registered accounts on the atlas. Roles are read-only here.
        </p>
      </header>
      {error === "staff_auth" ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-muted">
          {STAFF_AUTH_HINT}
        </p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : null}
      <DataTable columns={columns} rows={rows} empty="No users to show yet." />
    </div>
  );
}