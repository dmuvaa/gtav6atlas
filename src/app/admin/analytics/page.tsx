import { Suspense } from "react";
import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";
import { STAFF_AUTH_HINT, staffRecentSearches } from "@/lib/admin/staff-queries";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Search analytics",
  description: "Logged queries",
  path: "/admin/analytics",
  noIndex: true,
});

type Row = { query: string; created_at: string };

export default function AdminAnalyticsPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <AdminAnalyticsContent />
    </Suspense>
  );
}

async function AdminAnalyticsContent() {
  const { rows, error } = await staffRecentSearches();

  const columns: DataTableColumn<Row>[] = [
    { key: "query", header: "Query", cell: (r) => r.query },
    {
      key: "date",
      header: "When",
      cell: (r) => new Date(r.created_at).toLocaleString(),
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-foreground">Search analytics</h1>
        <p className="mt-2 text-sm text-muted">
          Recent searches on the public atlas — useful for spotting content gaps.
        </p>
      </header>
      {error === "staff_auth" ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-muted">
          {STAFF_AUTH_HINT}
        </p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : null}
      <DataTable columns={columns} rows={rows as Row[]} empty="No search events logged yet." />
    </div>
  );
}