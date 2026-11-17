import { Suspense } from "react";
import { SearchField } from "@/components/search/SearchField";
import { SearchFilters, SearchResultList } from "@/components/search/SearchResults";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, PageHeader } from "@/components/ui/Breadcrumbs";
import { searchContent } from "@/lib/data";
import type { EntityType } from "@/lib/types";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Search",
  description: "Search GTA6AtlasHQ for characters, locations, vehicles, guides, news and discoveries.",
  path: "/search",
});

export default function SearchPage(props: PageProps<"/search">) {
  return (
    <Suspense
      fallback={
        <Container className="py-12">
          <p className="text-muted">Loading search…</p>
        </Container>
      }
    >
      <SearchPageContent {...props} />
    </Suspense>
  );
}

async function SearchPageContent({ searchParams }: PageProps<"/search">) {
  const params = await searchParams;
  const q = typeof params?.q === "string" ? params.q : "";
  const typeParam = typeof params?.type === "string" ? params.type : "all";
  const typeFilter =
    typeParam === "all" ? ("all" as const) : (typeParam as EntityType);

  const results = await searchContent(q, typeFilter);

  return (
    <Container className="py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <PageHeader
        title="Search"
        description="Cross-platform search across databases and editorial content."
      />
      <div className="mb-8 max-w-xl">
        <SearchField defaultQuery={q} showPopular />
      </div>
      <Suspense fallback={null}>
        <SearchFilters active={typeFilter} />
      </Suspense>
      <div className="mt-8">
        <SearchResultList results={results} query={q} />
      </div>
    </Container>
  );
}