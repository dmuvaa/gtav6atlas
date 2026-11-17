import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { SITE_NAME } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description: `About ${SITE_NAME} — independent GTA VI reference and companion platform.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <PageHeader
        title={`About ${SITE_NAME}`}
        description="Everything about GTA VI, organized in one place — with sources and verification up front."
      />
      <div className="prose-atlas max-w-3xl">
        <p>
          {SITE_NAME} is an independent project built to consolidate structured
          Grand Theft Auto VI information for players, enthusiasts, journalists
          and creators.
        </p>
        <p>
          We prioritize entity databases, search, editorial guides and
          transparent verification over volume-driven news churn.
        </p>
      </div>
    </Container>
  );
}