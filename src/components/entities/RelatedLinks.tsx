import Link from "next/link";
import type { RelatedLink } from "@/lib/data/relations";

export function RelatedLinks({ links }: { links: RelatedLink[] }) {
  if (!links.length) return null;
  return (
    <section className="mt-10 border-t border-border pt-8">
      <h2 className="font-display text-lg text-foreground">Connected entries</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="flex items-center justify-between rounded-xl border border-border bg-card/60 px-4 py-3 text-sm transition-colors hover:border-vi-pink/40"
            >
              <span className="text-foreground">{l.title}</span>
              <span className="text-xs text-vi-pink-bright">{l.kind}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}