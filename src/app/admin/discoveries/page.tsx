import { AdminCmsListPageWithSuspense } from "@/components/admin/AdminCmsListPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Discoveries (admin)",
  description: "Discovery records",
  path: "/admin/discoveries",
  noIndex: true,
});

export default function AdminDiscoveriesPage() {
  return <AdminCmsListPageWithSuspense entityKey="discovery" title="Discoveries" />;
}