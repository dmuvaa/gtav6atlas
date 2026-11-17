import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Newsletter",
  description: "Subscribe to Leonida Intel for GTA VI updates from GTA6AtlasHQ.",
  path: "/newsletter",
});

export default function NewsletterPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Newsletter" }]} />
      <PageHeader
        title="Newsletter"
        description="Leonida Intel covers database updates, guides and platform news. Creator Intelligence Brief will be a separate list in a later release."
      />
      <div className="max-w-lg rounded-2xl border border-border bg-card p-8">
        <NewsletterForm />
      </div>
    </Container>
  );
}