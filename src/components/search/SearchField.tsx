"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { POPULAR_SEARCHES } from "@/lib/constants";

export function SearchField({
  defaultQuery = "",
  size = "default",
  showPopular = false,
}: {
  defaultQuery?: string;
  size?: "default" | "large";
  showPopular?: boolean;
}) {
  const router = useRouter();
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState(defaultQuery);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
    else router.push("/search");
  }

  const inputClass =
    size === "large"
      ? "h-14 text-base pl-12 pr-4"
      : "h-11 text-sm pl-10 pr-3";

  return (
    <div className="relative w-full">
      <form onSubmit={onSubmit} role="search">
        <label htmlFor="global-search" className="sr-only">
          Search GTA6AtlasHQ
        </label>
        <div className="relative">
          <span
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            aria-hidden
          >
            <SearchIcon />
          </span>
          <input
            id="global-search"
            name="q"
            type="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Search characters, locations, guides…"
            className={`w-full rounded-xl border border-border bg-card/90 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm placeholder:text-muted transition-[border-color,box-shadow] focus:border-vi-pink/70 focus:shadow-[0_0_0_3px_rgba(255,45,149,0.2)] ${inputClass}`}
          />
        </div>
      </form>
      {showPopular && focused && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-border bg-surface p-3 shadow-xl">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
            Popular searches
          </p>
          <ul className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <li key={term}>
                <Link
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="rounded-lg border border-border bg-card px-3 py-1 text-sm text-foreground hover:border-accent/50"
                >
                  {term}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.35-4.35"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}