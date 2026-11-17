import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AccountLayoutClient } from "@/components/account/AccountLayoutClient";
import { getSessionProfile } from "@/lib/auth/profile";
import type { UserRole } from "@/lib/auth/roles";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <p className="px-4 py-12 text-muted">Loading account…</p>
      }
    >
      <AccountLayoutGate>{children}</AccountLayoutGate>
    </Suspense>
  );
}

async function AccountLayoutGate({ children }: { children: React.ReactNode }) {
  const session = await getSessionProfile();
  if (!session) {
    redirect("/auth/login?next=/account");
  }

  const role = (session.profile?.role ?? "registered_user") as UserRole;

  return (
    <AccountLayoutClient
      displayName={session.profile?.display_name}
      role={role}
    >
      {children}
    </AccountLayoutClient>
  );
}