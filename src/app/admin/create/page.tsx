import Link from "next/link";
import { CMS_ENTITY_LIST } from "@/lib/cms/entity-registry";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Create content",
  description: "CMS create hub",
  path: "/admin/create",
  noIndex: true,
});

const GROUPS: { title: string; keys: (typeof CMS_ENTITY_LIST)[number]["key"][] }[] = [
  {
    title: "Atlas",
    keys: ["character", "location", "vehicle", "business", "discovery"],
  },
  { title: "Editorial", keys: ["article", "source"] },
  { title: "Maps", keys: ["map-layer", "map-marker"] },
  { title: "Media", keys: ["media-asset"] },
];

export default function AdminCreateHubPage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-3xl text-foreground">Create</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Add new atlas entries, articles, map layers, or media. Published items
          appear on the public site when marked live.
        </p>
      </header>

      {GROUPS.map((group) => (
        <section key={group.title}>
          <h2 className="font-mono text-xs uppercase tracking-wider text-vi-pink-bright">
            {group.title}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.keys.map((key) => {
              const def = CMS_ENTITY_LIST.find((e) => e.key === key)!;
              return (
                <li key={key}>
                  <Link
                    href={`/admin/create/${key}`}
                    className="block rounded-xl border border-border bg-card/60 px-4 py-4 transition-colors hover:border-vi-pink/40"
                  >
                    <span className="font-display text-base text-foreground">
                      {def.label}
                    </span>
                    <span className="mt-1 block text-xs text-muted">
                      New {def.labelPlural.toLowerCase()}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted">
        <strong className="text-foreground">Community submissions</strong> are sent
        from{" "}
        <Link href="/account/submissions" className="text-vi-pink-bright">
          your submissions page
        </Link>
        , then reviewed in the{" "}
        <Link href="/admin/submissions" className="text-vi-pink-bright">
          moderation queue
        </Link>
        .
      </section>
    </div>
  );
}