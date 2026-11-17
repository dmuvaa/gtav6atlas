"use client";

import { FormEvent, useState } from "react";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subscriptionType: "leonida_intel" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Subscription failed");
      setStatus("success");
      setMessage("Check your inbox to confirm your subscription.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={compact ? "flex flex-col gap-3 sm:flex-row" : "space-y-4"}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className={`rounded-xl border border-border bg-background px-4 text-foreground placeholder:text-muted ${
          compact ? "h-11 min-w-0 flex-1" : "h-12 w-full"
        }`}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary h-11 shrink-0 rounded-xl px-5 text-sm disabled:opacity-50 sm:h-12"
      >
        {status === "loading" ? "Subscribing…" : "Subscribe"}
      </button>
      {message ? (
        <p
          role="status"
          className={`text-sm ${status === "error" ? "text-error" : "text-success"} ${compact ? "sm:basis-full" : ""}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}