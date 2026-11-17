export const VERIFICATION_STATUSES = [
  "officially_confirmed",
  "reported",
  "community_discovery",
  "speculation",
  "unverified",
] as const;

export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export type EntityType =
  | "character"
  | "location"
  | "vehicle"
  | "business"
  | "guide"
  | "news"
  | "discovery";

export interface Source {
  id: string;
  title: string;
  url: string;
  publisher: string;
  sourceType: string;
  publicationDate?: string;
}

export interface BaseEntity {
  id: string;
  name: string;
  slug: string;
  description: string;
  verificationStatus: VerificationStatus;
  lastUpdated: string;
  sources: Source[];
  /** Public site path or resolved CDN URL for cards and detail heroes. */
  heroImage?: string;
}

export interface Character extends BaseEntity {
  aliases?: string[];
  role?: string;
  category?: string;
}

export interface Location extends BaseEntity {
  locationType: string;
  region?: string;
  realWorldInspiration?: string;
}

export interface Vehicle extends BaseEntity {
  manufacturer?: string;
  vehicleCategory: string;
  realWorldInspiration?: string;
}

export interface Business extends BaseEntity {
  businessCategory: string;
  locationSlug?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: "guide" | "news";
  guideCategory?: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  verificationStatus: VerificationStatus;
  tags: string[];
  heroImage?: string;
}

export interface Discovery extends BaseEntity {
  discoveryCategory: string;
  contributor?: string;
}

export type SearchResultItem = {
  id: string;
  title: string;
  description: string;
  slug: string;
  entityType: EntityType;
  verificationStatus: VerificationStatus;
};