import { cookies } from "next/headers";

/** Server-only: admin console unlocked via ADMIN_SECRET cookie. */
export async function hasAdminConsoleAccess(): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const store = await cookies();
  return store.get("gta6_admin")?.value === secret;
}

export function verifyAdminSecretFromRequest(
  request: Request,
  cookieHeader?: string,
): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  if (request.headers.get("x-admin-secret") === secret) return true;
  if (!cookieHeader) return false;
  const match = cookieHeader.match(/(?:^|;\s*)gta6_admin=([^;]+)/);
  return match?.[1] === secret;
}