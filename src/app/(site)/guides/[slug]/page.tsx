import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/content/ArticleBody";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { getArticleBySlug, getGuides } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || article.category !== "guide") return {};
  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/guides/${article.slug}`,
  });
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || article.category !== "guide") notFound();

  return (
    <Container className="py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Guides", href: "/guides" },
          { label: article.title },
        ]}
      />
      <PageHeader
        title={article.title}
        description={article.excerpt}
        badges={<VerificationBadge status={article.verificationStatus} />}
      />
      <p className="mb-8 text-sm text-muted">
        {article.author} · Published{" "}
        <time dateTime={article.publishedAt}>{article.publishedAt}</time>
        {article.updatedAt !== article.publishedAt
          ? ` · Updated ${article.updatedAt}`
          : ""}
      </p>
      <ArticleBody content={article.content} />
    </Container>
  );
}