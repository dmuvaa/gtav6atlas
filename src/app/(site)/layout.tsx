import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { SiteBackdrop } from "@/components/visual/SiteBackdrop";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteBackdrop />
      <SiteChrome />
      <main className="relative flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}