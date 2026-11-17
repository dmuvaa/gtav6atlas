import { ProfileSettingsForm } from "@/components/account/ProfileSettingsForm";
import { USER_ROLES, ROLE_LABELS, type UserRole } from "@/lib/auth/roles";
import { getSessionProfile } from "@/lib/auth/profile";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Account settings",
  description: "Profile settings",
  path: "/account/settings",
  noIndex: true,
});

export default async function AccountSettingsPage() {
  const session = await getSessionProfile();
  const role = (session?.profile?.role ?? "registered_user") as UserRole;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-display text-2xl text-foreground">Settings</h2>
        <p className="mt-1 text-sm text-muted">
          Update how you appear on the atlas. Email is tied to your sign-in.
        </p>
      </header>

      <ProfileSettingsForm
        initialDisplayName={session?.profile?.display_name ?? ""}
        email={session?.email}
      />

      <section className="max-w-md rounded-2xl border border-border bg-card/50 p-6">
        <h3 className="text-sm font-medium text-foreground">Access level</h3>
        <p className="mt-1 text-sm text-muted">
          Current: <span className="text-foreground">{ROLE_LABELS[role]}</span>.
          Staff roles are assigned by administrators — not from this screen.
        </p>
        <ul className="mt-4 space-y-1 text-xs text-muted">
          {USER_ROLES.map((r) => (
            <li key={r} className={r === role ? "text-vi-pink-bright" : undefined}>
              {ROLE_LABELS[r]}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}