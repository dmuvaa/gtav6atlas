import Image from "next/image";

export function EntityHeroImage({
  src,
  alt,
  priority,
}: {
  src?: string;
  alt: string;
  priority?: boolean;
}) {
  if (!src) return null;

  return (
    <div className="relative mb-8 aspect-[21/9] w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-elevated shadow-[0_0_40px_-12px_rgba(255,77,166,0.25)]">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 896px"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"
        aria-hidden
      />
    </div>
  );
}