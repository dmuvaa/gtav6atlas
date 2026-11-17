import { slugify } from "@/lib/cms/slug";
import { getAllEditionStills, type EditionStill } from "@/lib/media/editions";
import type { Business, Discovery, Vehicle } from "@/lib/types";
import { ROCKSTAR_TRAILER_SOURCE } from "./seed-core";

const official = "officially_confirmed" as const;

function titleCaseWords(input: string): string {
  return input
    .split(/\s+/)
    .map((w) =>
      w.length <= 3
        ? w.toUpperCase()
        : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
    )
    .join(" ");
}

function packGroupKey(src: string): string | null {
  const file = (src.split("/").pop() ?? "").replace(/\.[^.]+$/, "");
  const ue = file.match(/^(ULTIMATE_EDITION_[A-Z0-9_]+?)_\d+/i);
  if (ue) return ue[1];
  const vvc = file.match(/^(VINTAGE_VICE_CITY_[A-Z0-9_]+?)_\d+/i);
  if (vvc) return vvc[1];
  const biz = file.match(/^(ULTIMATE_EDITION_(?:SARAS_SALON|PTT_STORE|RIDEOUT_CUSTOMS))_\d+/i);
  if (biz) return biz[1];
  return null;
}

function vehicleLabelFromPackKey(key: string): string {
  let label = key
    .replace(/^ULTIMATE_EDITION_/i, "")
    .replace(/^VINTAGE_VICE_CITY_/i, "Vintage Vice City ")
    .replace(/_/g, " ")
    .trim();
  return titleCaseWords(label);
}

function inferManufacturer(title: string): string | undefined {
  const brands = [
    "Vapid",
    "Grotti",
    "Pegassi",
    "Dinka",
    "Hawk",
    "Declasse",
    "Annis",
    "Bravado",
  ];
  const lower = title.toLowerCase();
  return brands.find((b) => lower.includes(b.toLowerCase()));
}

function vehicleFromStill(
  still: EditionStill,
  slug: string,
  name?: string,
): Vehicle {
  const displayName = name ?? still.title;
  return {
    id: `veh-edition-${slug}`,
    name: displayName,
    slug,
    description: still.caption,
    manufacturer: inferManufacturer(displayName),
    vehicleCategory: "Cars",
    verificationStatus: official,
    lastUpdated: "2025-11-17",
    sources: [ROCKSTAR_TRAILER_SOURCE],
    heroImage: still.src,
  };
}

export function buildEditionVehicles(existingSlugs: Set<string>): Vehicle[] {
  const stills = getAllEditionStills();
  const bySlug = new Map<string, Vehicle>();
  const packs = new Map<string, EditionStill>();

  for (const still of stills) {
    const isVehicle =
      still.category === "Vehicles" || still.subjects.includes("Vehicles");
    if (!isVehicle) continue;

    const pack = packGroupKey(still.src);
    if (pack) {
      if (!packs.has(pack)) packs.set(pack, still);
      continue;
    }

    const slug = slugify(still.title);
    if (existingSlugs.has(slug) || bySlug.has(slug)) continue;
    bySlug.set(slug, vehicleFromStill(still, slug));
  }

  for (const [pack, still] of packs) {
    const name = vehicleLabelFromPackKey(pack);
    const slug = slugify(name);
    if (existingSlugs.has(slug) || bySlug.has(slug)) continue;
    bySlug.set(slug, vehicleFromStill(still, slug, name));
  }

  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name));
}

const SHOP_PACK_MARKERS = [
  "SARAS_SALON",
  "PTT_STORE",
  "RIDEOUT_CUSTOMS",
  "ONE_EYED_WILLIE",
  "GOODTIME_GEAR",
] as const;

function isVerifiedShopStill(still: EditionStill): boolean {
  if (
    still.category === "Businesses & shops" &&
    !still.src.includes("/rockstar/")
  ) {
    return true;
  }
  const pack = packGroupKey(still.src);
  if (!pack) return false;
  return SHOP_PACK_MARKERS.some((marker) => pack.includes(marker));
}

export function buildEditionBusinesses(existingSlugs: Set<string>): Business[] {
  const items: Business[] = [];
  const seenPack = new Set<string>();

  for (const still of getAllEditionStills()) {
    if (!isVerifiedShopStill(still)) continue;

    const pack = packGroupKey(still.src);
    const slug = pack
      ? slugify(vehicleLabelFromPackKey(pack))
      : slugify(still.title);
    if (existingSlugs.has(slug) || seenPack.has(slug)) continue;
    seenPack.add(slug);

    const name = pack ? vehicleLabelFromPackKey(pack) : still.title;

    let businessCategory = "Retail";
    const lower = name.toLowerCase();
    if (lower.includes("salon")) businessCategory = "Salon";
    else if (lower.includes("store") || lower.includes("ptt"))
      businessCategory = "Retail";
    else if (lower.includes("customs")) businessCategory = "Automotive";
    else if (lower.includes("van") || lower.includes("tour"))
      businessCategory = "Services";

    items.push({
      id: `biz-edition-${slug}`,
      name,
      slug,
      description: still.caption,
      businessCategory,
      locationSlug: still.subjects.includes("Vice City") ? "vice-city" : "leonida",
      verificationStatus: official,
      lastUpdated: "2025-11-17",
      sources: [ROCKSTAR_TRAILER_SOURCE],
      heroImage: still.src,
    });
  }

  return items.sort((a, b) => a.name.localeCompare(b.name));
}

export function buildEditionDiscoveries(existingSlugs: Set<string>): Discovery[] {
  const items: Discovery[] = [];

  for (const still of getAllEditionStills()) {
    const slug = slugify(`edition-ref-${still.id}`);
    if (existingSlugs.has(slug)) continue;

    let category: string = still.category;
    if (category === "All" || category === "Curated" || category === "Promo") {
      category = "Official marketing";
    }

    items.push({
      id: `disc-edition-${still.id}`,
      name: still.title,
      slug,
      description: still.caption,
      discoveryCategory: category,
      verificationStatus: official,
      lastUpdated: "2025-11-17",
      sources: [ROCKSTAR_TRAILER_SOURCE],
      contributor: "GTA6AtlasHQ (edition reference)",
      heroImage: still.src,
    });
  }

  return items;
}

export const SEED_MAP_LAYERS = [
  {
    name: "Leonida — key art overlay",
    slug: "leonida-key-art",
    description:
      "Reference layer built from official GTA VI edition key art and locality labels. Not georeferenced — for visual orientation only until verified coordinates exist.",
    layer_type: "reference",
    sort_order: 0,
    heroImage: "/images/editions/ultimate-edition.jpg",
  },
  {
    name: "Vice City — Ocean Drive reference",
    slug: "vice-city-ocean-drive-ref",
    description:
      "Marketing stills referencing Vice City neon corridors and coastal architecture from Rockstar’s editions page.",
    layer_type: "reference",
    sort_order: 10,
    heroImage: "/images/editions/stanier-ocean-drive-night.jpg",
  },
] as const;