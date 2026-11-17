import { EntityListClient } from "@/components/database/EntityListClient";
import { Container } from "@/components/ui/Container";
import { PageHeader, Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { loadDiscoveries } from "@/lib/data";
import { entityToListItem } from "@/lib/data/list-items";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "GTA VI Discoveries",
  description: "Verified and community-sourced discoveries with moderation and evidence tracking.",
  path: "/discoveries",
});

export default async function DiscoveriesPage() {
  const discoveries = await loadDiscoveries();
  const items = discoveries.map((d) =>
    entityToListItem(d, `/discoveries/${d.slug}`, d.discoveryCategory),
  );
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Discoveries" }]} />
      <PageHeader
        title="Discoveries"
        description="Interesting findings documented with verification labels. Submissions arrive in a later phase."
      />
      <EntityListClient items={items} searchPlaceholder="Filter discoveries…" />
    </Container>
  );
}