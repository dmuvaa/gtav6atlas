"use client";

import { useState } from "react";

export function SubmissionForm({ canSubmit }: { canSubmit: boolean }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("discovery");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error" | "saved">(
    "idle",
  );

  if (!canSubmit) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-sm text-muted">
        Contributor access is required to submit evidence. Ask an administrator
        to upgrade your role if you want to submit evidence.
      </p>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    const res = await fetch("/api/account/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim(),
        category,
        evidenceUrl: evidenceUrl.trim() || undefined,
      }),
    });
    if (res.ok) {
      setTitle("");
      setDescription("");
      setEvidenceUrl("");
      setStatus("saved");
      window.setTimeout(() => setStatus("idle"), 2500);
    } else {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-border bg-card p-6"
    >
      <div>
        <label className="text-xs text-muted" htmlFor="sub-title">
          Title
        </label>
        <input
          id="sub-title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-xs text-muted" htmlFor="sub-cat">
          Category
        </label>
        <select
          id="sub-cat"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="discovery">Discovery</option>
          <option value="location">Location</option>
          <option value="vehicle">Vehicle</option>
          <option value="correction">Correction</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-muted" htmlFor="sub-desc">
          Description
        </label>
        <textarea
          id="sub-desc"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-xs text-muted" htmlFor="sub-url">
          Evidence URL (optional)
        </label>
        <input
          id="sub-url"
          type="url"
          value={evidenceUrl}
          onChange={(e) => setEvidenceUrl(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={status === "saving"}
        className="btn-primary rounded-xl px-5 py-2.5 text-sm"
      >
        Submit for review
      </button>
      {status === "saved" ? (
        <p className="text-xs text-vi-pink-bright" role="status">
          Submission received — moderators will review it.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-xs text-red-400" role="status">
          Submission failed.
        </p>
      ) : null}
    </form>
  );
}