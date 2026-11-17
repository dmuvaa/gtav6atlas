import Link from "next/link";
import { notFound } from "next/navigation";
import { EntityForm } from "@/components/admin/cms/EntityForm";
import {
  CMS_ENTITIES,
  type CmsEntityKey,
} from "@/lib/cms/entity-registry";
import { ROLE_LABELS } from "@/lib/auth/roles";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ entityType: string }> };

export function generateStaticParams() {
  return Object.keys(CMS_ENTITIES).map((entityType) => ({ entityType }));
}

export async function generateMetadata({ params }: Props) {
  const { entityType } = await params;
  const def = CMS_ENTITIES[entityType as CmsEntityKey];
  if (!def) return {};
  return buildMetadata({
    title: `Create ${def.label}`,
    description: `Create ${def.label}`,
    path: `/admin/create/${entityType}`,
    noIndex: true,
  });
}

export default async function AdminCreateEntityPage({ params }: Props) {
  const { entityType } = await params;
  const key = entityType as CmsEntityKey;
  const def = CMS_ENTITIES[key];
  if (!def) notFound();

  return (
    <div className="space-y-8">
      <header>
        <Link href="/admin/create" className="text-xs text-vi-pink-bright hover:underline">
          ← All create types
        </Link>
        <h1 className="mt-2 font-display text-3xl text-foreground">
          New {def.label.toLowerCase()}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Requires {ROLE_LABELS[def.minimumRole]} access or higher.
        </p>
      </header>

      <EntityForm entityKey={key} />
    </div>
  );
}