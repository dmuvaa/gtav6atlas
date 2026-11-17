import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy policy",
  description: "Privacy policy for GTA6AtlasHQ.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy" }]} />
      <PageHeader title="Privacy policy" />
      <div className="prose-atlas max-w-3xl">
        <p>
          We collect email addresses when you subscribe to newsletters, along
          with consent timestamps. Analytics may process aggregated usage data
          to improve search and content quality.
        </p>
        <p>
          A full privacy policy will be published before launch traffic
          scales; contact us for data requests in the interim.
        </p>
      </div>
    </Container>
  );
}