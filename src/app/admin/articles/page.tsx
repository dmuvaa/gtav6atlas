import { AdminCmsListPageWithSuspense } from "@/components/admin/AdminCmsListPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Articles (admin)",
  description: "Guides and news",
  path: "/admin/articles",
  noIndex: true,
});

export default function AdminArticlesPage() {
  return <AdminCmsListPageWithSuspense entityKey="article" title="Articles" />;
}