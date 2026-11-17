import Link from "next/link";
import type { ReactNode } from "react";

export type DashboardNavItem = {
  href: string;
  label: string;
  description?: string;
};

export function DashboardShell({
  title,
  subtitle,
  nav,
  activePath,
  children,
  aside,
}: {
  title: string;
  subtitle?: string;
  nav: DashboardNavItem[];
  activePath: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row lg:px-8">
        <aside className="w-full shrink-0 lg:w-56">
          <div className="rounded-2xl border border-border bg-card/60 p-4 lg:sticky lg:top-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-vi-pink-bright">
              Dashboard
            </p>
            <h1 className="mt-1 font-display text-xl text-foreground">{title}</h1>
            {subtitle ? (
              <p className="mt-1 text-xs text-muted leading-relaxed">{subtitle}</p>
            ) : null}
            {aside ? <div className="mt-4 border-t border-border pt-4">{aside}</div> : null}
            <nav className="mt-6 flex gap-1 overflow-x-auto lg:flex-col" aria-label="Dashboard">
              {nav.map((item) => {
                const active =
                  activePath === item.href ||
                  (item.href.length > 1 &&
                    item.href !== "/account" &&
                    activePath.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`shrink-0 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-vi-pink/15 font-medium text-vi-pink-bright"
                        : "text-muted hover:bg-surface hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}