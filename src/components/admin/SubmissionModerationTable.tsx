"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type ModerationRow = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
  evidence_url: string | null;
};

export function SubmissionModerationTable({ rows }: { rows: ModerationRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  if (!rows.length) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
        No submissions in the queue.
      </p>
    );
  }

  async function setStatus(id: string, status: "approved" | "rejected" | "pending") {
    setBusyId(id);
    await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    router.refresh();
  }

  return (
    <ul className="space-y-4">
      {rows.map((row) => (
        <li
          key={row.id}
          className="rounded-2xl border border-border bg-card/60 p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-lg text-foreground">{row.title}</h3>
              <p className="mt-1 text-xs text-muted">
                {row.category} · {new Date(row.created_at).toLocaleString()}
              </p>
            </div>
            <span className="rounded-full border border-vi-pink/30 px-2 py-0.5 text-xs capitalize text-vi-pink-bright">
              {row.status}
            </span>
          </div>
          <p className="mt-3 text-sm text-muted leading-relaxed">
            {row.description}
          </p>
          {row.evidence_url ? (
            <a
              href={row.evidence_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-vi-pink-bright hover:underline"
            >
              Evidence link
            </a>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busyId === row.id}
              onClick={() => setStatus(row.id, "approved")}
              className="btn-primary rounded-lg px-4 py-2 text-xs"
            >
              Approve
            </button>
            <button
              type="button"
              disabled={busyId === row.id}
              onClick={() => setStatus(row.id, "rejected")}
              className="btn-ghost rounded-lg px-4 py-2 text-xs"
            >
              Reject
            </button>
            {row.status !== "pending" ? (
              <button
                type="button"
                disabled={busyId === row.id}
                onClick={() => setStatus(row.id, "pending")}
                className="text-xs text-muted hover:text-foreground"
              >
                Mark pending
              </button>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}