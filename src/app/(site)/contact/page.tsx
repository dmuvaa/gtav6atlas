import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Contact GTA6AtlasHQ for editorial, creator services and general inquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <PageHeader
        title="Contact"
        description="Reach the team for corrections, partnerships and creator intelligence services."
      />
      <p className="text-muted">
        Email:{" "}
        <a href="mailto:hello@gta6atlashq.com" className="text-accent underline">
          hello@gta6atlashq.com
        </a>
      </p>
    </Container>
  );
}