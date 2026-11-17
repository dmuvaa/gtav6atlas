import { EntityListClient } from "@/components/database/EntityListClient";
import { Container } from "@/components/ui/Container";
import { PageHeader, Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { loadBusinesses } from "@/lib/data";
import { entityToListItem } from "@/lib/data/list-items";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "GTA VI Businesses",
  description: "Establishments and commercial locations documented with sources and verification.",
  path: "/businesses",
});

export default async function BusinessesPage() {
  const businesses = await loadBusinesses();
  const items = businesses.map((b) =>
    entityToListItem(
      b,
      `/businesses/${b.slug}`,
      b.businessCategory,
    ),
  );
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Businesses" }]} />
      <PageHeader
        title="Businesses"
        description="Hotels, shops and venues tied to Leonida locations where evidence exists."
      />
      <EntityListClient items={items} searchPlaceholder="Filter businesses…" />
      {businesses.length === 0 ? (
        <p className="text-muted">No business entries yet.</p>
      ) : null}
    </Container>
  );
}