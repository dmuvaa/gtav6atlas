import { AdminCmsListPageWithSuspense } from "@/components/admin/AdminCmsListPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Businesses (admin)",
  description: "Business records",
  path: "/admin/businesses",
  noIndex: true,
});

export default function AdminBusinessPage() {
  return <AdminCmsListPageWithSuspense entityKey="business" title="Businesses" />;
}