import Link from "next/link";
import { CmsDeleteButton } from "@/components/admin/cms/CmsDeleteButton";
import { DataTable, type DataTableColumn } from "@/components/dashboard/DataTable";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import type { CmsAdminRow } from "@/lib/admin/cms-list";
import type { CmsEntityKey } from "@/lib/cms/entity-registry";

function listRedirect(entityKey: CmsEntityKey): string {
  const map: Record<CmsEntityKey, string> = {
    character: "/admin/characters",
    location: "/admin/locations",
    vehicle: "/admin/vehicles",
    business: "/admin/businesses",
    discovery: "/admin/discoveries",
    article: "/admin/articles",
    "map-layer": "/admin/maps",
    "map-marker": "/admin/maps",
    source: "/admin/create",
    "media-asset": "/admin/create",
  };
  return map[entityKey];
}

export function AdminEntityTable({
  title,
  rows,
  createHref,
  error,
}: {
  title: string;
  rows: CmsAdminRow[];
  createHref: string;
  error?: string;
}) {
  const columns: DataTableColumn<CmsAdminRow>[] = [
    {
      key: "name",
      header: "Name",
      cell: (r) => (
        <Link
          href={r.editHref}
          className="font-medium text-foreground hover:text-vi-pink-bright"
        >
          {r.name}
        </Link>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      cell: (r) => <code className="font-mono text-xs text-muted">{r.slug}</code>,
    },
    {
      key: "published",
      header: "Live",
      cell: (r) => (
        <span className={r.published ? "text-vi-pink-bright" : "text-muted"}>
          {r.published ? "Yes" : "Draft"}
        </span>
      ),
    },
    {
      key: "verification",
      header: "Verification",
      cell: (r) => <VerificationBadge status={r.verificationStatus} />,
    },
    {
      key: "actions",
      header: "",
      cell: (r) => (
        <div className="flex flex-wrap items-center justify-end gap-3 text-xs">
          <Link href={r.editHref} className="text-vi-pink-bright hover:underline">
            Edit
          </Link>
          {r.publicHref ? (
            <Link href={r.publicHref} className="text-muted hover:text-foreground">
              Public
            </Link>
          ) : null}
          <CmsDeleteButton
            entityKey={r.entityKey}
            entityId={r.id}
            recordName={r.name}
            redirectTo={listRedirect(r.entityKey)}
            compact
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg text-foreground">{title}</h2>
        <Link href={createHref} className="btn-primary rounded-lg px-4 py-2 text-sm">
          New
        </Link>
      </div>
      {error === "staff_auth" ? (
        <p className="mt-2 text-sm text-muted">Sign in with staff access to view records.</p>
      ) : error ? (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      ) : (
        <p className="mt-1 text-sm text-muted">
          {rows.length} {rows.length === 1 ? "entry" : "entries"} (includes drafts).
        </p>
      )}
      <div className="mt-4">
        <DataTable columns={columns} rows={rows} empty="No entries yet." />
      </div>
    </div>
  );
}