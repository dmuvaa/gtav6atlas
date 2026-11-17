"use client";

import { useState } from "react";

export function ProfileSettingsForm({
  initialDisplayName,
  email,
}: {
  initialDisplayName: string;
  email?: string;
}) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "saved">(
    "idle",
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: displayName.trim() }),
    });
    setStatus(res.ok ? "saved" : "error");
    if (res.ok) window.setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4 rounded-2xl border border-border bg-card p-6">
      <div>
        <label className="text-xs text-muted" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email ?? ""}
          disabled
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted"
        />
      </div>
      <div>
        <label className="text-xs text-muted" htmlFor="display-name">
          Display name
        </label>
        <input
          id="display-name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          maxLength={80}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
        />
      </div>
      <button
        type="submit"
        disabled={status === "saving" || !displayName.trim()}
        className="btn-primary rounded-xl px-5 py-2.5 text-sm disabled:opacity-50"
      >
        {status === "saving" ? "Saving…" : "Save profile"}
      </button>
      {status === "saved" ? (
        <p className="text-xs text-vi-pink-bright" role="status">
          Profile updated.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-xs text-red-400" role="status">
          Could not save. Try again in a moment.
        </p>
      ) : null}
    </form>
  );
}