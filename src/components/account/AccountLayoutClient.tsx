"use client";

import { usePathname } from "next/navigation";
import { AccountShell } from "@/components/account/AccountShell";
import type { UserRole } from "@/lib/auth/roles";

export function AccountLayoutClient({
  displayName,
  role,
  children,
}: {
  displayName?: string | null;
  role: UserRole;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <AccountShell activePath={pathname} displayName={displayName} role={role}>
      {children}
    </AccountShell>
  );
}