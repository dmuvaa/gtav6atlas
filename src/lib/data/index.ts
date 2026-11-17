import {
  articles,
  businesses,
  characters,
  discoveries,
  locations,
  vehicles,
} from "./seed";
import {
  fetchArticleBySlug,
  fetchCharacterBySlug,
  fetchLocationBySlug,
  fetchPublishedArticles,
  fetchPublishedBusinesses,
  fetchPublishedCharacters,
  fetchPublishedDiscoveries,
  fetchPublishedLocations,
  fetchPublishedVehicles,
  fetchVehicleBySlug,
  useSupabaseCms,
} from "./supabase-read";
import type {
  Article,
  Business,
  Character,
  Discovery,
  EntityType,
  Location,
  SearchResultItem,
  Vehicle,
} from "../types";

export function getCharacters(): Character[] {
  return [...characters].sort((a, b) => a.name.localeCompare(b.name));
}

export function getCharacterBySlug(slug: string): Character | undefined {
  return characters.find((c) => c.slug === slug);
}

export function getLocations(typeFilter?: string): Location[] {
  let list = [...locations];
  if (typeFilter === "landmark") {
    list = list.filter((l) =>
      ["Landmark", "Natural landmark"].includes(l.locationType),
    );
  }
  return list.sort((a, b) => a.name.localeCompare(b.name));
}

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}

export function getVehicles(): Vehicle[] {
  return [...vehicles].sort((a, b) => a.name.localeCompare(b.name));
}

export function getVehicleBySlug(slug: string): Vehicle | undefined {
  return vehicles.find((v) => v.slug === slug);
}

export function getBusinesses(): Business[] {
  return [...businesses].sort((a, b) => a.name.localeCompare(b.name));
}

export function getBusinessBySlug(slug: string): Business | undefined {
  return businesses.find((b) => b.slug === slug);
}

