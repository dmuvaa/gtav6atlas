import { AdminCmsListPageWithSuspense } from "@/components/admin/AdminCmsListPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Characters (admin)",
  description: "Character records",
  path: "/admin/characters",
  noIndex: true,
});

export default function AdminCharactersPage() {
  return <AdminCmsListPageWithSuspense entityKey="character" title="Characters" />;
}