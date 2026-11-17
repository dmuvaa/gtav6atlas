import { AdminCmsListPageWithSuspense } from "@/components/admin/AdminCmsListPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Vehicles (admin)",
  description: "Vehicle records",
  path: "/admin/vehicles",
  noIndex: true,
});

export default function AdminVehiclesPage() {
  return <AdminCmsListPageWithSuspense entityKey="vehicle" title="Vehicles" />;
}