import { EntityListClient } from "@/components/database/EntityListClient";
import { Container } from "@/components/ui/Container";
import { PageHeader, Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { loadCharacters } from "@/lib/data";
import { entityToListItem } from "@/lib/data/list-items";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "GTA VI Characters",
  description:
    "Browse Grand Theft Auto VI character profiles with roles, sources and verification status.",
  path: "/characters",
});

export default async function CharactersPage() {
  const characters = await loadCharacters();
  const items = characters.map((c) =>
    entityToListItem(c, `/characters/${c.slug}`, c.role),
  );

  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Characters" }]} />
      <PageHeader
        title="Characters"
        description="Structured character records sourced from official announcements and verified reporting."
      />
      <EntityListClient items={items} searchPlaceholder="Filter characters…" />
    </Container>
  );
}