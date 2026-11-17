import Link from "next/link";
import { LegalDoc } from "@/components/legal/LegalDoc";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { CONTACT_EMAIL, PRIVACY_EMAIL, SITE_NAME } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy policy",
  description: `How ${SITE_NAME} collects, uses, and protects your information.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy" }]} />
      <PageHeader
        title="Privacy policy"
        description="What we collect, why we collect it, and the choices you have."
      />
      <LegalDoc>
        <p>
          {SITE_NAME} respects your privacy. This policy describes personal data we
          handle when you visit the site, create an account, subscribe to email, or
          use interactive features.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Account data</strong> — email address, password (stored in
            hashed form by our authentication provider), and optional display name.
          </li>
          <li>
            <strong>Profile and progress</strong> — settings you save and
            progress markers you choose to track on entity pages.
          </li>
          <li>
            <strong>Newsletter</strong> — email address, subscription type, consent
            timestamp, and delivery status.
          </li>
          <li>
            <strong>Community submissions</strong> — text you send for review,
            optional evidence links, and submission status.
          </li>
          <li>
            <strong>Search activity</strong> — search queries submitted on the
            public search tool (used in aggregate to improve content coverage).
          </li>
          <li>
            <strong>Technical data</strong> — standard server and security logs
            (e.g. IP address, user agent, timestamps) and cookies required for sign-in
            sessions.
          </li>
        </ul>

        <h2>How we use information</h2>
        <ul>
          <li>Operate accounts, authentication, and saved preferences.</li>
          <li>Send newsletters you opt into (you can unsubscribe at any time).</li>
          <li>Review and moderate contributor submissions.</li>
          <li>Measure search demand and improve atlas coverage.</li>
          <li>Protect the site against abuse, fraud, and security incidents.</li>
        </ul>
        <p>
          We do not sell your personal information. We do not use your data for
          third-party advertising profiles.
        </p>

        <h2>Where data is stored</h2>
        <p>
          Account and content data are stored with managed cloud infrastructure
          providers we use to run the site. Data may be processed in regions where
          those providers operate. We apply access controls so only authorized staff
          can view moderation and audience tools.
        </p>

        <h2>Cookies and sessions</h2>
        <p>
          Sign-in uses session cookies to keep you logged in. These are necessary
          for account features. You can clear cookies in your browser; you may need
          to sign in again afterward.
        </p>

        <h2>Retention</h2>
        <p>
          We keep account data while your account is active. Newsletter records are
          retained according to your subscription status and applicable law. Search
          logs may be aggregated or deleted on a rolling basis. You may request
          deletion of your account by contacting us.
        </p>

        <h2>Your choices</h2>
        <ul>
          <li>Update your display name in account settings.</li>
          <li>Unsubscribe from email via links in any newsletter message.</li>
          <li>
            Request access, correction, or deletion by emailing{" "}
            <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>.
          </li>
        </ul>

        <h2>Children</h2>
        <p>
          The site is not directed at children under 13 (or the minimum age in your
          country). We do not knowingly collect personal data from children. Contact
          us if you believe a child has provided information.
        </p>

        <h2>International visitors</h2>
        <p>
          If you access the site from outside the country where we operate, your
          information may be transferred to and processed in other jurisdictions.
          By using the site you understand that transfer may occur.
        </p>

        <h2>Changes</h2>
        <p>
          We may update this policy. Material changes will be reflected on this page
          with a new “last updated” date.
        </p>

        <h2>Contact</h2>
        <p>
          Privacy questions and requests:{" "}
          <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>. General
          inquiries: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. You
          can also use our <Link href="/contact">contact page</Link>.
        </p>
      </LegalDoc>
    </Container>
  );
}