import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/content/ArticleBody";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { getArticleBySlug, getNews } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return getNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || article.category !== "news") return {};
  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/news/${article.slug}`,
  });
}

export default async function NewsArticlePage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || article.category !== "news") notFound();

  return (
    <Container className="py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "News", href: "/news" },
          { label: article.title },
        ]}
      />
      <PageHeader
        title={article.title}
        description={article.excerpt}
        badges={<VerificationBadge status={article.verificationStatus} />}
      />
      <p className="mb-8 text-sm text-muted">
        {article.author} ·{" "}
        <time dateTime={article.publishedAt}>{article.publishedAt}</time>
      </p>
      <ArticleBody content={article.content} />
    </Container>
  );
}