import Link from "next/link";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { requireStaffApi } from "@/lib/auth/staff-api";

export const metadata = buildMetadata({
  title: "Maps (admin)",
  description: "Map layers and markers",
  path: "/admin/maps",
  noIndex: true,
});

export default function AdminMapsPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading maps…</p>}>
      <AdminMapsContent />
    </Suspense>
  );
}

async function AdminMapsContent() {
  const staff = await requireStaffApi("editor");
  let layers: { id: string; name: string; slug: string; published: boolean }[] = [];
  if (!("error" in staff && staff.error)) {
    const { data } = await staff.supabase
      .from("map_layers")
      .select("id, name, slug, published")
      .order("sort_order", { ascending: true });
    layers = data ?? [];
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl text-foreground">Maps</h1>
        <p className="mt-2 text-sm text-muted">
          Manage reference layers and markers. Only verified coordinates belong on
          the public map.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/create/map-layer" className="btn-primary rounded-xl px-4 py-2 text-sm">
            New layer
          </Link>
          <Link href="/admin/create/map-marker" className="btn-ghost rounded-xl px-4 py-2 text-sm">
            New marker
          </Link>
        </div>
      </header>

      <section>
        <h2 className="font-display text-lg text-foreground">Layers</h2>
        {layers.length ? (
          <ul className="mt-4 space-y-2">
            {layers.map((l) => (
              <li
                key={l.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm"
              >
                <span className="text-foreground">{l.name}</span>
                <span className="flex items-center gap-3 text-xs text-muted">
                  <span>
                    {l.slug} · {l.published ? "published" : "draft"}
                  </span>
                  <Link
                    href={`/admin/edit/map-layer/${l.id}`}
                    className="text-vi-pink-bright hover:underline"
                  >
                    Edit
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">
            No map layers yet. Create one from the create hub.
          </p>
        )}
      </section>

    </div>
  );
}