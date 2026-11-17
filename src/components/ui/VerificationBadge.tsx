import type { VerificationStatus } from "@/lib/types";
import { verificationLabel, verificationTone } from "@/lib/verification";

const toneClasses = {
  success: "border-success/50 bg-success/15 text-success",
  info: "border-vi-pink/40 bg-vi-pink/10 text-vi-pink-bright",
  warning: "border-warning/50 bg-warning/15 text-warning",
  muted: "border-border bg-elevated text-muted",
  danger: "border-error/50 bg-error/15 text-error",
};

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const tone = verificationTone(status);
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${toneClasses[tone]}`}
    >
      {verificationLabel(status)}
    </span>
  );
}