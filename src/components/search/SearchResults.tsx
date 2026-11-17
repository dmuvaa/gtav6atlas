"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { EntityType } from "@/lib/types";
import { VerificationBadge } from "@/components/ui/VerificationBadge";

const FILTERS: { id: EntityType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "character", label: "Characters" },
  { id: "location", label: "Locations" },
  { id: "vehicle", label: "Vehicles" },
  { id: "business", label: "Businesses" },
  { id: "guide", label: "Guides" },
  { id: "news", label: "News" },
  { id: "discovery", label: "Discoveries" },
];

export function SearchFilters({ active }: { active: EntityType | "all" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  function setFilter(type: EntityType | "all") {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type !== "all") params.set("type", type);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => setFilter(f.id)}
          className={`rounded-full border px-3 py-1 text-sm transition-colors ${
            active === f.id
              ? "border-accent bg-accent/15 text-foreground"
              : "border-border text-muted hover:text-foreground"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

export function SearchResultList({
  results,
  query,
}: {
  results: {
    id: string;
    title: string;
    description: string;
    href: string;
    entityType: EntityType;
    verificationStatus: import("@/lib/types").VerificationStatus;
  }[];
  query: string;
}) {
  if (!query.trim()) {
    return (
      <p className="text-muted">
        Enter a search term to explore characters, locations, vehicles, guides
        and more.
      </p>
    );
  }
  if (results.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-foreground">No results for “{query}”</p>
        <p className="mt-2 text-sm text-muted">
          Try another spelling or browse database categories from the homepage.
        </p>
      </div>
    );
  }
  return (
    <ul className="space-y-4">
      {results.map((r) => (
        <li key={r.id}>
          <Link
            href={r.href}
            className="block rounded-2xl border border-border bg-card p-5 transition-colors hover:border-vi-pink/35"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                {r.entityType.replace("_", " ")}
              </span>
              <VerificationBadge status={r.verificationStatus} />
            </div>
            <h2 className="text-lg font-semibold text-foreground">{r.title}</h2>
            <p className="mt-2 text-sm text-muted line-clamp-2">{r.description}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
