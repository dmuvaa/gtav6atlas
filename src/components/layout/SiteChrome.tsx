import { SiteHeader } from "@/components/layout/SiteHeader";
import { HeaderAuth } from "@/components/layout/HeaderAuth";
import { GlobalSearchHotkey } from "@/components/search/GlobalSearchHotkey";

export function SiteChrome() {
  return (
    <>
      <SiteHeader authSlot={<HeaderAuth />} />
      <GlobalSearchHotkey />
    </>
  );
}