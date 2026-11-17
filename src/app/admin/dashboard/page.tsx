import Link from "next/link";
import { Suspense } from "react";
import { DashboardStat } from "@/components/dashboard/DashboardStat";
import { getSessionProfile } from "@/lib/auth/profile";
import { ROLE_LABELS, type UserRole } from "@/lib/auth/roles";
import { STAFF_AUTH_HINT, staffDashboardCounts } from "@/lib/admin/staff-queries";
import {
  loadBusinesses,
  loadCharacters,
  loadDiscoveries,
  loadGuides,
  loadLocations,
  loadNews,
  loadVehicles,
} from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Admin dashboard",
  description: "GTA6AtlasHQ administration",
  path: "/admin/dashboard",
  noIndex: true,
});

const WORKSTREAMS = [
  {
    title: "Moderation",
    description: "Contributor submissions and discovery intake.",
    href: "/admin/submissions",
    cta: "Open queue",
  },
  {
    title: "Audience",
    description: "Newsletter subscribers and logged search queries.",
    href: "/admin/newsletter",
    cta: "Newsletter",
  },
  {
    title: "Content",
    description: "Characters, locations, vehicles, and the rest of the atlas.",
    href: "/admin/characters",
    cta: "Manage content",
  },
  {
    title: "People",
    description: "Registered users and role reference.",
    href: "/admin/users",
    cta: "Users",
  },
];

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading dashboard…</p>}>
      <AdminDashboardContent />
    </Suspense>
  );
}

async function AdminDashboardContent() {
  const session = await getSessionProfile();
  const role = (session?.profile?.role ?? "registered_user") as UserRole;

  const live = await staffDashboardCounts();

  const [characters, locations, vehicles, businesses, discoveries, guides, news] =
    await Promise.all([
      loadCharacters(),
      loadLocations(),
      loadVehicles(),
      loadBusinesses(),
      loadDiscoveries(),
      loadGuides(),
      loadNews(),
    ]);
  const publishedTotal =
    characters.length +
    locations.length +
    vehicles.length +
    businesses.length +
    discoveries.length +
    guides.length +
    news.length;

  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-widest text-vi-pink-bright">
          Command center
        </p>
        <h1 className="mt-1 font-display text-3xl text-foreground">
          Welcome back{session?.profile?.display_name ? `, ${session.profile.display_name}` : ""}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Signed in as <strong className="text-foreground">{session?.email}</strong> ·{" "}
          {ROLE_LABELS[role]}
        </p>
      </header>

      <section>
        <h2 className="font-mono text-xs uppercase tracking-wider text-vi-pink-bright">
          Live signals
        </h2>
        {live.live ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {"profiles" in live && live.profiles != null ? (
              <DashboardStat label="Users" value={live.profiles} />
            ) : null}
            {"subscribers" in live && live.subscribers != null ? (
              <DashboardStat label="Newsletter" value={live.subscribers} />
            ) : null}
            {"submissions" in live && live.submissions != null ? (
              <DashboardStat
                label="Submissions"
                value={live.submissions}
                hint="Pending review in queue"
              />
            ) : null}
            {"searches" in live && live.searches != null ? (
              <DashboardStat label="Search log" value={live.searches} />
            ) : null}
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-6 text-sm text-muted">
            {STAFF_AUTH_HINT}
          </p>
        )}
      </section>

      <section>
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted">
          Published atlas ({publishedTotal} entries)
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardStat label="Characters" value={characters.length} />
          <DashboardStat label="Locations" value={locations.length} />
          <DashboardStat label="Guides + news" value={guides.length + news.length} />
          <DashboardStat label="Discoveries" value={discoveries.length} />
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg text-foreground">Workstreams</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {WORKSTREAMS.map((w) => (
            <Link
              key={w.href}
              href={w.href}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card/60 p-5 transition-colors hover:border-vi-pink/35 hover:bg-card/80"
            >
              <div>
                <h3 className="font-display text-base text-vi-pink-bright">
                  {w.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{w.description}</p>
              </div>
              <span className="mt-4 text-sm font-medium text-foreground group-hover:text-vi-pink-bright">
                {w.cta} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/40 p-5">
          <h3 className="font-display text-base text-foreground">Today</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>· Review pending submissions</li>
            <li>· Review new account signups</li>
            <li>· Cross-check search analytics for content gaps</li>
            <li>
              ·{" "}
              <Link href="/admin/settings" className="text-vi-pink-bright hover:underline">
                Settings
              </Link>{" "}
              — your session
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card/40 p-5">
          <h3 className="font-display text-base text-foreground">Public atlas</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/" className="text-vi-pink-bright hover:underline">
                Homepage
              </Link>
            </li>
            <li>
              <Link href="/search" className="text-vi-pink-bright hover:underline">
                Search
              </Link>
            </li>
            <li>
              <Link href="/sitemap.xml" className="text-vi-pink-bright hover:underline">
                Sitemap
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}