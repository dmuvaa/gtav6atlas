import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EntityForm } from "@/components/admin/cms/EntityForm";
import { CMS_ENTITIES, type CmsEntityKey } from "@/lib/cms/entity-registry";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ entityType: string; id: string }> };

export const instant = false;

export async function generateMetadata({ params }: Props) {
  const { entityType } = await params;
  const def = CMS_ENTITIES[entityType as CmsEntityKey];
  if (!def) return {};
  return buildMetadata({
    title: `Edit ${def.label}`,
    description: `Edit ${def.label}`,
    path: `/admin/edit/${entityType}`,
    noIndex: true,
  });
}

export default async function AdminEditEntityPage({ params }: Props) {
  const { entityType, id } = await params;
  const key = entityType as CmsEntityKey;
  const def = CMS_ENTITIES[key];
  if (!def) notFound();

  return (
    <div className="space-y-8">
      <header>
        <Link
          href={`/admin/create/${key}`}
          className="text-xs text-vi-pink-bright hover:underline"
        >
          ← Create {def.label.toLowerCase()}
        </Link>
        <h1 className="mt-2 font-display text-3xl text-foreground">
          Edit {def.label.toLowerCase()}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Update fields below and save to publish changes.
        </p>
      </header>
      <Suspense fallback={<p className="text-sm text-muted">Loading form…</p>}>
        <EntityForm entityKey={key} entityId={id} />
      </Suspense>
    </div>
  );
}