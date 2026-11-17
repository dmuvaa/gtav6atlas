import { SITE_NAME } from "@/lib/constants";
import { resolveHeroImage } from "@/lib/media/resolve-hero-image";
import type {
  Article,
  Business,
  Character,
  Discovery,
  Location,
  Vehicle,
  VerificationStatus,
} from "../types";

const defaultSource = {
  id: "src-atlas",
  title: `${SITE_NAME} atlas entry`,
  url: "#",
  publisher: SITE_NAME,
  sourceType: "internal",
};

function vs(raw: string): VerificationStatus {
  return raw as VerificationStatus;
}

function heroFromRow(row: Record<string, unknown>): string | undefined {
  if (row.hero_image_path == null) return undefined;
  return resolveHeroImage(String(row.hero_image_path));
}

export function mapCharacterRow(row: Record<string, unknown>): Character {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description ?? ""),
    role: row.role != null ? String(row.role) : undefined,
    category: row.category != null ? String(row.category) : undefined,
    verificationStatus: vs(String(row.verification_status ?? "unverified")),
    lastUpdated: String(row.updated_at ?? row.created_at).slice(0, 10),
    sources: [defaultSource],
    heroImage: heroFromRow(row),
  };
}

export function mapLocationRow(row: Record<string, unknown>): Location {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description ?? ""),
    locationType: String(row.location_type),
    region: row.region != null ? String(row.region) : undefined,
    realWorldInspiration:
      row.real_world_inspiration != null
        ? String(row.real_world_inspiration)
        : undefined,
    verificationStatus: vs(String(row.verification_status ?? "unverified")),
    lastUpdated: String(row.updated_at ?? row.created_at).slice(0, 10),
    sources: [defaultSource],
    heroImage: heroFromRow(row),
  };
}

export function mapVehicleRow(row: Record<string, unknown>): Vehicle {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description ?? ""),
    manufacturer:
      row.manufacturer != null ? String(row.manufacturer) : undefined,
    vehicleCategory: String(row.vehicle_category),
    verificationStatus: vs(String(row.verification_status ?? "unverified")),
    lastUpdated: String(row.updated_at ?? row.created_at).slice(0, 10),
    sources: [defaultSource],
    heroImage: heroFromRow(row),
  };
}

export function mapBusinessRow(
  row: Record<string, unknown>,
  locationSlug?: string,
): Business {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description ?? ""),
    businessCategory: String(row.business_category),
    locationSlug,
    verificationStatus: vs(String(row.verification_status ?? "unverified")),
    lastUpdated: String(row.updated_at ?? row.created_at).slice(0, 10),
    sources: [defaultSource],
    heroImage: heroFromRow(row),
  };
}

export function mapDiscoveryRow(row: Record<string, unknown>): Discovery {
  return {
    id: String(row.id),
    name: String(row.title),
    slug: String(row.slug),
    description: String(row.description ?? ""),
    discoveryCategory: String(row.category),
    verificationStatus: vs(String(row.verification_status ?? "unverified")),
    lastUpdated: String(row.updated_at ?? row.created_at).slice(0, 10),
    sources: [defaultSource],
    heroImage: heroFromRow(row),
  };
}

export function mapArticleRow(row: Record<string, unknown>): Article {
  const slug = String(row.slug);
  const kind = String(row.article_kind ?? "guide");
  const isNews = kind === "news";
  return {
    id: String(row.id),
    title: String(row.title),
    slug,
    excerpt: String(row.excerpt ?? ""),
    content: String(row.content ?? ""),
    category: isNews ? "news" : "guide",
    guideCategory: isNews ? undefined : "Guide",
    author: "GTA6AtlasHQ",
    publishedAt: String(row.published_at ?? row.updated_at).slice(0, 10),
    updatedAt: String(row.updated_at).slice(0, 10),
    verificationStatus: "officially_confirmed",
    tags: [],
    heroImage: heroFromRow(row),
  };
}