import {
  USER_ROLES,
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
  type UserRole,
} from "@/lib/auth/roles";
import { RoleBadge } from "@/components/dashboard/RoleBadge";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Roles",
  description: "Role reference",
  path: "/admin/roles",
  noIndex: true,
});

const PERMISSIONS: { action: string; minimum: UserRole }[] = [
  { action: "Sign in & edit own profile", minimum: "registered_user" },
  { action: "Track personal progress", minimum: "registered_user" },
  { action: "Submit discoveries / corrections", minimum: "contributor" },
  { action: "Review submissions", minimum: "moderator" },
  { action: "Publish articles & entity updates", minimum: "editor" },
  { action: "Full admin console access", minimum: "administrator" },
];

export default function AdminRolesPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl text-foreground">Roles</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Hierarchical access for the atlas and staff console. Role assignments are
          handled by site administrators outside this app.
        </p>
      </header>

      <ul className="space-y-4">
        {USER_ROLES.map((role) => (
          <li
            key={role}
            className="rounded-2xl border border-border bg-card/60 p-5"
          >
            <div className="flex flex-wrap items-center gap-3">
              <RoleBadge role={role} />
              <span className="font-display text-foreground">
                {ROLE_LABELS[role]}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">{ROLE_DESCRIPTIONS[role]}</p>
          </li>
        ))}
      </ul>

      <section>
        <h2 className="font-display text-lg text-foreground">Permission matrix</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead className="border-b border-border bg-surface/80">
              <tr>
                <th className="px-4 py-3 font-mono text-xs uppercase text-muted">
                  Action
                </th>
                <th className="px-4 py-3 font-mono text-xs uppercase text-muted">
                  Minimum role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PERMISSIONS.map((p) => (
                <tr key={p.action}>
                  <td className="px-4 py-3 text-foreground">{p.action}</td>
                  <td className="px-4 py-3">
                    <RoleBadge role={p.minimum} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}