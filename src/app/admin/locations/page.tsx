import { AdminCmsListPageWithSuspense } from "@/components/admin/AdminCmsListPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Locations (admin)",
  description: "Location records",
  path: "/admin/locations",
  noIndex: true,
});

export default function AdminLocationsPage() {
  return <AdminCmsListPageWithSuspense entityKey="location" title="Locations" />;
}