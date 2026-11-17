import Link from "next/link";
import type { ReactNode } from "react";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="text-border">/</span>}
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({
  title,
  description,
  badges,
}: {
  title: string;
  description?: string;
  badges?: ReactNode;
}) {
  return (
    <header className="mb-10 border-b border-border/80 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-display text-3xl font-medium tracking-wide text-foreground sm:text-4xl">
          {title}
        </h1>
        {badges}
      </div>
      {description ? (
        <p className="mt-3 max-w-3xl text-lg text-muted leading-relaxed">
          {description}
        </p>
      ) : null}
    </header>
  );
}
