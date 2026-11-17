import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Editorial policy",
  description: "How GTA6AtlasHQ sources, verifies and updates GTA VI information.",
  path: "/editorial-policy",
});

export default function EditorialPolicyPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Editorial policy" }]}
      />
      <PageHeader
        title="Editorial policy"
        description="Verification classifications, source hierarchy and correction standards."
      />
      <div className="prose-atlas max-w-3xl space-y-4">
        <p>
          Factual database entries display a verification label: officially
          confirmed, reported, community discovery, speculation or unverified.
        </p>
        <p>
          Community submissions do not publish as confirmed facts without
          editorial review and supporting evidence.
        </p>
        <p>
          Corrections are applied when sources change; significant updates may
          include revision notes on entity pages.
        </p>
      </div>
    </Container>
  );
}