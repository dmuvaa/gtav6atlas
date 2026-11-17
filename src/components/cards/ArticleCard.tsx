import Image from "next/image";
import Link from "next/link";

export function ArticleCard({
  href,
  title,
  excerpt,
  category,
  date,
  imageSrc,
}: {
  href: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageSrc?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/90 backdrop-blur-sm transition-all hover:border-vi-pink/40 hover:shadow-[0_0_24px_-8px_rgba(255,45,149,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vi-pink-bright"
    >
      {imageSrc ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border/80">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="h-1 w-full bg-gradient-to-r from-vi-pink-bright via-accent to-vi-pink-deep opacity-70 transition-opacity group-hover:opacity-100" />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 text-xs text-muted">
          <span className="rounded-md border border-vi-pink/25 bg-surface/80 px-2 py-0.5 font-medium text-vi-pink-bright">
            {category}
          </span>
          <time dateTime={date}>
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>
        <h2 className="mt-3 font-display text-lg leading-snug text-foreground group-hover:text-vi-pink-bright">
          {title}
        </h2>
        <p className="mt-2 flex-1 text-sm text-muted line-clamp-3">{excerpt}</p>
      </div>
    </Link>
  );
}