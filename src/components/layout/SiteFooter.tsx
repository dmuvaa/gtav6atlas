import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { COPYRIGHT_YEAR, SITE_NAME } from "@/lib/constants";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/editorial-policy", label: "Editorial policy" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/editions", label: "Edition gallery" },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-auto border-t border-border/60 bg-surface/90 backdrop-blur-md">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-vi-pink-bright to-transparent opacity-80"
        aria-hidden
      />
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-lg font-semibold text-foreground">{SITE_NAME}</p>
            <p className="mt-2 max-w-md text-sm text-muted leading-relaxed">
              Independent GTA VI knowledge platform. Not affiliated with,
              endorsed by or sponsored by Rockstar Games or Take-Two
              Interactive.
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {footerLinks.map((link) => (
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
          </nav>
        </div>
        <p className="mt-10 border-t border-border pt-6 text-xs text-muted">
          © {COPYRIGHT_YEAR} {SITE_NAME}. Grand Theft Auto and
          related marks are trademarks of their respective owners. Fan project
          for informational purposes.
        </p>
      </Container>
    </footer>
  );
}