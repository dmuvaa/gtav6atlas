import { notFound } from "next/navigation";
import { RelatedLinks } from "@/components/entities/RelatedLinks";
import { SourceList } from "@/components/entities/SourceList";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { EntityHeroImage } from "@/components/media/EntityHeroImage";
import { loadCharacterBySlug, loadCharacters } from "@/lib/data";
import { resolveHeroImage } from "@/lib/media/resolve-hero-image";
import { getCharacterRelated } from "@/lib/data/relations";
import { SITE_URL } from "@/lib/constants";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return (await loadCharacters()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/characters/[slug]">) {
  const { slug } = await params;
  const character = await loadCharacterBySlug(slug);
  if (!character) return {};
  return buildMetadata({
    title: character.name,
    description: character.description,
    path: `/characters/${character.slug}`,
  });
}

export default async function CharacterPage({ params }: PageProps<"/characters/[slug]">) {
  const { slug } = await params;
  const character = await loadCharacterBySlug(slug);
  if (!character) notFound();

  const jsonLd = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Characters", url: `${SITE_URL}/characters` },
    { name: character.name, url: `${SITE_URL}/characters/${character.slug}` },
  ]);

  return (
    <Container className="py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Characters", href: "/characters" },
          { label: character.name },
        ]}
      />
      <EntityHeroImage
        src={resolveHeroImage(character.heroImage)}
        alt={character.name}
        priority
      />
      <PageHeader
        title={character.name}
        description={character.description}
        badges={<VerificationBadge status={character.verificationStatus} />}
      />
      <dl className="grid max-w-3xl gap-6 border-b border-border pb-10">
        {character.role ? (
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-muted">Role</dt>
            <dd className="mt-1 text-foreground">{character.role}</dd>
          </div>
        ) : null}
        {character.category ? (
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-muted">Category</dt>
            <dd className="mt-1 text-foreground">{character.category}</dd>
          </div>
        ) : null}
        <div>
          <dt className="font-mono text-xs uppercase tracking-wider text-muted">Last updated</dt>
          <dd className="mt-1 text-foreground">{character.lastUpdated}</dd>
        </div>
      </dl>
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">Sources</h2>
        <div className="mt-4">
          <SourceList sources={character.sources} />
        </div>
      </section>
      <RelatedLinks links={getCharacterRelated(slug)} />
    </Container>
  );
}