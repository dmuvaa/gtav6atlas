"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { OfficialMediaNotice } from "@/components/media/OfficialMediaNotice";
import {
  EDITION_CATEGORIES,
  type EditionCategory,
  getEditionStillsByCategory,
  ROCKSTAR_VI_EDITIONS_URL,
} from "@/lib/media/editions";

export function EditionGrid() {
  const [category, setCategory] = useState<EditionCategory>("All");
  const stills = useMemo(
    () => getEditionStillsByCategory(category),
    [category],
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          <span className="font-semibold text-vi-pink-bright">{stills.length}</span>{" "}
          stills · refreshed from{" "}
          <a
            href={ROCKSTAR_VI_EDITIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-vi-pink-bright underline"
          >
            Rockstar editions
          </a>
        </p>
        <a
          href={ROCKSTAR_VI_EDITIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost rounded-lg px-3 py-1.5 text-xs"
        >
          Open source page
        </a>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {EDITION_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              category === cat
                ? "border-vi-pink bg-vi-pink/20 text-foreground"
                : "border-border text-muted hover:border-vi-pink/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <OfficialMediaNotice className="mb-8" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stills.map((still) => (
          <article
            key={still.id}
            className="group overflow-hidden rounded-xl border border-border bg-card/80"
          >
            <div className="relative aspect-[16/10] bg-elevated">
              <Image
                src={still.src}
                alt={still.title}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
            <div className="p-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-vi-pink-bright">
                {still.category}
              </p>
              <h2 className="mt-1 font-display text-sm leading-snug text-foreground">
                {still.title}
              </h2>
              <p className="mt-1 text-xs text-muted line-clamp-2">
                {still.caption}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}