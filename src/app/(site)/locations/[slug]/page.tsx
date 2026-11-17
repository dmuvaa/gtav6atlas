import { notFound } from "next/navigation";
import { RelatedLinks } from "@/components/entities/RelatedLinks";
import { SourceList } from "@/components/entities/SourceList";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { SITE_URL } from "@/lib/constants";
import { EntityHeroImage } from "@/components/media/EntityHeroImage";
import { loadLocationBySlug, loadLocations } from "@/lib/data";
import { resolveHeroImage } from "@/lib/media/resolve-hero-image";
import { getLocationRelated } from "@/lib/data/relations";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return (await loadLocations()).map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/locations/[slug]">) {
  const { slug } = await params;
  const location = await loadLocationBySlug(slug);
  if (!location) return {};
  return buildMetadata({
    title: location.name,
    description: location.description,
    path: `/locations/${location.slug}`,
  });
}

export default async function LocationPage({ params }: PageProps<"/locations/[slug]">) {
  const { slug } = await params;
  const location = await loadLocationBySlug(slug);
  if (!location) notFound();

  const jsonLd = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Locations", url: `${SITE_URL}/locations` },
    { name: location.name, url: `${SITE_URL}/locations/${location.slug}` },
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
          { label: "Locations", href: "/locations" },
          { label: location.name },
        ]}
      />
      <EntityHeroImage
        src={resolveHeroImage(location.heroImage)}
        alt={location.name}
        priority
      />
      <PageHeader
        title={location.name}
        description={location.description}
        badges={<VerificationBadge status={location.verificationStatus} />}
      />
      <dl className="grid max-w-3xl gap-6 border-b border-border pb-10">
        <Field label="Type" value={location.locationType} />
        {location.region ? <Field label="Region" value={location.region} /> : null}
        {location.realWorldInspiration ? (
          <Field label="Real-world inspiration" value={location.realWorldInspiration} />
        ) : null}
        <Field label="Last updated" value={location.lastUpdated} />
      </dl>
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">Sources</h2>
        <div className="mt-4">
          <SourceList sources={location.sources} />
        </div>
      </section>
      <RelatedLinks links={getLocationRelated(slug)} />
    </Container>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-1 text-foreground">{value}</dd>
    </div>
  );
}