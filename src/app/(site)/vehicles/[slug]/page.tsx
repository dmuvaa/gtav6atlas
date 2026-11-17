import { notFound } from "next/navigation";
import { SourceList } from "@/components/entities/SourceList";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { EntityHeroImage } from "@/components/media/EntityHeroImage";
import { loadVehicleBySlug, loadVehicles } from "@/lib/data";
import { resolveHeroImage } from "@/lib/media/resolve-hero-image";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return (await loadVehicles()).map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/vehicles/[slug]">) {
  const { slug } = await params;
  const vehicle = await loadVehicleBySlug(slug);
  if (!vehicle) return {};
  return buildMetadata({
    title: vehicle.name,
    description: vehicle.description,
    path: `/vehicles/${vehicle.slug}`,
  });
}

export default async function VehiclePage({ params }: PageProps<"/vehicles/[slug]">) {
  const { slug } = await params;
  const vehicle = await loadVehicleBySlug(slug);
  if (!vehicle) notFound();

  return (
    <Container className="py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Vehicles", href: "/vehicles" },
          { label: vehicle.name },
        ]}
      />
      <EntityHeroImage
        src={resolveHeroImage(vehicle.heroImage)}
        alt={vehicle.name}
        priority
      />
      <PageHeader
        title={vehicle.name}
        description={vehicle.description}
        badges={<VerificationBadge status={vehicle.verificationStatus} />}
      />
      <dl className="grid max-w-3xl gap-6 border-b border-border pb-10">
        <Field label="Category" value={vehicle.vehicleCategory} />
        {vehicle.manufacturer ? (
          <Field label="Manufacturer" value={vehicle.manufacturer} />
        ) : null}
        {vehicle.realWorldInspiration ? (
          <Field label="Real-world inspiration" value={vehicle.realWorldInspiration} />
        ) : null}
        <Field label="Last updated" value={vehicle.lastUpdated} />
      </dl>
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">Sources</h2>
        <div className="mt-4">
          <SourceList sources={vehicle.sources} />
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