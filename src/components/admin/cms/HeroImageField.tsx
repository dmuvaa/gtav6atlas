"use client";

import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKETS } from "@/lib/storage/buckets";
import { entityMediaPath } from "@/lib/storage/paths";
import { resolveHeroImage } from "@/lib/media/resolve-hero-image";
import type { CmsEntityKey } from "@/lib/cms/entity-registry";

export function HeroImageField({
  entityType,
  entitySlug,
  entityId,
  value,
  onChange,
}: {
  entityType: CmsEntityKey;
  entitySlug: string;
  entityId?: string;
  value: string;
  onChange: (path: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState("");
  const preview = resolveHeroImage(value);

  async function upload() {
    if (!file) return;
    const slug = entitySlug.trim() || "draft";
    let supabase;
    try {
      supabase = createClient();
    } catch {
      setStatus("error");
      setError("Upload is temporarily unavailable.");
      return;
    }
    setStatus("uploading");
    setError("");
    const path = entityMediaPath(entityType, slug, file.name);
    const { error: upErr } = await supabase.storage
      .from(STORAGE_BUCKETS.entityMedia)
      .upload(path, file, { upsert: true });
    if (upErr) {
      setStatus("error");
      setError(upErr.message);
      return;
    }
    onChange(path);
    if (entityId) {
      await fetch("/api/cms/media-asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bucket: STORAGE_BUCKETS.entityMedia,
          object_path: path,
          entity_type: entityType,
          entity_id: entityId,
          alt_text: file.name,
          mime_type: file.type,
          byte_size: file.size,
        }),
      });
    }
    setStatus("idle");
    setFile(null);
  }

  return (
    <div className="mt-1 space-y-3 rounded-lg border border-border bg-card/40 p-3">
      {preview ? (
        <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border border-border">
          <Image
            src={preview}
            alt=""
            fill
            className="object-cover"
            sizes="320px"
          />
        </div>
      ) : null}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Storage path or /images/..."
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-xs"
        />
        <button
          type="button"
          disabled={!file || status === "uploading"}
          onClick={upload}
          className="btn-ghost rounded-lg px-3 py-1.5 text-xs"
        >
          {status === "uploading" ? "Uploading…" : "Upload image"}
        </button>
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <p className="text-[10px] text-muted">
        Save a slug first so the hero image stays linked to this entry.
      </p>
    </div>
  );
}