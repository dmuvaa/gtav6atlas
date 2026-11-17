"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteLogo } from "@/components/layout/SiteLogo";

const ADMIN_NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { href: "/admin/dashboard", label: "Dashboard" },
      { href: "/admin/settings", label: "Settings" },
    ],
  },
  {
    title: "People",
    items: [
      { href: "/admin/users", label: "Users" },
      { href: "/admin/roles", label: "Roles" },
    ],
  },
  {
    title: "Operations",
    items: [
      { href: "/admin/submissions", label: "Submissions" },
      { href: "/admin/newsletter", label: "Newsletter" },
      { href: "/admin/analytics", label: "Search" },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/create", label: "Create" },
      { href: "/admin/maps", label: "Maps" },
      { href: "/admin/characters", label: "Characters" },
      { href: "/admin/locations", label: "Locations" },
      { href: "/admin/vehicles", label: "Vehicles" },
      { href: "/admin/businesses", label: "Businesses" },
      { href: "/admin/discoveries", label: "Discoveries" },
      { href: "/admin/articles", label: "Articles" },
    ],
  },
] as const;

export function AdminShell({
  children,
  staffBar,
}: {
  children: React.ReactNode;
  staffBar?: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
          <SiteLogo />
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Link href="/" className="text-muted hover:text-foreground">
              Public site
            </Link>
            {staffBar}
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl flex-col gap-0 lg:flex-row">
        <nav
          className="flex gap-1 overflow-x-auto border-b border-border px-4 py-3 lg:w-52 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r lg:px-3 lg:py-6"
          aria-label="Admin"
        >
          {ADMIN_NAV_SECTIONS.map((section) => (
            <div key={section.title} className="mb-4 shrink-0 lg:mb-6">
              <p className="hidden px-2 pb-1 font-mono text-[10px] uppercase tracking-widest text-muted lg:block">
                {section.title}
              </p>
              <div className="flex gap-1 lg:flex-col">
                {section.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin/dashboard" &&
                      pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`shrink-0 rounded-lg px-3 py-2 text-sm ${
                        active
                          ? "bg-vi-pink/15 font-medium text-vi-pink-bright"
                          : "text-muted hover:bg-card hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <main className="min-w-0 flex-1 px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}