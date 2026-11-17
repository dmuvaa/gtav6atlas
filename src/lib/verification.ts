import type { VerificationStatus } from "./types";
import { VERIFICATION_LABELS } from "./constants";

export function verificationLabel(status: VerificationStatus): string {
  return VERIFICATION_LABELS[status];
}

export function verificationTone(
  status: VerificationStatus,
): "success" | "info" | "warning" | "muted" | "danger" {
  switch (status) {
    case "officially_confirmed":
      return "success";
    case "reported":
      return "info";
    case "community_discovery":
      return "warning";
    case "speculation":
      return "muted";
    case "unverified":
      return "danger";
    default:
      return "muted";
  }
}