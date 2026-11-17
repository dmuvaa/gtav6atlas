import Image from "next/image";
import Link from "next/link";
import { OfficialMediaNotice } from "@/components/media/OfficialMediaNotice";
import {
  getAllEditionStills,
  ROCKSTAR_VI_EDITIONS_URL,
} from "@/lib/media/editions";

export function EditionGallery({ limit = 6 }: { limit?: number }) {
  const stills = getAllEditionStills().slice(0, limit);

  return (
    <div>
      <ul className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory">
        {stills.map((still) => (
          <li
            key={still.id}
            className="w-[min(88vw,320px)] shrink-0 snap-start sm:w-[280px]"
          >
            <figure className="group overflow-hidden rounded-2xl border border-vi-pink/25 bg-card/80 shadow-[0_0_24px_-12px_rgba(255,45,149,0.4)]">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={still.src}
                  alt={still.title}
                  fill
                  sizes="(max-width: 640px) 88vw, 280px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-vi-pink/10 opacity-80" />
              </div>
              <figcaption className="space-y-1 p-4">
                <h3 className="font-display text-sm leading-snug text-foreground">
                  {still.title}
                </h3>
                <p className="text-xs text-muted line-clamp-2">{still.caption}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <OfficialMediaNotice className="max-w-2xl" />
        <Link
          href="/editions"
          className="text-sm font-semibold text-vi-pink-bright hover:text-foreground"
        >
          View all edition stills
        </Link>
        <a
          href={ROCKSTAR_VI_EDITIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-muted hover:text-vi-pink-bright"
        >
          On Rockstar.com
        </a>
      </div>
    </div>
  );
}