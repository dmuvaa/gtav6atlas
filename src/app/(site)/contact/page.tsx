import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { CONTACT_EMAIL, PRIVACY_EMAIL, SITE_NAME } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description: `Contact ${SITE_NAME} for editorial, corrections, and privacy requests.`,
  path: "/contact",
});

const CONTACT_TOPICS = [
  {
    title: "General & partnerships",
    description: "Press, collaborations, or questions about the platform.",
    email: CONTACT_EMAIL,
  },
  {
    title: "Corrections & sources",
    description: "Factual errors, missing citations, or verification disputes.",
    email: CONTACT_EMAIL,
  },
  {
    title: "Privacy & account data",
    description: "Access, correction, deletion, or newsletter unsubscribe help.",
    email: PRIVACY_EMAIL,
  },
] as const;

export default function ContactPage() {
  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <PageHeader
        title="Contact"
        description="Reach the team for corrections, partnerships, and account help."
      />

      <div className="mt-8 grid max-w-3xl gap-4">
        {CONTACT_TOPICS.map((topic) => (
          <article
            key={topic.title}
            className="rounded-2xl border border-border bg-card/60 p-6"
          >
            <h2 className="font-display text-base text-foreground">{topic.title}</h2>
            <p className="mt-2 text-sm text-muted">{topic.description}</p>
            <a
              href={`mailto:${topic.email}`}
              className="mt-4 inline-block text-sm font-semibold text-vi-pink-bright hover:text-foreground"
            >
              {topic.email}
            </a>
          </article>
        ))}
      </div>

      <p className="prose-atlas mt-10 max-w-3xl text-sm text-muted">
        Contributors can also send evidence via{" "}
        <Link href="/account/submissions">account submissions</Link> when signed in.
        For legal text, see our{" "}
        <Link href="/privacy">privacy policy</Link> and{" "}
        <Link href="/terms">terms of use</Link>.
      </p>
    </Container>
  );
}