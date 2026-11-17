import Link from "next/link";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { Container } from "@/components/ui/Container";
import {
  CONTACT_EMAIL,
  COPYRIGHT_YEAR,
  LEGAL_LAST_UPDATED,
  LEGAL_LAST_UPDATED_ISO,
  SITE_NAME,
} from "@/lib/constants";

const FOOTER_GROUPS = [
  {
    title: "Explore",
    links: [
      { href: "/characters", label: "Characters" },
      { href: "/locations", label: "Locations" },
      { href: "/vehicles", label: "Vehicles" },
      { href: "/guides", label: "Guides" },
      { href: "/search", label: "Search" },
    ],
  },
  {
    title: "Site",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/newsletter", label: "Newsletter" },
      { href: "/editions", label: "Edition gallery" },
      { href: "/maps", label: "Maps" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of use" },
      { href: "/editorial-policy", label: "Editorial policy" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative mt-auto border-t border-border/60 bg-surface/90 backdrop-blur-md">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-vi-pink-bright to-transparent opacity-80"
        aria-hidden
      />
      <Container className="py-12 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] lg:gap-16">
          <div>
            <SiteLogo compact />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Independent Grand Theft Auto VI reference — structured directories,
              guides, and verification labels for players, researchers, and
              creators.
            </p>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted">
              Not affiliated with, endorsed by, or sponsored by Rockstar Games or
              Take-Two Interactive. Grand Theft Auto and related marks are
              trademarks of their respective owners.
            </p>
            <p className="mt-4 text-sm text-muted">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-vi-pink-bright hover:text-foreground"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>

          <nav
            className="grid gap-8 sm:grid-cols-3"
            aria-label="Footer navigation"
          >
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <h2 className="font-mono text-[10px] font-medium uppercase tracking-widest text-vi-pink-bright">
                  {group.title}
                </h2>
                <ul className="mt-3 space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {COPYRIGHT_YEAR} {SITE_NAME}. Fan project for informational
            purposes only.
          </p>
          <p>
            Policies updated{" "}
            <time dateTime={LEGAL_LAST_UPDATED_ISO}>{LEGAL_LAST_UPDATED}</time>
          </p>
        </div>
      </Container>
    </footer>
  );
}