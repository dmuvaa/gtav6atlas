import { ROCKSTAR_VI_EDITIONS_URL } from "@/lib/media/editions";

export function OfficialMediaNotice({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-muted ${className}`}>
      Screenshots and key art are © Take-Two Interactive / Rockstar Games, shown
      for reference on this independent fan site. Source:{" "}
      <a
        href={ROCKSTAR_VI_EDITIONS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-vi-pink-bright underline underline-offset-2"
      >
        Rockstar — GTA VI editions
      </a>
      . GTA6AtlasHQ is not affiliated with or endorsed by Rockstar Games.
    </p>
  );
}