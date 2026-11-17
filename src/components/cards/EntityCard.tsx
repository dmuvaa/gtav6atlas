import Image from "next/image";
import Link from "next/link";
import type { VerificationStatus } from "@/lib/types";
import { VerificationBadge } from "@/components/ui/VerificationBadge";

export function EntityCard({
  href,
  title,
  description,
  meta,
  verificationStatus,
  imageSrc,
}: {
  href: string;
  title: string;
  description: string;
  meta?: string;
  verificationStatus: VerificationStatus;
  imageSrc?: string;
}) {
  return (
    <Link
      href={href}
      className="card-leonida group flex h-full flex-col overflow-hidden rounded-2xl border border-border transition-all hover:border-accent/30 hover:shadow-[0_0_28px_-10px_rgba(255,77,166,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vi-pink-bright"
    >
      {imageSrc ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border/80 bg-elevated">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent"
            aria-hidden
          />
        </div>
      ) : (
        <div
          className="aspect-[16/10] w-full border-b border-border/80 bg-gradient-to-br from-vi-pink/15 via-card to-surface"
          aria-hidden
        />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <VerificationBadge status={verificationStatus} />
          {meta ? (
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
              {meta}
            </span>
          ) : null}
        </div>
        <h2 className="font-display text-xl text-foreground group-hover:text-vi-pink-bright">
          {title}
        </h2>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted leading-relaxed">
          {description}
        </p>
        <span className="mt-4 text-sm font-semibold text-vi-pink-bright group-hover:text-foreground">
          View profile →
        </span>
      </div>
    </Link>
  );
}