import Link from "next/link";
import { LegalDoc } from "@/components/legal/LegalDoc";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { CONTACT_EMAIL, SITE_NAME, VERIFICATION_LABELS } from "@/lib/constants";
import type { VerificationStatus } from "@/lib/types";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Editorial policy",
  description: `How ${SITE_NAME} sources, verifies, and updates GTA VI information.`,
  path: "/editorial-policy",
});

const TIERS: VerificationStatus[] = [
  "officially_confirmed",
  "reported",
  "community_discovery",
  "speculation",
  "unverified",
];

export default function EditorialPolicyPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Editorial policy" }]}
      />
      <PageHeader
        title="Editorial policy"
        description="How we label facts, cite sources, and handle corrections."
      />
      <LegalDoc>
        <p>
          {SITE_NAME} exists to organize Grand Theft Auto VI information with clear
          sourcing and honest uncertainty. Every entity in the atlas should tell you
          what we know, how we know it, and how confident we are.
        </p>

        <h2>Verification labels</h2>
        <p>Each database entry carries one of five labels:</p>
        <ul>
          {TIERS.map((tier) => (
            <li key={tier}>
              <strong>{VERIFICATION_LABELS[tier]}</strong> —{" "}
              {tier === "officially_confirmed" &&
                "directly supported by Rockstar or primary official materials."}
              {tier === "reported" &&
                "widely reported by reputable outlets but not confirmed in primary sources."}
              {tier === "community_discovery" &&
                "credible fan or community research with evidence we have reviewed."}
              {tier === "speculation" &&
                "inference or rumor presented explicitly as unconfirmed."}
              {tier === "unverified" &&
                "placeholder or draft until sources are attached."}
            </li>
          ))}
        </ul>

        <h2>Sources</h2>
        <p>
          Entity pages list sources where possible — official pages, trailers,
          interviews, and reputable reporting. We prefer primary material over
          reposts. When sources conflict, we note the conflict and adjust labels
          downward until clarified.
        </p>

        <h2>Guides and news</h2>
        <p>
          Guides summarize verified or clearly labeled reported information. News
          posts distinguish editorial analysis from factual claims and link outward
          where appropriate.
        </p>

        <h2>Community submissions</h2>
        <p>
          Signed-in contributors may send tips or corrections. Submissions are not
          published automatically. Moderators check evidence before anything moves
          toward a public label upgrade. See{" "}
          <Link href="/account/submissions">your submissions</Link> for status.
        </p>

        <h2>Corrections</h2>
        <p>
          When official information changes or we discover an error, we update the
          affected entry and may adjust verification status. Significant changes are
          reflected in the “last updated” field on entity pages. Report mistakes via{" "}
          <Link href="/contact">contact</Link> or{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <h2>Edition and marketing imagery</h2>
        <p>
          Screenshots and stills from Rockstar editions pages are used as visual
          reference and theming. They do not imply endorsement. See{" "}
          <Link href="/editions">edition gallery</Link> and on-page notices for
          attribution context.
        </p>

        <h2>Independence</h2>
        <p>
          Editorial decisions are made by the {SITE_NAME} team. We do not accept
          payment to change verification labels or rankings on the public atlas.
        </p>
      </LegalDoc>
    </Container>
  );
}