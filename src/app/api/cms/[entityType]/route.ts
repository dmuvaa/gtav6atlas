import { NextResponse } from "next/server";
import { createCmsRecord } from "@/lib/cms/create-record";
import { CMS_ENTITIES, type CmsEntityKey } from "@/lib/cms/entity-registry";

const KEYS = new Set(Object.keys(CMS_ENTITIES));

export async function POST(
  request: Request,
  context: { params: Promise<{ entityType: string }> },
) {
  const { entityType } = await context.params;
  if (!KEYS.has(entityType)) {
    return NextResponse.json({ error: "Unknown entity type" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = await createCmsRecord(entityType as CmsEntityKey, body);
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