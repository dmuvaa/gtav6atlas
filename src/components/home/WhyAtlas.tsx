import { SectionHeading } from "@/components/ui/SectionHeading";

const rows = [
  {
    title: "Entity pages, not listicles",
    body: "Every character, location and vehicle gets a durable URL, sources and verification — not a one-off news post.",
  },
  {
    title: "Search across everything",
    body: "One query hits databases, guides, news and discoveries with type filters.",
  },
  {
    title: "Honest map policy",
    body: "We never invent coordinates. The atlas grows only when geography is documented.",
  },
  {
    title: "Creator-ready",
    body: "Structured data and edition reference gallery for scripts, SEO and research work.",
  },
];

export function WhyAtlas() {
  return (
    <section className="border-y border-vi-pink/15 bg-surface/30 py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Why GTA6AtlasHQ vs generic gaming sites"
          description="Built for repeat use and organic search — not churn."
        />
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {rows.map((r) => (
            <li
              key={r.title}
              className="rounded-2xl border border-border bg-card/50 p-5"
            >
              <h3 className="font-display text-base text-vi-pink-bright">
                {r.title}
              </h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{r.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}