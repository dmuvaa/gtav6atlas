import { z } from "zod";
import { VERIFICATION_STATUSES } from "@/lib/types";

const verification = z.enum(VERIFICATION_STATUSES);
const slug = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase slug format");

const heroPath = z.string().max(500).optional();

const withSlug = <T extends z.ZodRawShape>(shape: T) =>
  z.object({
    ...shape,
    slug: slug.optional(),
  });

export const characterCreateSchema = withSlug({
  name: z.string().min(1).max(200),
  description: z.string().max(20_000).default(""),
  role: z.string().max(120).optional(),
  category: z.string().max(120).optional(),
  aliases: z.array(z.string().max(80)).default([]),
  aliases_text: z.string().max(1000).optional(),
  hero_image_path: heroPath,
  verification_status: verification.default("unverified"),
  published: z.boolean().default(false),
});

export const locationCreateSchema = withSlug({
  name: z.string().min(1).max(200),
  description: z.string().max(20_000).default(""),
  location_type: z.string().min(1).max(80),
  region: z.string().max(120).optional(),
  real_world_inspiration: z.string().max(500).optional(),
  latitude: z.number().finite().optional(),
  longitude: z.number().finite().optional(),
  coordinate_precision: z.string().max(80).optional(),
  hero_image_path: heroPath,
  verification_status: verification.default("unverified"),
  published: z.boolean().default(false),
});

export const vehicleCreateSchema = withSlug({
  name: z.string().min(1).max(200),
  description: z.string().max(20_000).default(""),
  manufacturer: z.string().max(120).optional(),
  vehicle_category: z.string().min(1).max(80),
  hero_image_path: heroPath,
  verification_status: verification.default("unverified"),
  published: z.boolean().default(false),
});

export const businessCreateSchema = withSlug({
  name: z.string().min(1).max(200),
  description: z.string().max(20_000).default(""),
  business_category: z.string().min(1).max(80),
  location_id: z.string().uuid().optional().nullable(),
  hero_image_path: heroPath,
  verification_status: verification.default("unverified"),
  published: z.boolean().default(false),
});

export const discoveryCreateSchema = withSlug({
  title: z.string().min(1).max(200),
  description: z.string().max(20_000).default(""),
  category: z.string().min(1).max(80),
  location_id: z.string().uuid().optional().nullable(),
  hero_image_path: heroPath,
  verification_status: verification.default("unverified"),
  published: z.boolean().default(false),
  moderation_status: z.enum(["pending", "approved", "rejected"]).default("pending"),
});

export const articleCreateSchema = withSlug({
  title: z.string().min(1).max(200),
  excerpt: z.string().max(2000).default(""),
  content: z.string().max(100_000).default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  seo_title: z.string().max(120).optional(),
  seo_description: z.string().max(300).optional(),
  article_kind: z.enum(["guide", "news"]).default("guide"),
  hero_image_path: heroPath,
});

export const mapLayerCreateSchema = withSlug({
  name: z.string().min(1).max(200),
  description: z.string().max(5000).default(""),
  layer_type: z.string().max(80).default("overlay"),
  storage_path: z.string().max(500).optional(),
  sort_order: z.number().int().default(0),
  published: z.boolean().default(false),
});

export const mapMarkerCreateSchema = z.object({
  layer_id: z.string().uuid().optional(),
  location_id: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).default(""),
  latitude: z.number().finite().optional(),
  longitude: z.number().finite().optional(),
  coordinate_precision: z.string().max(80).optional(),
  icon_key: z.string().max(80).optional(),
  published: z.boolean().default(false),
});

export const sourceCreateSchema = z.object({
  title: z.string().min(1).max(200),
  url: z.string().url(),
  publisher: z.string().max(120).optional(),
  source_type: z.string().max(80).optional(),
  publication_date: z.string().date().optional(),
});

export const mediaAssetCreateSchema = z.object({
  bucket: z.enum([
    "entity-media",
    "map-assets",
    "submission-evidence",
    "avatars",
  ]),
  object_path: z.string().min(1).max(500),
  entity_type: z.string().min(1).max(40),
  entity_id: z.string().uuid().optional(),
  alt_text: z.string().max(300).optional(),
  mime_type: z.string().max(120).optional(),
  byte_size: z.number().int().optional(),
});