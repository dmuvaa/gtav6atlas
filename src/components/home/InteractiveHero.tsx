import Link from "next/link";
import { HeroOrbit } from "@/components/home/HeroOrbit";
import { SearchField } from "@/components/search/SearchField";
import { Container } from "@/components/ui/Container";
import { POPULAR_SEARCHES } from "@/lib/constants";

const QUICK_DIRS = [
  { href: "/characters", label: "Characters" },
  { href: "/locations", label: "Locations" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/maps", label: "Maps" },
  { href: "/editions", label: "Editions" },
] as const;

export function InteractiveHero() {
  return (
    <section className="relative overflow-hidden border-b border-vi-pink/15">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_15%_0%,rgba(255,45,149,0.12),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-1/4 h-[32rem] w-[32rem] rounded-full bg-vi-pink/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
        aria-hidden
      />

      <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-20 xl:py-24">
        <div className="max-w-xl lg:max-w-none">
          <div className="hero-eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span className="rounded-full border border-vi-pink/25 bg-vi-pink/10 px-2.5 py-0.5 font-medium text-vi-pink-bright">
              Independent atlas
            </span>
            <span>Verification labels on every entity</span>
          </div>

          <h1 className="hero-title mt-6 text-[2.35rem] leading-[1.06] text-foreground sm:text-5xl lg:text-[3.15rem]">
            The structured atlas for{" "}
            <span className="text-gradient-vi">Grand Theft Auto VI</span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            Characters, Leonida, vehicles, guides and discoveries — linked,
            searchable, and tagged by how sure we are.
          </p>

          <div className="mt-8">
            <SearchField size="large" />
            <p className="mt-2.5 text-xs text-muted">
              <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-vi-pink-bright">
                /
              </kbd>{" "}
              opens search from anywhere
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {POPULAR_SEARCHES.slice(0, 5).map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-border/80 bg-card/50 px-3 py-1 text-xs text-foreground transition-colors hover:border-vi-pink/40 hover:text-vi-pink-bright"
              >
                {term}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Link
              href="/characters"
              className="btn-primary rounded-xl px-5 py-2.5 text-sm"
            >
              Start with characters
            </Link>
            <Link
              href="/search"
              className="btn-ghost rounded-xl px-5 py-2.5 text-sm"
            >
              Search atlas
            </Link>
          </div>

          <nav
            className="mt-6 flex flex-wrap gap-x-1 gap-y-2 text-sm"
            aria-label="Quick directories"
          >
            {QUICK_DIRS.map((item, i) => (
              <span key={item.href} className="inline-flex items-center gap-1">
                {i > 0 ? (
                  <span className="text-border select-none" aria-hidden>
                    ·
                  </span>
                ) : null}
                <Link
                  href={item.href}
                  className="font-medium text-muted hover:text-vi-pink-bright"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>

          <p className="mt-10 border-t border-border/50 pt-6 text-xs leading-relaxed text-muted">
            <span className="font-medium text-foreground">84+</span> edition
            reference stills ·{" "}
            <span className="font-medium text-foreground">5</span> verification
            tiers · cross-linked entity search
          </p>
        </div>

        <div className="lg:justify-self-end lg:pl-4">
          <HeroOrbit />
        </div>
      </Container>
    </section>
  );
}