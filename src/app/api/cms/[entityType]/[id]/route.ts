import { NextResponse } from "next/server";
import {
  deleteCmsRecord,
  getCmsRecord,
  updateCmsRecord,
} from "@/lib/cms/cms-record";
import { CMS_ENTITIES, type CmsEntityKey } from "@/lib/cms/entity-registry";
import { revalidateCmsPublicPaths } from "@/lib/cms/revalidate-public";

const KEYS = new Set(Object.keys(CMS_ENTITIES));

type RouteContext = { params: Promise<{ entityType: string; id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { entityType, id } = await context.params;
  if (!KEYS.has(entityType)) {
    return NextResponse.json({ error: "Unknown entity type" }, { status: 404 });
  }

  const result = await getCmsRecord(entityType as CmsEntityKey, id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    ok: true,
    id: result.id,
    values: result.values,
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { entityType, id } = await context.params;
  if (!KEYS.has(entityType)) {
    return NextResponse.json({ error: "Unknown entity type" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = await updateCmsRecord(entityType as CmsEntityKey, id, body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const def = CMS_ENTITIES[entityType as CmsEntityKey];
  const bodyObj =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};
  const publicUrl =
    result.slug && def.resolvePublicPath
      ? def.resolvePublicPath({ ...bodyObj, slug: result.slug })
      : result.slug && def.publicPath
        ? def.publicPath(result.slug)
        : undefined;

  return NextResponse.json({
    ok: true,
    id: result.id,
    slug: result.slug,
    publicUrl,
  });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { entityType, id } = await context.params;
  if (!KEYS.has(entityType)) {
    return NextResponse.json({ error: "Unknown entity type" }, { status: 404 });
  }

  const key = entityType as CmsEntityKey;
  const loaded = await getCmsRecord(key, id);
  const row =
    loaded.ok && typeof loaded.values === "object" ? loaded.values : undefined;

  const result = await deleteCmsRecord(key, id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  revalidateCmsPublicPaths(key, result.slug, row);

  return NextResponse.json({ ok: true, id: result.id, slug: result.slug });
}