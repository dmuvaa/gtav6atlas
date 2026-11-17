import Image from "next/image";
import Link from "next/link";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { loadCharacterBySlug, loadLocationBySlug } from "@/lib/data";
import { resolveHeroImage } from "@/lib/media/resolve-hero-image";

const featured = [
  { type: "Character", slug: "lucia", path: "/characters/lucia" },
  { type: "Character", slug: "jason", path: "/characters/jason" },
  { type: "Location", slug: "vice-city", path: "/locations/vice-city" },
  { type: "Location", slug: "leonida", path: "/locations/leonida" },
] as const;

export async function FeaturedEntities() {
  const cards = (
    await Promise.all(
      featured.map(async (f) => {
        const entity =
          f.type === "Character"
            ? await loadCharacterBySlug(f.slug)
            : await loadLocationBySlug(f.slug);
        if (!entity) return null;
        return { ...f, entity };
      }),
    )
  ).filter(Boolean) as {
    type: string;
    path: string;
    entity: {
      name: string;
      description: string;
      verificationStatus: import("@/lib/types").VerificationStatus;
      heroImage?: string;
    };
  }[];

  return (
    <ul className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
      {cards.map((c) => {
        const imageSrc = resolveHeroImage(c.entity.heroImage);
        return (
          <li key={c.path} className="w-[min(100%,300px)] shrink-0 snap-start">
            <Link
              href={c.path}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-sm transition-all hover:border-vi-pink/45 hover:shadow-[0_0_32px_-8px_rgba(255,45,149,0.4)]"
            >
              {imageSrc ? (
                <div className="relative aspect-[16/10] w-full border-b border-border/80">
                  <Image
                    src={imageSrc}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="300px"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col p-5">
                <span className="text-xs font-medium text-vi-pink-bright">
                  {c.type}
                </span>
                <h3 className="mt-2 font-display text-xl text-foreground group-hover:text-vi-pink-bright">
                  {c.entity.name}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted">
                  {c.entity.description}
                </p>
                <div className="mt-4">
                  <VerificationBadge status={c.entity.verificationStatus} />
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}