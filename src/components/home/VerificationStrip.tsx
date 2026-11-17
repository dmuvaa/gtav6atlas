import { VERIFICATION_LABELS } from "@/lib/constants";
import type { VerificationStatus } from "@/lib/types";

const order: VerificationStatus[] = [
  "officially_confirmed",
  "reported",
  "community_discovery",
  "speculation",
  "unverified",
];

const dots: Record<VerificationStatus, string> = {
  officially_confirmed: "bg-success",
  reported: "bg-vi-pink-bright",
  community_discovery: "bg-warning",
  speculation: "bg-muted",
  unverified: "bg-error",
};

export function VerificationStrip() {
  return (
    <div className="rounded-2xl border border-border bg-surface/80 p-6 backdrop-blur-sm sm:p-8">
      <h2 className="font-display text-xl text-foreground">How we label facts</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Every important claim is tagged so you can separate official material,
        reporting and speculation at a glance.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {order.map((status) => (
          <li
            key={status}
            className="flex items-start gap-3 rounded-xl border border-border/80 bg-card/60 px-3 py-3"
          >
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dots[status]}`}
              aria-hidden
            />
            <span className="text-xs leading-snug text-foreground">
              {VERIFICATION_LABELS[status]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}