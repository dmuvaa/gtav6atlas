import Link from "next/link";
import { LegalDoc } from "@/components/legal/LegalDoc";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of use",
  description: `Terms of use for ${SITE_NAME}.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms" }]} />
      <PageHeader
        title="Terms of use"
        description="Rules for using the atlas, accounts, and community features."
      />
      <LegalDoc>
        <p>
          These terms apply when you access or use {SITE_NAME} (the “site”). By
          using the site you agree to them. If you do not agree, please do not use
          the site.
        </p>

        <h2>What this site is</h2>
        <p>
          {SITE_NAME} is an independent fan reference. It is not affiliated with,
          endorsed by, or sponsored by Rockstar Games, Take-Two Interactive, or
          any related entity. Content is provided for general information and
          entertainment; it is not official game material.
        </p>

        <h2>Accounts</h2>
        <p>
          You may create an account to save preferences, track progress, or submit
          community tips. You are responsible for your credentials and for activity
          under your account. Provide accurate profile information and keep it
          updated. We may suspend or close accounts that abuse the service, post
          unlawful content, or attempt to disrupt the site.
        </p>

        <h2>Acceptable use</h2>
        <ul>
          <li>Use the site only for lawful purposes.</li>
          <li>Do not scrape, overload, or probe our systems without permission.</li>
          <li>
            Do not impersonate staff, other users, or rights holders.
          </li>
          <li>
            Do not upload malware, spam, or content that infringes others’ rights.
          </li>
        </ul>

        <h2>Content and accuracy</h2>
        <p>
          Atlas entries, guides, and news summaries are compiled from public
          sources and editorial work. They may be incomplete or become outdated.
          Verification labels describe our confidence, not a guarantee. See our{" "}
          <Link href="/editorial-policy">editorial policy</Link> for how we classify
          information.
        </p>
        <p>
          The site is provided “as is” without warranties of any kind, whether
          express or implied, including fitness for a particular purpose.
        </p>

        <h2>Submissions</h2>
        <p>
          If you submit discoveries or corrections, you grant us a non-exclusive
          right to review, edit, publish, or decline that material. Published
          submissions remain subject to editorial standards and may be removed.
        </p>

        <h2>Intellectual property</h2>
        <p>
          {SITE_NAME} branding, original writing, and site design belong to the
          operators of the site. Game names, logos, and imagery remain the property
          of their respective owners and are referenced under fair use / fan
          reference conventions where applicable.
        </p>

        <h2>External links</h2>
        <p>
          Entity pages may link to third-party sources. We do not control those
          sites and are not responsible for their content or practices.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, {SITE_NAME} and its operators
          are not liable for indirect, incidental, or consequential damages arising
          from your use of the site or reliance on its content.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these terms from time to time. Continued use after changes
          are posted constitutes acceptance of the revised terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalDoc>
    </Container>
  );
}