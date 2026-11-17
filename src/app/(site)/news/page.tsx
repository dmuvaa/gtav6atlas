import { ArticleCard } from "@/components/cards/ArticleCard";
import { Container } from "@/components/ui/Container";
import { PageHeader, Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { loadNews } from "@/lib/data";
import { resolveHeroImage } from "@/lib/media/resolve-hero-image";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "GTA VI News",
  description: "Announcements, platform updates and verified developments for Grand Theft Auto VI.",
  path: "/news",
});

export default async function NewsPage() {
  const news = await loadNews();
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "News" }]} />
      <PageHeader
        title="News"
        description="Original reporting and updates with clear sourcing."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}