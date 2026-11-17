import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of use",
  description: "Terms of use for GTA6AtlasHQ.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms" }]} />
      <PageHeader title="Terms of use" />
      <div className="prose-atlas max-w-3xl">
        <p>
          By using GTA6AtlasHQ you agree to use the site for lawful purposes.
          Content is provided for informational purposes without warranties of
          completeness.
        </p>
        <p>
          Grand Theft Auto is a trademark of its respective owners. This site is
          an independent fan project.
        </p>
      </div>
    </Container>
  );
}