import Link from "next/link";
import { DashboardStat } from "@/components/dashboard/DashboardStat";
import { ROLE_DESCRIPTIONS, type UserRole } from "@/lib/auth/roles";
import { getSessionProfile } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Account overview",
  description: "GTA6AtlasHQ account dashboard",
  path: "/account",
  noIndex: true,
});

export default async function AccountOverviewPage() {
  const session = await getSessionProfile();
  const role = (session?.profile?.role ?? "registered_user") as UserRole;

  let progressCount = 0;
  let submissionCount = 0;

  const supabase = await createClient();
  if (supabase && session) {
    const [progress, submissions] = await Promise.all([
      supabase
        .from("user_progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", session.userId),
      supabase
        .from("submissions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", session.userId),
    ]);
    progressCount = progress.count ?? 0;
    submissionCount = submissions.count ?? 0;
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-display text-2xl text-foreground">Overview</h2>
        <p className="mt-1 text-sm text-muted">
          {ROLE_DESCRIPTIONS[role]}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardStat label="Tracked entities" value={progressCount} />
        <DashboardStat label="Your submissions" value={submissionCount} />
        <DashboardStat
          label="Access"
          value={role.replace(/_/g, " ")}
          hint="Managed by administrators"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <QuickLink
          href="/search"
          title="Search atlas"
          body="Characters, locations, guides and news in one index."
        />
        <QuickLink
          href="/account/submissions"
          title="Submit evidence"
          body="Contributors can send discoveries for moderator review."
        />
        <QuickLink
          href="/account/progress"
          title="Progress log"
          body="Mark entities you have researched or completed."
        />
        <QuickLink
          href="/newsletter"
          title="Leonida Intel"
          body="Newsletter for database and platform updates."
        />
      </div>

      <form action="/auth/signout" method="post">
        <button type="submit" className="btn-ghost rounded-xl px-5 py-2.5 text-sm">
          Sign out
        </button>
      </form>
    </div>
  );
}

function QuickLink({
  href,
  title,
  body,
}: {
  href: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-border bg-card/60 p-5 transition-colors hover:border-vi-pink/35"
    >
      <h3 className="font-display text-base text-vi-pink-bright">{title}</h3>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </Link>
  );
}