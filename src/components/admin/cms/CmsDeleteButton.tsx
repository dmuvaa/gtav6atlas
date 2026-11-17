"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CmsEntityKey } from "@/lib/cms/entity-registry";
import { DELETE_PERMISSION_HINT } from "@/lib/ui/copy";

export function CmsDeleteButton({
  entityKey,
  entityId,
  recordName,
  redirectTo,
  compact,
}: {
  entityKey: CmsEntityKey;
  entityId: string;
  recordName: string;
  redirectTo: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onDelete() {
    const prompt = `Permanently delete “${recordName}”?\n\nThis removes the entry and any attached media. This cannot be undone.`;
    if (!confirm(prompt)) return;
    setBusy(true);
    setError("");
    const res = await fetch(`/api/cms/${entityKey}/${entityId}`, {
      method: "DELETE",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setBusy(false);
      const msg =
        typeof data.error === "string" ? data.error : "Delete failed";
      setError(
        msg.toLowerCase().includes("policy") || res.status === 403
          ? DELETE_PERMISSION_HINT
          : msg,
      );
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  if (compact) {
    return (
      <span className="inline-flex flex-col items-end gap-1">
        <button
          type="button"
          disabled={busy}
          onClick={onDelete}
          className="text-red-400 hover:underline disabled:opacity-50"
        >
          {busy ? "…" : "Delete"}
        </button>
        {error ? <span className="text-[10px] text-red-400">{error}</span> : null}
      </span>
    );
  }

  return (
    <section className="mt-10 rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
      <h2 className="text-sm font-semibold text-red-300">Delete permanently</h2>
      <p className="mt-2 text-xs text-muted leading-relaxed">
        Removes this entry and any attached images from the atlas. This cannot be
        undone.
      </p>
      {error ? (
        <p className="mt-2 text-xs text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        disabled={busy}
        onClick={onDelete}
        className="mt-4 rounded-xl border border-red-500/50 bg-red-500/15 px-5 py-2.5 text-sm font-medium text-red-200 hover:bg-red-500/25 disabled:opacity-50"
      >
        {busy ? "Deleting…" : "Delete permanently"}
      </button>
    </section>
  );
}