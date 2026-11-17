export const USER_ROLES = [
  "registered_user",
  "contributor",
  "moderator",
  "editor",
  "administrator",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_LABELS: Record<UserRole, string> = {
  registered_user: "Registered user",
  contributor: "Contributor",
  moderator: "Moderator",
  editor: "Editor",
  administrator: "Administrator",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  registered_user:
    "Save progress, manage profile, and follow atlas updates.",
  contributor:
    "Submit discoveries and evidence for moderation review.",
  moderator:
    "Review submissions and discovery queue; no schema edits.",
  editor:
    "Publish and update articles, guides, and entity records.",
  administrator:
    "Full access including user roles, newsletter, and settings.",
};

const ROLE_RANK: Record<UserRole, number> = {
  registered_user: 0,
  contributor: 1,
  moderator: 2,
  editor: 3,
  administrator: 4,
};

export function roleMeetsMinimum(
  role: UserRole | string | undefined,
  minimum: UserRole,
): boolean {
  const r = (role ?? "registered_user") as UserRole;
  return ROLE_RANK[r] >= ROLE_RANK[minimum];
}

export function isStaffRole(role: UserRole | string | undefined): boolean {
  return roleMeetsMinimum(role as UserRole, "contributor");
}