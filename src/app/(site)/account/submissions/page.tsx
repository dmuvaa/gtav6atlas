import { SubmissionForm } from "@/components/account/SubmissionForm";
import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { roleMeetsMinimum, type UserRole } from "@/lib/auth/roles";
import { getSessionProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Submissions",
  description: "Submit GTA VI discoveries",
  path: "/account/submissions",
  noIndex: true,
});

type SubmissionRow = {
  title: string;
  category: string;
  status: string;
  created_at: string;
};

export default async function AccountSubmissionsPage() {
  const session = await getSessionProfile();
  const role = (session?.profile?.role ?? "registered_user") as UserRole;
  const canSubmit = roleMeetsMinimum(role, "contributor");

  let rows: SubmissionRow[] = [];
  const supabase = await createClient();
  if (supabase && session) {
    const { data } = await supabase
      .from("submissions")
      .select("title, category, status, created_at")
      .eq("user_id", session.userId)
      .order("created_at", { ascending: false })
      .limit(20);
    rows = data ?? [];
  }

  const columns: DataTableColumn<SubmissionRow>[] = [
    {
      key: "title",
      header: "Title",
      cell: (r) => <span className="text-foreground">{r.title}</span>,
    },
    {
      key: "category",
      header: "Category",
      cell: (r) => <span className="text-muted">{r.category}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => (
        <span className="capitalize text-vi-pink-bright">{r.status}</span>
      ),
    },
    {
      key: "date",
      header: "Submitted",
      cell: (r) => (
        <time className="text-xs text-muted">
          {new Date(r.created_at).toLocaleDateString()}
        </time>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-display text-2xl text-foreground">Submissions</h2>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
          Your role: <RoleBadge role={role} />
        </p>
      </header>

      <SubmissionForm canSubmit={canSubmit} />

      <div>
        <h3 className="font-display text-lg text-foreground">History</h3>
        <div className="mt-4">
          <DataTable columns={columns} rows={rows} empty="No submissions yet." />
        </div>
      </div>
    </div>
  );
}