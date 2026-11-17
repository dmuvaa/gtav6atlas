import { EditionGrid } from "@/components/media/EditionGrid";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { getAllEditionStills } from "@/lib/media/editions";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "GTA VI edition reference gallery",
  description:
    "72+ official Rockstar GTA VI edition stills — vehicles, weapons, Vice City style, shops and key art for GTA6AtlasHQ.",
  path: "/editions",
});

export default function EditionsPage() {
  const total = getAllEditionStills().length;

  return (
    <Container className="py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Edition gallery" },
        ]}
      />
      <PageHeader
        title="Edition gallery"
        description={`${total} reference stills extracted from Rockstar’s GTA VI editions page, plus curated highlights. Filter by vehicles, weapons, Vice City style and more — pink-forward official marketing palette.`}
      />
      <EditionGrid />
    </Container>
  );
}