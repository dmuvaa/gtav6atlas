import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";
import { getSessionProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Progress",
  description: "Track entities in GTA6AtlasHQ",
  path: "/account/progress",
  noIndex: true,
});

type ProgressRow = {
  entity_type: string;
  entity_id: string;
  completed: boolean;
  updated_at: string;
};

export default async function AccountProgressPage() {
  const session = await getSessionProfile();
  let rows: ProgressRow[] = [];

  const supabase = await createClient();
  if (supabase && session) {
    const { data } = await supabase
      .from("user_progress")
      .select("entity_type, entity_id, completed, updated_at")
      .eq("user_id", session.userId)
      .order("updated_at", { ascending: false })
      .limit(50);
    rows = data ?? [];
  }

  const columns: DataTableColumn<ProgressRow>[] = [
    {
      key: "type",
      header: "Type",
      cell: (r) => (
        <span className="capitalize text-foreground">{r.entity_type}</span>
      ),
    },
    {
      key: "id",
      header: "Entity",
      cell: (r) => (
        <code className="font-mono text-xs text-muted">{r.entity_id}</code>
      ),
    },
    {
      key: "done",
      header: "Completed",
      cell: (r) => (
        <span className={r.completed ? "text-vi-pink-bright" : "text-muted"}>
          {r.completed ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "updated",
      header: "Updated",
      cell: (r) => (
        <time className="text-xs text-muted">
          {new Date(r.updated_at).toLocaleDateString()}
        </time>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-display text-2xl text-foreground">Progress</h2>
        <p className="mt-1 text-sm text-muted">
          Personal tracking across atlas entities. Progress syncs when{" "}
          <code className="text-xs">user_progress</code> is migrated.
        </p>
      </header>

      <DataTable
        columns={columns}
        rows={rows}
        empty="No progress yet — browse the database and mark entries as you go (API coming next phase)."
      />

      <Link href="/characters" className="text-sm text-vi-pink-bright hover:underline">
        Browse characters →
      </Link>
    </div>
  );
}