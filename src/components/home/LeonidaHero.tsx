import Image from "next/image";
import Link from "next/link";
import { SearchField } from "@/components/search/SearchField";
import { Container } from "@/components/ui/Container";

export function LeonidaHero() {
  return (
    <section className="relative overflow-hidden border-b border-vi-pink/20">
      <div className="absolute inset-0" aria-hidden>
        <Image
          src="/images/editions/ultimate-edition.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] sm:object-center"
        />
        <div className="hero-keyart-overlay absolute inset-0" />
      </div>

      <Container className="relative py-16 sm:py-24 lg:py-32">
        <p className="font-mono text-xs tracking-widest text-vi-pink-bright">
          Leonida · Vice City · GTA VI pink & sunset palette
        </p>
        <h1 className="mt-5 max-w-4xl font-display text-4xl font-medium leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
          Explore everything about{" "}
          <span className="text-gradient-vi">Grand Theft Auto VI</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted leading-relaxed sm:text-xl">
          Characters, locations, vehicles, guides and verified discoveries — one
          atlas built for players, researchers and creators.
        </p>
        <div className="mt-10 max-w-2xl">
          <SearchField size="large" showPopular />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/characters" className="btn-primary rounded-xl px-5 py-3 text-sm">
            Browse characters
          </Link>
          <Link href="/locations" className="btn-ghost rounded-xl px-5 py-3 text-sm">
            Explore Leonida
          </Link>
          <Link
            href="/guides/what-we-know-gta-vi-official"
            className="rounded-xl px-5 py-3 text-sm font-medium text-vi-pink-bright hover:text-foreground"
          >
            Start with the overview guide
          </Link>
        </div>
      </Container>

      <ViceSkyline />
    </section>
  );
}

function ViceSkyline() {
  return (
    <svg
      className="pointer-events-none relative h-24 w-full text-elevated sm:h-32"
      viewBox="0 0 1200 120"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="skyline-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,45,149,0.35)" />
          <stop offset="100%" stopColor="rgba(10,5,12,1)" />
        </linearGradient>
      </defs>
      <path
        fill="url(#skyline-fill)"
        d="M0 120 L0 70 L60 70 L60 45 L120 45 L120 75 L180 75 L180 35 L240 35 L240 65 L300 65 L300 90 L380 90 L380 40 L440 40 L440 80 L520 80 L520 100 L600 100 L600 30 L660 30 L660 70 L720 70 L720 95 L800 95 L800 50 L860 50 L860 85 L920 85 L920 110 L1000 110 L1000 55 L1060 55 L1060 80 L1120 80 L1120 60 L1200 60 L1200 120 Z"
      />
    </svg>
  );
}