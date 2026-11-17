import { ArticleCard } from "@/components/cards/ArticleCard";
import { Container } from "@/components/ui/Container";
import { PageHeader, Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { loadGuides } from "@/lib/data";
import { resolveHeroImage } from "@/lib/media/resolve-hero-image";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "GTA VI Guides",
  description: "Structured guides and explainers for Grand Theft Auto VI.",
  path: "/guides",
});

export default async function GuidesPage() {
  const guides = await loadGuides();
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
      <PageHeader
        title="Guides"
        description="Educational articles focused on verified facts, gameplay concepts and exploration."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}