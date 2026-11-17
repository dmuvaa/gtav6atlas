"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function AdminLoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });
    if (!res.ok) {
      setError("Invalid secret");
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm text-muted" htmlFor="admin-secret">
        Admin secret
      </label>
      <input
        id="admin-secret"
        type="password"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-foreground"
        required
      />
      {error ? <p className="text-sm text-error">{error}</p> : null}
      <button
        type="submit"
        className="h-11 w-full rounded-xl bg-accent font-semibold text-background"
      >
        Continue
      </button>
    </form>
  );
}