"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKETS } from "@/lib/storage/buckets";
import { entityMediaPath } from "@/lib/storage/paths";
import type { CmsEntityKey } from "@/lib/cms/entity-registry";
import { UPLOAD_UNAVAILABLE_HINT } from "@/lib/ui/copy";

export function MediaUploadPanel({
  entityType,
  entitySlug,
}: {
  entityType: CmsEntityKey;
  entitySlug: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error" | "done">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onUpload() {
    if (!file) return;
    let supabase;
    try {
      supabase = createClient();
    } catch {
      setStatus("error");
      setMessage(UPLOAD_UNAVAILABLE_HINT);
      return;
    }
    setStatus("uploading");
    const path = entityMediaPath(entityType, entitySlug, file.name);
    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.entityMedia)
      .upload(path, file, { upsert: true });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    const reg = await fetch("/api/cms/media-asset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bucket: STORAGE_BUCKETS.entityMedia,
        object_path: path,
        entity_type: entityType,
        alt_text: file.name,
        mime_type: file.type,
        byte_size: file.size,
      }),
    });
    if (!reg.ok) {
      const data = await reg.json().catch(() => ({}));
      setStatus("error");
      setMessage("Upload finished but could not be attached. Try again.");
      return;
    }
    setStatus("done");
    setMessage("Upload complete.");
  }

  return (
    <div className="rounded-xl border border-border bg-card/50 p-4">
      <h3 className="text-sm font-medium text-foreground">Media upload</h3>
      <p className="mt-1 text-xs text-muted">
        Images attach to this entry on the public atlas.
      </p>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mt-3 block text-sm"
      />
      <button
        type="button"
        disabled={!file || status === "uploading"}
        onClick={onUpload}
        className="btn-ghost mt-3 rounded-lg px-4 py-2 text-xs"
      >
        Upload
      </button>
      {message ? (
        <p
          className={`mt-2 text-xs ${status === "error" ? "text-red-400" : "text-vi-pink-bright"}`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}