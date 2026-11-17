import { EntityListClient } from "@/components/database/EntityListClient";
import { Container } from "@/components/ui/Container";
import { PageHeader, Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { loadVehicles } from "@/lib/data";
import { entityToListItem } from "@/lib/data/list-items";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "GTA VI Vehicles",
  description: "Catalogue of vehicles appearing in official GTA VI material with verification status.",
  path: "/vehicles",
});

export default async function VehiclesPage() {
  const vehicles = await loadVehicles();
  const items = vehicles.map((v) =>
    entityToListItem(v, `/vehicles/${v.slug}`, v.vehicleCategory),
  );
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Vehicles" }]} />
      <PageHeader
        title="Vehicles"
        description="Confirmed and reported vehicles from trailers and official sources."
      />
      <EntityListClient items={items} searchPlaceholder="Filter vehicles…" />
    </Container>
  );
}