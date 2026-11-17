import Link from "next/link";

export function SectionHeading({
  title,
  description,
  href,
  linkLabel,
}: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-l-2 border-vi-pink pl-4">
      <div>
        <h2 className="font-display text-2xl font-medium tracking-wide text-foreground sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-muted leading-relaxed">{description}</p>
        ) : null}
      </div>
      {href && linkLabel ? (
        <Link
          href={href}
          className="shrink-0 text-sm font-semibold text-vi-pink-bright hover:text-foreground"
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}