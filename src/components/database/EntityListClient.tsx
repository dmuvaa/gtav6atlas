"use client";

import { useMemo, useState } from "react";
import { EntityCard } from "@/components/cards/EntityCard";
import type { VerificationStatus } from "@/lib/types";

export type EntityListItem = {
  id: string;
  href: string;
  title: string;
  description: string;
  meta?: string;
  verificationStatus: VerificationStatus;
  imageSrc?: string;
};

export function EntityListClient({
  items,
  searchPlaceholder = "Filter by name…",
}: {
  items: EntityListItem[];
  searchPlaceholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"name" | "verified">("name");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items;
    if (q) {
      list = list.filter((i) =>
        `${i.title} ${i.description} ${i.meta ?? ""}`.toLowerCase().includes(q),
      );
    }
    if (sort === "verified") {
      const order: VerificationStatus[] = [
        "officially_confirmed",
        "reported",
        "community_discovery",
        "speculation",
        "unverified",
      ];
      list = [...list].sort(
        (a, b) =>
          order.indexOf(a.verificationStatus) -
          order.indexOf(b.verificationStatus),
      );
    } else {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [items, query, sort]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-card/80 px-4 text-sm text-foreground"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "name" | "verified")}
          className="h-11 rounded-xl border border-border bg-card/80 px-3 text-sm text-foreground"
        >
          <option value="name">Sort A–Z</option>
          <option value="verified">Sort by verification</option>
        </select>
      </div>
      <p className="mb-4 text-sm text-muted">
        {filtered.length} of {items.length} entries
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <EntityCard
            key={item.id}
            href={item.href}
            title={item.title}
            description={item.description}
            meta={item.meta}
            verificationStatus={item.verificationStatus}
            imageSrc={item.imageSrc}
          />
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-muted">No matches. Try another term.</p>
      ) : null}
    </div>
  );
}