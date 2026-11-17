import Link from "next/link";
import { notFound } from "next/navigation";
import { SourceList } from "@/components/entities/SourceList";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { EntityHeroImage } from "@/components/media/EntityHeroImage";
import {
  getLocationBySlug,
  loadBusinessBySlug,
  loadBusinesses,
} from "@/lib/data";
import { resolveHeroImage } from "@/lib/media/resolve-hero-image";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return (await loadBusinesses()).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/businesses/[slug]">) {
  const { slug } = await params;
  const business = await loadBusinessBySlug(slug);
  if (!business) return {};
  return buildMetadata({
    title: business.name,
    description: business.description,
    path: `/businesses/${business.slug}`,
  });
}

export default async function BusinessPage({ params }: PageProps<"/businesses/[slug]">) {
  const { slug } = await params;
  const business = await loadBusinessBySlug(slug);
  if (!business) notFound();
  const location = business.locationSlug
    ? getLocationBySlug(business.locationSlug)
    : undefined;

  return (
    <Container className="py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Businesses", href: "/businesses" },
          { label: business.name },
        ]}
      />
      <EntityHeroImage
        src={resolveHeroImage(business.heroImage)}
        alt={business.name}
        priority
      />
      <PageHeader
        title={business.name}
        description={business.description}
        badges={<VerificationBadge status={business.verificationStatus} />}
      />
      <dl className="grid max-w-3xl gap-6 border-b border-border pb-10">
        <Field label="Category" value={business.businessCategory} />
        {location ? (
          <p className="text-sm">
            <span className="font-mono text-xs uppercase tracking-wider text-muted">
              Location{" "}
            </span>
            <Link href={`/locations/${location.slug}`} className="text-accent">
              {location.name}
            </Link>
          </p>
        ) : null}
        <Field label="Last updated" value={business.lastUpdated} />
      </dl>
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">Sources</h2>
        <div className="mt-4">
          <SourceList sources={business.sources} />
        </div>
      </section>
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