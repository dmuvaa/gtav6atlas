import { Suspense } from "react";
import { SubmissionModerationTable } from "@/components/admin/SubmissionModerationTable";
import { STAFF_AUTH_HINT, staffListSubmissions } from "@/lib/admin/staff-queries";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Submissions",
  description: "Moderation queue",
  path: "/admin/submissions",
  noIndex: true,
});

export default function AdminSubmissionsPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading queue…</p>}>
      <AdminSubmissionsContent />
    </Suspense>
  );
}

async function AdminSubmissionsContent() {
  const { rows, error } = await staffListSubmissions();

  const mapped = rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: String(r.description ?? ""),
    category: r.category,
    status: r.status,
    created_at: r.created_at,
    evidence_url: (r.evidence_url as string | null) ?? null,
  }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-foreground">Submissions</h1>
        <p className="mt-2 text-sm text-muted">
          Community tips and corrections awaiting review.
        </p>
      </header>
      {error === "staff_auth" ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-muted">
          {STAFF_AUTH_HINT}
        </p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : null}
      <SubmissionModerationTable rows={mapped} />
    </div>
  );
}