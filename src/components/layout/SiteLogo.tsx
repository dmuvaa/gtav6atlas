import Link from "next/link";
import { AtlasLogo } from "@/components/brand/AtlasLogo";

export function SiteLogo({ compact = false }: { compact?: boolean }) {
  const markSize = compact ? 36 : 44;

  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5"
      aria-label="GTA6AtlasHQ home"
    >
      <span className="shrink-0 transition-transform duration-200 group-hover:scale-[1.03]">
        <AtlasLogo size={markSize} />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display font-semibold tracking-wide text-foreground ${compact ? "text-base" : "text-lg sm:text-xl"}`}
        >
          <span className="text-vi-pink-bright">GTA</span>
          <span className="text-foreground">6</span>
        </span>
        <span
          className={`font-sans font-medium tracking-tight text-muted transition-colors group-hover:text-vi-pink-bright ${compact ? "text-[10px]" : "text-xs sm:text-sm"}`}
        >
          AtlasHQ
        </span>
      </span>
    </Link>
  );
}