import { Suspense } from "react";
import { EntityListClient } from "@/components/database/EntityListClient";
import { Container } from "@/components/ui/Container";
import { PageHeader, Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { loadLocations } from "@/lib/data";
import { entityToListItem } from "@/lib/data/list-items";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "GTA VI Locations",
  description:
    "Leonida cities, towns and landmarks with verification labels and source references.",
  path: "/locations",
});

export default function LocationsPage(props: PageProps<"/locations">) {
  return (
    <Suspense fallback={<LocationsFallback />}>
      <LocationsPageContent {...props} />
    </Suspense>
  );
}

function LocationsFallback() {
  return (
    <Container className="py-12">
      <p className="text-muted">Loading locations…</p>
    </Container>
  );
}

async function LocationsPageContent({
  searchParams,
}: PageProps<"/locations">) {
  const params = await searchParams;
  const type =
    typeof params?.type === "string" ? params.type : undefined;
  const locations = await loadLocations(type);
  const items = locations.map((loc) =>
    entityToListItem(loc, `/locations/${loc.slug}`, loc.locationType),
  );

  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Locations" }]} />
      <PageHeader
        title="Locations"
        description="Directory of known Leonida locations. Map coordinates are added only when precision is documented."
      />
      <EntityListClient items={items} searchPlaceholder="Filter locations…" />
    </Container>
  );
}