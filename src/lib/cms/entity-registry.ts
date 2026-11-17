import type { z } from "zod";
import type { UserRole } from "@/lib/auth/roles";
import { slugify } from "./slug";
import {
  articleCreateSchema,
  businessCreateSchema,
  characterCreateSchema,
  discoveryCreateSchema,
  locationCreateSchema,
  mapLayerCreateSchema,
  mapMarkerCreateSchema,
  mediaAssetCreateSchema,
  sourceCreateSchema,
  vehicleCreateSchema,
} from "./schemas";

export type CmsEntityKey =
  | "character"
  | "location"
  | "vehicle"
  | "business"
  | "discovery"
  | "article"
  | "map-layer"
  | "map-marker"
  | "source"
  | "media-asset";

export type CmsFieldType =
  | "text"
  | "textarea"
  | "number"
  | "checkbox"
  | "select"
  | "uuid"
  | "hero"
  | "location";

export type CmsFieldConfig = {
  name: string;
  label: string;
  type: CmsFieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
};

export type CmsEntityDefinition = {
  key: CmsEntityKey;
  label: string;
  labelPlural: string;
  table: string;
  minimumRole: UserRole;
  schema: z.ZodTypeAny;
  fields: CmsFieldConfig[];
  toRow: (input: Record<string, unknown>) => Record<string, unknown>;
  fromRow?: (row: Record<string, unknown>) => Record<string, unknown>;
  publicPath?: (slug: string) => string;
  resolvePublicPath?: (row: Record<string, unknown>) => string | undefined;
};

const verificationOptions = [
  { value: "officially_confirmed", label: "Officially confirmed" },
  { value: "reported", label: "Reported" },
  { value: "community_discovery", label: "Community discovery" },
  { value: "speculation", label: "Speculation" },
  { value: "unverified", label: "Unverified" },
];

