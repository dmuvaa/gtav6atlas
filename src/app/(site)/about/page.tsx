import Link from "next/link";
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
        description="An independent atlas for Grand Theft Auto VI — structured, searchable, and source-aware."
      />
      <div className="prose-atlas mt-8 max-w-3xl">
        <p>
          {SITE_NAME} is a fan-built knowledge platform for Grand Theft Auto VI. We
          combine directories for characters, locations, vehicles, businesses, and
          discoveries with guides, news summaries, and search across one site.
        </p>

        <h2>Who it is for</h2>
        <ul>
          <li>Players who want reliable reference without rumor churn.</li>
          <li>Creators and journalists who need citable structure and source links.</li>
          <li>Researchers tracking what is confirmed versus reported.</li>
        </ul>

        <h2>What makes it different</h2>
        <p>
          Verification labels on every entity, linked sources, and cross-type search —
          instead of endless duplicate listicles. We optimize for clarity and
          maintainability as Rockstar releases more material.
        </p>

        <h2>Not official</h2>
        <p>
          This project is not affiliated with Rockstar Games or Take-Two
          Interactive. For official information, always refer to Rockstar’s channels.
        </p>

        <h2>Get involved</h2>
        <p>
          Create an account to track progress or, with contributor access, send
          evidence-backed tips. Read our{" "}
          <Link href="/editorial-policy">editorial policy</Link>,{" "}
          <Link href="/privacy">privacy policy</Link>, and{" "}
          <Link href="/terms">terms of use</Link>. Questions welcome on the{" "}
          <Link href="/contact">contact page</Link>.
        </p>
      </div>
    </Container>
  );
}