import Link from "next/link";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { CategoryCard } from "@/components/cards/CategoryCard";
import { EntityCard } from "@/components/cards/EntityCard";
import { AtlasStats } from "@/components/home/AtlasStats";
import { EditionGallery } from "@/components/home/EditionGallery";
import { FeaturedEntities } from "@/components/home/FeaturedEntities";
import { InteractiveHero } from "@/components/home/InteractiveHero";
import { WhyAtlas } from "@/components/home/WhyAtlas";
import { VerificationStrip } from "@/components/home/VerificationStrip";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DATABASE_CATEGORIES, POPULAR_SEARCHES, SITE_NAME } from "@/lib/constants";
import { resolveHeroImage } from "@/lib/media/resolve-hero-image";
import { loadDiscoveries, loadGuides, loadNews } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: SITE_NAME,
  description:
    "Explore characters, locations, vehicles, guides and verified GTA VI information in one structured atlas.",
  path: "/",
});

export default async function HomePage() {
  const guides = (await loadGuides()).slice(0, 3);
  const news = (await loadNews()).slice(0, 3);
  const discoveries = (await loadDiscoveries()).slice(0, 3);

  return (
    <>
      <InteractiveHero />

      <WhyAtlas />

      <Container className="py-12">
        <AtlasStats />
      </Container>

      <Container className="pb-14">
        <SectionHeading
          title="Featured in Leonida"
          description="Jump into the profiles driving most searches right now."
        />
        <div className="mt-6">
          <FeaturedEntities />
        </div>
      </Container>

      <section className="border-y border-vi-pink/15 bg-surface/40 py-14">
        <Container>
          <SectionHeading
            title="GTA VI — edition visuals"
            description="Pink neon, Vice City nights and Leonida sunsets from Rockstar’s editions page — reference for our atlas theme."
          />
          <div className="mt-8">
            <EditionGallery limit={8} />
          </div>
        </Container>
      </section>

      <section className="border-y border-border/80 bg-surface/50 py-14 backdrop-blur-sm">
        <Container>
          <SectionHeading
            title="Explore the database"
            description="Six core directories — each entity page carries sources and a verification label."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DATABASE_CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.href}
                href={cat.href}
                title={cat.title}
                description={cat.description}
                accent={cat.accent}
              />
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <VerificationStrip />
      </Container>

      <section className="border-y border-border/80 bg-surface/40 py-14">
        <Container>
          <SectionHeading
            title="Interactive map"
            description="Coverage grows only when coordinates and precision are documented — never fabricated."
          />
          <div className="relative mt-8 overflow-hidden rounded-2xl border border-dashed border-vi-pink/35 bg-gradient-to-br from-card via-elevated to-surface p-8 text-center sm:p-14">
            <div
              className="pointer-events-none absolute inset-0 bg-[url('/images/hero-vice-sunset.jpg')] bg-cover bg-center opacity-25"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/80 to-vi-pink/15"
              aria-hidden
            />
            <p className="relative font-display text-2xl text-foreground">
              Leonida map — coming online
            </p>
            <p className="relative mx-auto mt-3 max-w-lg text-muted">
              Until verified placement data is available, use the location
              directory or check map development status.
            </p>
            <div className="relative mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/locations" className="btn-primary rounded-xl px-5 py-2.5 text-sm">
                Location directory
              </Link>
              <Link href="/maps" className="btn-ghost rounded-xl px-5 py-2.5 text-sm">
                Map status
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <SectionHeading title="Latest guides" href="/guides" linkLabel="All guides" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <ArticleCard
              key={g.id}
              href={`/guides/${g.slug}`}
              title={g.title}
              excerpt={g.excerpt}
              category={g.guideCategory ?? "Guide"}
              date={g.publishedAt}
              imageSrc={resolveHeroImage(g.heroImage)}
            />
          ))}
        </div>
      </Container>

      <section className="border-y border-border/80 bg-surface/50 py-14">
        <Container>
          <SectionHeading title="Latest news" href="/news" linkLabel="All news" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((n) => (
              <ArticleCard
                key={n.id}
                href={`/news/${n.slug}`}
                title={n.title}
                excerpt={n.excerpt}
                category="News"
                date={n.publishedAt}
                imageSrc={resolveHeroImage(n.heroImage)}
              />
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <SectionHeading
          title="Latest discoveries"
          href="/discoveries"
          linkLabel="Discovery archive"
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {discoveries.map((d) => (
            <EntityCard
              key={d.id}
              href={`/discoveries/${d.slug}`}
              title={d.name}
              description={d.description}
              meta={d.discoveryCategory}
              verificationStatus={d.verificationStatus}
              imageSrc={resolveHeroImage(d.heroImage)}
            />
          ))}
        </div>
      </Container>

      <section className="border-t border-border bg-gradient-to-r from-surface/80 via-elevated/40 to-surface/80 py-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeading title="Popular searches" />
              <ul className="mt-6 flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <li key={term}>
                    <Link
                      href={`/search?q=${encodeURIComponent(term)}`}
                      className="rounded-full border border-border bg-card/80 px-4 py-2 text-sm text-foreground transition-colors hover:border-accent hover:bg-elevated"
                    >
                      {term}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card/90 p-8 backdrop-blur-sm">
              <h2 className="font-display text-2xl text-foreground">
                Leonida Intel
              </h2>
              <p className="mt-2 text-sm text-muted">
                New database entries, guides and platform updates in your inbox.
              </p>
              <div className="mt-6">
                <NewsletterForm compact />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-12">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-accent/25 bg-gradient-to-br from-card to-elevated p-8 sm:flex-row sm:items-center">
            <div>
              <p className="font-mono text-xs text-vi-pink-bright">For creators</p>
              <h2 className="mt-2 font-display text-xl text-foreground sm:text-2xl">
                Research packs & content intelligence
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted">
                GTA6AtlasHQ sells verified research, scripts and SEO briefs while
                the public databases grow — independent from editorial rankings.
              </p>
            </div>
            <Link
              href="/contact"
              className="btn-ghost shrink-0 rounded-xl px-5 py-3 text-sm"
            >
              Talk to us
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}