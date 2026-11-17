import type { UserRole } from "@/lib/auth/roles";
import { ROLE_LABELS } from "@/lib/auth/roles";

const ROLE_STYLES: Record<UserRole, string> = {
  registered_user: "border-border bg-card text-muted",
  contributor: "border-vi-pink/30 bg-vi-pink/10 text-vi-pink-bright",
  moderator: "border-accent/40 bg-accent/10 text-accent",
  editor: "border-amber-500/40 bg-amber-500/10 text-amber-200",
  administrator: "border-vi-pink-bright/50 bg-vi-pink-deep/20 text-foreground",
};

export function RoleBadge({ role }: { role: UserRole | string }) {
  const key = (role in ROLE_STYLES ? role : "registered_user") as UserRole;
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${ROLE_STYLES[key]}`}
    >
      {ROLE_LABELS[key]}
    </span>
  );
}