export function getGuides(): Article[] {
  return articles
    .filter((a) => a.category === "guide")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getNews(): Article[] {
  return articles
    .filter((a) => a.category === "news")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getDiscoveries(): Discovery[] {
  return [...discoveries].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
}

export function getDiscoveryBySlug(slug: string): Discovery | undefined {
  return discoveries.find((d) => d.slug === slug);
}

function withSeedHero<T extends { slug: string; heroImage?: string }>(
  rows: T[],
  seedRows: T[],
): T[] {
  const bySlug = new Map(seedRows.map((r) => [r.slug, r]));
  return rows.map((r) => ({
    ...r,
    heroImage: r.heroImage ?? bySlug.get(r.slug)?.heroImage,
  }));
}

/** Prefer Supabase when NEXT_PUBLIC_USE_SUPABASE_CMS=true, else seed file. */
export async function loadCharacters(): Promise<Character[]> {
  if (!useSupabaseCms()) return getCharacters();
  const db = await fetchPublishedCharacters();
  if (db === null) return getCharacters();
  return withSeedHero(db, getCharacters());
}

export async function loadCharacterBySlug(
  slug: string,
): Promise<Character | undefined> {
  if (!useSupabaseCms()) return getCharacterBySlug(slug);
  const row = await fetchCharacterBySlug(slug);
  if (!row) return undefined;
  return {
    ...row,
    heroImage: row.heroImage ?? getCharacterBySlug(slug)?.heroImage,
  };
}

export async function loadLocations(typeFilter?: string): Promise<Location[]> {
  if (!useSupabaseCms()) return getLocations(typeFilter);
  const db = await fetchPublishedLocations();
  if (db === null) return getLocations(typeFilter);
  let list = withSeedHero(db, getLocations(typeFilter));
  if (typeFilter === "landmark") {
    list = list.filter((l) =>
      ["Landmark", "Natural landmark"].includes(l.locationType),
    );
  }
  return list;
}

export async function loadLocationBySlug(
  slug: string,
): Promise<Location | undefined> {
  if (!useSupabaseCms()) return getLocationBySlug(slug);
  const row = await fetchLocationBySlug(slug);
  if (!row) return undefined;
  return {
    ...row,
    heroImage: row.heroImage ?? getLocationBySlug(slug)?.heroImage,
  };
}

export async function loadVehicles(): Promise<Vehicle[]> {
  if (!useSupabaseCms()) return getVehicles();
  const db = await fetchPublishedVehicles();
  if (db === null) return getVehicles();
  return withSeedHero(db, getVehicles());
}

export async function loadVehicleBySlug(
  slug: string,
): Promise<Vehicle | undefined> {
  if (!useSupabaseCms()) return getVehicleBySlug(slug);
  const row = await fetchVehicleBySlug(slug);
  if (!row) return undefined;
  return {
    ...row,
    heroImage: row.heroImage ?? getVehicleBySlug(slug)?.heroImage,
  };
}

export async function loadBusinesses(): Promise<Business[]> {
  if (!useSupabaseCms()) return getBusinesses();
  const db = await fetchPublishedBusinesses();
  if (db === null) return getBusinesses();
  return withSeedHero(db, getBusinesses());
}

export async function loadBusinessBySlug(
  slug: string,
): Promise<Business | undefined> {
  if (!useSupabaseCms()) return getBusinessBySlug(slug);
  const all = await fetchPublishedBusinesses();
  if (all === null) return getBusinessBySlug(slug);
  const row = all.find((b) => b.slug === slug);
  if (!row) return undefined;
  return {
    ...row,
    heroImage: row.heroImage ?? getBusinessBySlug(slug)?.heroImage,
  };
}

export async function loadGuides(): Promise<Article[]> {
  if (!useSupabaseCms()) return getGuides();
  const db = await fetchPublishedArticles();
  if (db === null) return getGuides();
  return withSeedHero(
    db.filter((a) => a.category === "guide"),
    getGuides(),
  );
}

export async function loadNews(): Promise<Article[]> {
  if (!useSupabaseCms()) return getNews();
  const db = await fetchPublishedArticles();
  if (db === null) return getNews();
  return withSeedHero(
    db.filter((a) => a.category === "news"),
    getNews(),
  );
}

export async function loadArticleBySlug(
  slug: string,
): Promise<Article | undefined> {
  if (!useSupabaseCms()) return getArticleBySlug(slug);
  const row = await fetchArticleBySlug(slug);
  if (!row) return undefined;
  return {
    ...row,
    heroImage: row.heroImage ?? getArticleBySlug(slug)?.heroImage,
  };
}

export async function loadDiscoveries(): Promise<Discovery[]> {
  if (!useSupabaseCms()) return getDiscoveries();
  const db = await fetchPublishedDiscoveries();
  if (db === null) return getDiscoveries();
  return withSeedHero(db, getDiscoveries());
}

export async function loadDiscoveryBySlug(
  slug: string,
): Promise<Discovery | undefined> {
  if (!useSupabaseCms()) return getDiscoveryBySlug(slug);
  const all = await fetchPublishedDiscoveries();
  if (all === null) return getDiscoveryBySlug(slug);
  const row = all.find((d) => d.slug === slug);
  if (!row) return undefined;
  return {
    ...row,
    heroImage: row.heroImage ?? getDiscoveryBySlug(slug)?.heroImage,
  };
}

function entityPath(type: EntityType, slug: string): string {
  const map: Record<EntityType, string> = {
    character: `/characters/${slug}`,
    location: `/locations/${slug}`,
    vehicle: `/vehicles/${slug}`,
    business: `/businesses/${slug}`,
    guide: `/guides/${slug}`,
    news: `/news/${slug}`,
    discovery: `/discoveries/${slug}`,
  };
  return map[type];
}

export function buildSearchIndex(): SearchResultItem[] {
  const items: SearchResultItem[] = [];

  for (const c of characters) {
    items.push({
      id: c.id,
      title: c.name,
      description: c.description,
      slug: c.slug,
      entityType: "character",
      verificationStatus: c.verificationStatus,
    });
  }
  for (const l of locations) {
    items.push({
      id: l.id,
      title: l.name,
      description: l.description,
      slug: l.slug,
      entityType: "location",
      verificationStatus: l.verificationStatus,
    });
  }
  for (const v of vehicles) {
    items.push({
      id: v.id,
      title: v.name,
      description: v.description,
      slug: v.slug,
      entityType: "vehicle",
      verificationStatus: v.verificationStatus,
    });
  }
  for (const b of businesses) {
    items.push({
      id: b.id,
      title: b.name,
      description: b.description,
      slug: b.slug,
      entityType: "business",
      verificationStatus: b.verificationStatus,
    });
  }
  for (const a of articles) {
    items.push({
      id: a.id,
      title: a.title,
      description: a.excerpt,
      slug: a.slug,
      entityType: a.category === "guide" ? "guide" : "news",
      verificationStatus: a.verificationStatus,
    });
  }
  for (const d of discoveries) {
    items.push({
      id: d.id,
      title: d.name,
      description: d.description,
      slug: d.slug,
      entityType: "discovery",
      verificationStatus: d.verificationStatus,
    });
  }

  return items;
}

export async function buildLiveSearchIndex(): Promise<SearchResultItem[]> {
  if (!useSupabaseCms()) return buildSearchIndex();

  const [chars, locs, vehs, biz, guides, news, discs] = await Promise.all([
    loadCharacters(),
    loadLocations(),
    loadVehicles(),
    loadBusinesses(),
    loadGuides(),
    loadNews(),
    loadDiscoveries(),
  ]);

  const items: SearchResultItem[] = [];
  for (const c of chars) {
    items.push({
      id: c.id,
      title: c.name,
      description: c.description,
      slug: c.slug,
      entityType: "character",
      verificationStatus: c.verificationStatus,
    });
  }
  for (const l of locs) {
    items.push({
      id: l.id,
      title: l.name,
      description: l.description,
      slug: l.slug,
      entityType: "location",
      verificationStatus: l.verificationStatus,
    });
  }
  for (const v of vehs) {
    items.push({
      id: v.id,
      title: v.name,
      description: v.description,
      slug: v.slug,
      entityType: "vehicle",
      verificationStatus: v.verificationStatus,
    });
  }
  for (const b of biz) {
    items.push({
      id: b.id,
      title: b.name,
      description: b.description,
      slug: b.slug,
      entityType: "business",
      verificationStatus: b.verificationStatus,
    });
  }
  for (const a of guides) {
    items.push({
      id: a.id,
      title: a.title,
      description: a.excerpt,
      slug: a.slug,
      entityType: "guide",
      verificationStatus: a.verificationStatus,
    });
  }
  for (const a of news) {
    items.push({
      id: a.id,
      title: a.title,
      description: a.excerpt,
      slug: a.slug,
      entityType: "news",
      verificationStatus: a.verificationStatus,
    });
  }
  for (const d of discs) {
    items.push({
      id: d.id,
      title: d.name,
      description: d.description,
      slug: d.slug,
      entityType: "discovery",
      verificationStatus: d.verificationStatus,
    });
  }
  return items;
}

export async function searchContent(
  query: string,
  typeFilter?: EntityType | "all",
): Promise<(SearchResultItem & { href: string; score: number })[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const index = await buildLiveSearchIndex();

  return index
    .map((item) => {
      const haystack = `${item.title} ${item.description}`.toLowerCase();
      const exact = item.title.toLowerCase() === q;
      const starts = item.title.toLowerCase().startsWith(q);
      const includes = haystack.includes(q);
      let score = 0;
      if (exact) score = 100;
      else if (starts) score = 80;
      else if (includes) score = 50;
      else {
        const tokens = q.split(/\s+/);
        if (tokens.every((t) => haystack.includes(t))) score = 40;
      }
      return { ...item, href: entityPath(item.entityType, item.slug), score };
    })
    .filter((r) => r.score > 0)
    .filter((r) => !typeFilter || typeFilter === "all" || r.entityType === typeFilter)
    .sort((a, b) => b.score - a.score);
}