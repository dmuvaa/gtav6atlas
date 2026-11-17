import { Suspense } from "react";
import { AdminEntityTable } from "@/components/admin/AdminEntityTable";
import { staffListCmsEntities } from "@/lib/admin/cms-list";
import type { CmsEntityKey } from "@/lib/cms/entity-registry";

export function AdminCmsListPageWithSuspense({
  entityKey,
  title,
}: {
  entityKey: CmsEntityKey;
  title: string;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading records…</p>}>
      <AdminCmsListPage entityKey={entityKey} title={title} />
    </Suspense>
  );
}

export async function AdminCmsListPage({
  entityKey,
  title,
}: {
  entityKey: CmsEntityKey;
  title: string;
}) {
  const { rows, error } = await staffListCmsEntities(entityKey);
  return (
    <AdminEntityTable
      title={title}
      rows={rows}
      createHref={`/admin/create/${entityKey}`}
      error={error}
    />
  );
}