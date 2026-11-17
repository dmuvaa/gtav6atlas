import { Suspense } from "react";
import { getSessionProfile } from "@/lib/auth/profile";
import { ROLE_LABELS, type UserRole } from "@/lib/auth/roles";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Admin settings",
  description: "Console configuration",
  path: "/admin/settings",
  noIndex: true,
});

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading settings…</p>}>
      <AdminSettingsContent />
    </Suspense>
  );
}

async function AdminSettingsContent() {
  const session = await getSessionProfile();
  const role = (session?.profile?.role ?? "registered_user") as UserRole;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl text-foreground">Settings</h1>
        <p className="mt-2 text-sm text-muted">
          Your staff session and permissions on the atlas console.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-card/60 p-6">
        <h2 className="font-display text-lg text-foreground">Your session</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="text-muted">Email</dt>
            <dd className="text-foreground">{session?.email ?? "—"}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="text-muted">Role</dt>
            <dd>
              <RoleBadge role={role} />{" "}
              <span className="text-muted">({ROLE_LABELS[role]})</span>
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-muted">
          Need a different role? Contact a site administrator — role changes are
          not made from this screen.
        </p>
      </section>
    </div>
  );
}