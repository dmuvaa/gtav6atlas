import Link from "next/link";
import { HeroOrbit } from "@/components/home/HeroOrbit";
import { SearchField } from "@/components/search/SearchField";
import { Container } from "@/components/ui/Container";

export function InteractiveHero() {
  return (
    <section className="relative overflow-hidden border-b border-vi-pink/20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(255,45,149,0.15),transparent)]"
        aria-hidden
      />

      <Container className="relative grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="font-mono text-xs tracking-widest text-vi-pink-bright">
            Verified · Searchable · Source-linked
          </p>
          <h1 className="mt-4 font-display text-4xl font-medium leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
            The structured{" "}
            <span className="text-gradient-vi">GTA VI</span> atlas
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted leading-relaxed">
            Entity databases, verification labels and cross-linked search — built
            to beat news listicles for players, creators and researchers.
          </p>
          <div className="mt-8 max-w-xl">
            <SearchField size="large" showPopular />
            <p className="mt-2 text-xs text-muted">
              Press <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-vi-pink-bright">/</kbd> anywhere to jump to search
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/characters" className="btn-primary rounded-xl px-5 py-3 text-sm">
              Characters
            </Link>
            <Link href="/locations" className="btn-ghost rounded-xl px-5 py-3 text-sm">
              Locations
            </Link>
            <Link href="/editions" className="text-sm font-semibold text-vi-pink-bright hover:text-foreground">
              Edition gallery
            </Link>
          </div>
          <ul className="mt-8 grid gap-2 text-sm text-muted sm:grid-cols-3">
            <li className="rounded-lg border border-border/80 bg-card/40 px-3 py-2">
              <span className="font-semibold text-foreground">84+</span> reference stills
            </li>
            <li className="rounded-lg border border-border/80 bg-card/40 px-3 py-2">
              <span className="font-semibold text-foreground">5</span> verification tiers
            </li>
            <li className="rounded-lg border border-border/80 bg-card/40 px-3 py-2">
              <span className="font-semibold text-foreground">Global</span> entity search
            </li>
          </ul>
        </div>

        <HeroOrbit />
      </Container>
    </section>
  );
}