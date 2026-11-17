import { notFound } from "next/navigation";
import { SourceList } from "@/components/entities/SourceList";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { EntityHeroImage } from "@/components/media/EntityHeroImage";
import { loadDiscoveries, loadDiscoveryBySlug } from "@/lib/data";
import { resolveHeroImage } from "@/lib/media/resolve-hero-image";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return (await loadDiscoveries()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/discoveries/[slug]">) {
  const { slug } = await params;
  const discovery = await loadDiscoveryBySlug(slug);
  if (!discovery) return {};
  return buildMetadata({
    title: discovery.name,
    description: discovery.description,
    path: `/discoveries/${discovery.slug}`,
  });
}

export default async function DiscoveryPage({
  params,
}: PageProps<"/discoveries/[slug]">) {
  const { slug } = await params;
  const discovery = await loadDiscoveryBySlug(slug);
  if (!discovery) notFound();

  return (
    <Container className="py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Discoveries", href: "/discoveries" },
          { label: discovery.name },
        ]}
      />
      <EntityHeroImage
        src={resolveHeroImage(discovery.heroImage)}
        alt={discovery.name}
        priority
      />
      <PageHeader
        title={discovery.name}
        description={discovery.description}
        badges={<VerificationBadge status={discovery.verificationStatus} />}
      />
      <dl className="grid max-w-3xl gap-6 border-b border-border pb-10">
        <Field label="Category" value={discovery.discoveryCategory} />
        {discovery.contributor ? (
          <Field label="Contributor" value={discovery.contributor} />
        ) : null}
        <Field label="Last updated" value={discovery.lastUpdated} />
      </dl>
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">Evidence & sources</h2>
        <div className="mt-4">
          <SourceList sources={discovery.sources} />
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