function parseAliases(input: Record<string, unknown>): string[] {
  if (Array.isArray(input.aliases) && input.aliases.length) {
    return input.aliases.map(String);
  }
  if (typeof input.aliases_text === "string" && input.aliases_text.trim()) {
    return input.aliases_text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function optionalPath(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

function optionalUuid(v: unknown): string | null {
  if (v === null || v === undefined || v === "") return null;
  return String(v);
}

function baseEntityFields(): CmsFieldConfig[] {
  return [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "slug", label: "Slug (optional)", type: "text", placeholder: "auto-from-name" },
    { name: "description", label: "Description", type: "textarea", required: true },
    {
      name: "verification_status",
      label: "Verification",
      type: "select",
      options: verificationOptions,
    },
    { name: "hero_image_path", label: "Hero image", type: "hero" },
    { name: "published", label: "Published on site", type: "checkbox" },
  ];
}

function baseFromRow(row: Record<string, unknown>) {
  return {
    name: row.name ?? "",
    slug: row.slug ?? "",
    description: row.description ?? "",
    verification_status: row.verification_status ?? "unverified",
    hero_image_path: row.hero_image_path ?? "",
    published: Boolean(row.published),
  };
}

export const CMS_ENTITIES: Record<CmsEntityKey, CmsEntityDefinition> = {
  character: {
    key: "character",
    label: "Character",
    labelPlural: "Characters",
    table: "characters",
    minimumRole: "editor",
    schema: characterCreateSchema,
    fields: [
      ...baseEntityFields(),
      { name: "role", label: "Role (e.g. Protagonist)", type: "text" },
      { name: "category", label: "Category", type: "text" },
      { name: "aliases_text", label: "Aliases (comma-separated)", type: "text" },
    ],
    toRow: (input) => {
      const name = String(input.name);
      const slug = String(input.slug || slugify(name));
      return {
        name,
        slug,
        description: input.description ?? "",
        role: input.role ?? null,
        category: input.category ?? null,
        aliases: parseAliases(input),
        hero_image_path: optionalPath(input.hero_image_path),
        verification_status: input.verification_status ?? "unverified",
        published: Boolean(input.published),
        updated_at: new Date().toISOString(),
      };
    },
    fromRow: (row) => ({
      ...baseFromRow(row),
      role: row.role ?? "",
      category: row.category ?? "",
      aliases_text: Array.isArray(row.aliases)
        ? row.aliases.join(", ")
        : "",
    }),
    publicPath: (slug) => `/characters/${slug}`,
  },
  location: {
    key: "location",
    label: "Location",
    labelPlural: "Locations",
    table: "locations",
    minimumRole: "editor",
    schema: locationCreateSchema,
    fields: [
      ...baseEntityFields().map((f) =>
        f.name === "name" ? { ...f, label: "Location name" } : f,
      ),
      { name: "location_type", label: "Type", type: "text", required: true },
      { name: "region", label: "Region", type: "text" },
      {
        name: "real_world_inspiration",
        label: "Real-world inspiration",
        type: "text",
      },
      { name: "latitude", label: "Latitude", type: "number" },
      { name: "longitude", label: "Longitude", type: "number" },
      { name: "coordinate_precision", label: "Coordinate precision", type: "text" },
    ],
    toRow: (input) => {
      const name = String(input.name);
      return {
        name,
        slug: String(input.slug || slugify(name)),
        description: input.description ?? "",
        location_type: input.location_type,
        region: input.region ?? null,
        real_world_inspiration: input.real_world_inspiration ?? null,
        hero_image_path: optionalPath(input.hero_image_path),
        latitude: input.latitude ?? null,
        longitude: input.longitude ?? null,
        coordinate_precision: input.coordinate_precision ?? null,
        verification_status: input.verification_status ?? "unverified",
        published: Boolean(input.published),
        updated_at: new Date().toISOString(),
      };
    },
    fromRow: (row) => ({
      ...baseFromRow(row),
      location_type: row.location_type ?? "",
      region: row.region ?? "",
      real_world_inspiration: row.real_world_inspiration ?? "",
      latitude: row.latitude ?? "",
      longitude: row.longitude ?? "",
      coordinate_precision: row.coordinate_precision ?? "",
    }),
    publicPath: (slug) => `/locations/${slug}`,
  },
  vehicle: {
    key: "vehicle",
    label: "Vehicle",
    labelPlural: "Vehicles",
    table: "vehicles",
    minimumRole: "editor",
    schema: vehicleCreateSchema,
    fields: [
      ...baseEntityFields(),
      { name: "manufacturer", label: "Manufacturer", type: "text" },
      { name: "vehicle_category", label: "Category", type: "text", required: true },
    ],
    toRow: (input) => {
      const name = String(input.name);
      return {
        name,
        slug: String(input.slug || slugify(name)),
        description: input.description ?? "",
        manufacturer: input.manufacturer ?? null,
        vehicle_category: input.vehicle_category,
        hero_image_path: optionalPath(input.hero_image_path),
        verification_status: input.verification_status ?? "unverified",
        published: Boolean(input.published),
        updated_at: new Date().toISOString(),
      };
    },
    fromRow: (row) => ({
      ...baseFromRow(row),
      manufacturer: row.manufacturer ?? "",
      vehicle_category: row.vehicle_category ?? "",
    }),
    publicPath: (slug) => `/vehicles/${slug}`,
  },
  business: {
    key: "business",
    label: "Business",
    labelPlural: "Businesses",
    table: "businesses",
    minimumRole: "editor",
    schema: businessCreateSchema,
    fields: [
      ...baseEntityFields(),
      { name: "business_category", label: "Category", type: "text", required: true },
      { name: "location_id", label: "Location", type: "location" },
    ],
    toRow: (input) => {
      const name = String(input.name);
      return {
        name,
        slug: String(input.slug || slugify(name)),
        description: input.description ?? "",
        business_category: input.business_category,
        location_id: optionalUuid(input.location_id),
        hero_image_path: optionalPath(input.hero_image_path),
        verification_status: input.verification_status ?? "unverified",
        published: Boolean(input.published),
        updated_at: new Date().toISOString(),
      };
    },
    fromRow: (row) => ({
      ...baseFromRow(row),
      business_category: row.business_category ?? "",
      location_id: row.location_id ?? "",
    }),
    publicPath: (slug) => `/businesses/${slug}`,
  },
  discovery: {
    key: "discovery",
    label: "Discovery",
    labelPlural: "Discoveries",
    table: "discoveries",
    minimumRole: "editor",
    schema: discoveryCreateSchema,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug (optional)", type: "text" },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "hero_image_path", label: "Hero image", type: "hero" },
      { name: "location_id", label: "Location", type: "location" },
      {
        name: "verification_status",
        label: "Verification",
        type: "select",
        options: verificationOptions,
      },
      {
        name: "moderation_status",
        label: "Moderation",
        type: "select",
        options: [
          { value: "pending", label: "Pending" },
          { value: "approved", label: "Approved" },
          { value: "rejected", label: "Rejected" },
        ],
      },
      { name: "published", label: "Published", type: "checkbox" },
    ],
    toRow: (input) => {
      const title = String(input.title);
      return {
        title,
        slug: String(input.slug || slugify(title)),
        description: input.description ?? "",
        category: input.category,
        location_id: optionalUuid(input.location_id),
        hero_image_path: optionalPath(input.hero_image_path),
        verification_status: input.verification_status ?? "unverified",
        moderation_status: input.moderation_status ?? "pending",
        published: Boolean(input.published),
        updated_at: new Date().toISOString(),
      };
    },
    fromRow: (row) => ({
      title: row.title ?? "",
      slug: row.slug ?? "",
      description: row.description ?? "",
      category: row.category ?? "",
      location_id: row.location_id ?? "",
      hero_image_path: row.hero_image_path ?? "",
      verification_status: row.verification_status ?? "unverified",
      moderation_status: row.moderation_status ?? "pending",
      published: Boolean(row.published),
    }),
    publicPath: (slug) => `/discoveries/${slug}`,
  },
  article: {
    key: "article",
    label: "Article",
    labelPlural: "Articles",
    table: "articles",
    minimumRole: "editor",
    schema: articleCreateSchema,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "content", label: "Content", type: "textarea", required: true },
      {
        name: "article_kind",
        label: "Kind",
        type: "select",
        options: [
          { value: "guide", label: "Guide" },
          { value: "news", label: "News" },
        ],
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "draft", label: "Draft" },
          { value: "published", label: "Published" },
        ],
      },
      { name: "seo_title", label: "SEO title", type: "text" },
      { name: "seo_description", label: "SEO description", type: "textarea" },
      { name: "hero_image_path", label: "Hero image", type: "hero" },
    ],
    toRow: (input) => {
      const title = String(input.title);
      const status = String(input.status ?? "draft");
      const articleKind = String(input.article_kind ?? "guide");
      return {
        title,
        slug: String(input.slug || slugify(title)),
        excerpt: input.excerpt ?? "",
        content: input.content ?? "",
        article_kind: articleKind,
        status,
        published_at: status === "published" ? new Date().toISOString() : null,
        seo_title: input.seo_title ?? null,
        seo_description: input.seo_description ?? null,
        hero_image_path: optionalPath(input.hero_image_path),
        updated_at: new Date().toISOString(),
      };
    },
    fromRow: (row) => ({
      title: row.title ?? "",
      slug: row.slug ?? "",
      excerpt: row.excerpt ?? "",
      content: row.content ?? "",
      article_kind: row.article_kind ?? "guide",
      status: row.status ?? "draft",
      seo_title: row.seo_title ?? "",
      seo_description: row.seo_description ?? "",
      hero_image_path: row.hero_image_path ?? "",
    }),
    resolvePublicPath: (row) => {
      const slug = String(row.slug ?? "");
      if (!slug) return undefined;
      return row.article_kind === "news"
        ? `/news/${slug}`
        : `/guides/${slug}`;
    },
    publicPath: (slug) => `/guides/${slug}`,
  },
  "map-layer": {
    key: "map-layer",
    label: "Map layer",
    labelPlural: "Map layers",
    table: "map_layers",
    minimumRole: "editor",
    schema: mapLayerCreateSchema,
    fields: [
      { name: "name", label: "Layer name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "layer_type", label: "Layer type", type: "text" },
      { name: "storage_path", label: "Storage path (map-assets)", type: "text" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "published", label: "Published", type: "checkbox" },
    ],
    toRow: (input) => {
      const name = String(input.name);
      return {
        name,
        slug: String(input.slug || slugify(name)),
        description: input.description ?? "",
        layer_type: input.layer_type ?? "overlay",
        storage_path: optionalPath(input.storage_path),
        sort_order: Number(input.sort_order ?? 0),
        published: Boolean(input.published),
        updated_at: new Date().toISOString(),
      };
    },
    fromRow: (row) => ({
      name: row.name ?? "",
      slug: row.slug ?? "",
      description: row.description ?? "",
      layer_type: row.layer_type ?? "overlay",
      storage_path: row.storage_path ?? "",
      sort_order: row.sort_order ?? 0,
      published: Boolean(row.published),
    }),
  },
  "map-marker": {
    key: "map-marker",
    label: "Map marker",
    labelPlural: "Map markers",
    table: "map_markers",
    minimumRole: "editor",
    schema: mapMarkerCreateSchema,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "layer_id", label: "Layer ID", type: "uuid" },
      { name: "location_id", label: "Location ID", type: "uuid" },
      { name: "latitude", label: "Latitude", type: "number" },
      { name: "longitude", label: "Longitude", type: "number" },
      { name: "coordinate_precision", label: "Precision", type: "text" },
      { name: "icon_key", label: "Icon key", type: "text" },
      { name: "published", label: "Published", type: "checkbox" },
    ],
    toRow: (input) => ({
      title: input.title,
      description: input.description ?? "",
      layer_id: optionalUuid(input.layer_id),
      location_id: optionalUuid(input.location_id),
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      coordinate_precision: input.coordinate_precision ?? null,
      icon_key: input.icon_key ?? null,
      published: Boolean(input.published),
      updated_at: new Date().toISOString(),
    }),
    fromRow: (row) => ({
      title: row.title ?? "",
      description: row.description ?? "",
      layer_id: row.layer_id ?? "",
      location_id: row.location_id ?? "",
      latitude: row.latitude ?? "",
      longitude: row.longitude ?? "",
      coordinate_precision: row.coordinate_precision ?? "",
      icon_key: row.icon_key ?? "",
      published: Boolean(row.published),
    }),
  },
  source: {
    key: "source",
    label: "Source",
    labelPlural: "Sources",
    table: "sources",
    minimumRole: "editor",
    schema: sourceCreateSchema,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "url", label: "URL", type: "text", required: true },
      { name: "publisher", label: "Publisher", type: "text" },
      { name: "source_type", label: "Type", type: "text" },
      { name: "publication_date", label: "Publication date", type: "text" },
    ],
    toRow: (input) => ({
      title: input.title,
      url: input.url,
      publisher: input.publisher ?? null,
      source_type: input.source_type ?? null,
      publication_date: input.publication_date ?? null,
      accessed_at: new Date().toISOString(),
    }),
    fromRow: (row) => ({
      title: row.title ?? "",
      url: row.url ?? "",
      publisher: row.publisher ?? "",
      source_type: row.source_type ?? "",
      publication_date: row.publication_date ?? "",
    }),
  },
  "media-asset": {
    key: "media-asset",
    label: "Media asset",
    labelPlural: "Media assets",
    table: "media_assets",
    minimumRole: "editor",
    schema: mediaAssetCreateSchema,
    fields: [
      {
        name: "bucket",
        label: "Bucket",
        type: "select",
        options: [
          { value: "entity-media", label: "entity-media" },
          { value: "map-assets", label: "map-assets" },
        ],
      },
      { name: "object_path", label: "Object path", type: "text", required: true },
      { name: "entity_type", label: "Entity type", type: "text", required: true },
      { name: "entity_id", label: "Entity ID", type: "uuid" },
      { name: "alt_text", label: "Alt text", type: "text" },
    ],
    toRow: (input) => ({
      bucket: input.bucket,
      object_path: input.object_path,
      entity_type: input.entity_type,
      entity_id: input.entity_id ?? null,
      alt_text: input.alt_text ?? null,
      mime_type: input.mime_type ?? null,
      byte_size: input.byte_size ?? null,
    }),
  },
};

export const CMS_ENTITY_LIST = Object.values(CMS_ENTITIES);