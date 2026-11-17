import { Suspense } from "react";
import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";
import { STAFF_AUTH_HINT, staffListSubscribers } from "@/lib/admin/staff-queries";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Newsletter",
  description: "Subscriber list",
  path: "/admin/newsletter",
  noIndex: true,
});

type Row = {
  email: string;
  subscription_type: string;
  status: string;
  created_at: string;
};

export default function AdminNewsletterPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <AdminNewsletterContent />
    </Suspense>
  );
}

async function AdminNewsletterContent() {
  const { rows, error } = await staffListSubscribers();

  const columns: DataTableColumn<Row>[] = [
    { key: "email", header: "Email", cell: (r) => r.email },
    { key: "type", header: "List", cell: (r) => r.subscription_type },
    {
      key: "status",
      header: "Status",
      cell: (r) => <span className="capitalize">{r.status}</span>,
    },
    {
      key: "date",
      header: "Subscribed",
      cell: (r) => new Date(r.created_at).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-foreground">Newsletter</h1>
        <p className="mt-2 text-sm text-muted">
          Leonida Intel sign-ups from the public site.
        </p>
      </header>
      {error === "staff_auth" ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-muted">
          {STAFF_AUTH_HINT}
        </p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : null}
      <DataTable columns={columns} rows={rows as Row[]} empty="No subscribers yet." />
    </div>
  );
}