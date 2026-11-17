import Link from "next/link";
import { EntityCard } from "@/components/cards/EntityCard";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { SEED_MAP_LAYERS } from "@/lib/data/edition-seed";
import { resolveHeroImage } from "@/lib/media/resolve-hero-image";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Leonida Map",
  description:
    "Interactive GTA VI map preview — geographic data is added only when coordinate precision is verified.",
  path: "/maps",
});

export default function MapsPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Maps" }]} />
      <PageHeader
        title="Maps"
        description="MapLibre-based exploration is planned for Phase 3. We do not plot invented coordinates."
      />
      <div className="rounded-2xl border border-border bg-card p-8 sm:p-12">
        <h2 className="text-lg font-semibold text-foreground">Map status</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-muted">
          <li>Location records exist in the directory with verification labels.</li>
          <li>
            Geospatial fields (latitude, longitude, precision) will populate only
            from confirmed or responsibly approximated data.
          </li>
          <li>
            Until then, use the{" "}
            <Link href="/locations" className="text-accent underline">
              location database
            </Link>{" "}
            for structured browsing.
          </li>
        </ul>
      </div>
      <section className="mt-12">
        <h2 className="font-display text-2xl text-foreground">Reference layers</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Visual overlays from official marketing — not georeferenced. Additional
          layers appear here as editors publish them.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {SEED_MAP_LAYERS.map((layer) => (
            <EntityCard
              key={layer.slug}
              href="/locations"
              title={layer.name}
              description={layer.description}
              meta={layer.layer_type}
              verificationStatus="officially_confirmed"
              imageSrc={resolveHeroImage(layer.heroImage)}
            />
          ))}
        </div>
      </section>
    </Container>
  );
}