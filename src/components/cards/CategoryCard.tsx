import Link from "next/link";
import type { CategoryAccent } from "@/lib/theme";
import { CATEGORY_ACCENTS } from "@/lib/theme";

export function CategoryCard({
  href,
  title,
  description,
  accent = "pink",
}: {
  href: string;
  title: string;
  description: string;
  accent?: CategoryAccent;
}) {
  const style = CATEGORY_ACCENTS[accent];
  return (
    <Link
      href={href}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/90 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 ${style.glow}`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${style.border}`}
        aria-hidden
      />
      <h3 className={`font-display text-lg font-medium text-foreground ${style.text} group-hover:text-foreground`}>
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm text-muted leading-relaxed">
        {description}
      </p>
      <span className="mt-5 text-sm font-semibold text-vi-pink-bright group-hover:text-foreground">
        Open directory
      </span>
    </Link>
  );
}