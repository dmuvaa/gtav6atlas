import type { UserRole } from "./roles";
import { roleMeetsMinimum } from "./roles";

/** Minimum role to open /admin (moderator and above). */
export const ADMIN_CONSOLE_MIN_ROLE: UserRole = "moderator";

export function canAccessAdminConsole(role: UserRole | string | undefined): boolean {
  return roleMeetsMinimum(role, ADMIN_CONSOLE_MIN_ROLE);
}

export function normalizeRole(role: unknown): UserRole | undefined {
  if (typeof role === "string" && role.length > 0) {
    return role as UserRole;
  }
  return undefined;
}