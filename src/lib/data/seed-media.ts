import {
  articles,
  businesses,
  characters,
  discoveries,
  locations,
  vehicles,
} from "./seed";
import { SEED_MAP_LAYERS } from "./edition-seed";

function collectEntityImages(): Record<string, string> {
  const map: Record<string, string> = {};

  const add = (prefix: string, slug: string, hero?: string) => {
    if (hero) map[`${prefix}:${slug}`] = hero;
  };

  for (const c of characters) add("character", c.slug, c.heroImage);
  for (const l of locations) add("location", l.slug, l.heroImage);
  for (const v of vehicles) add("vehicle", v.slug, v.heroImage);
  for (const b of businesses) add("business", b.slug, b.heroImage);
  for (const d of discoveries) add("discovery", d.slug, d.heroImage);
  for (const a of articles) add("article", a.slug, a.heroImage);
  for (const layer of SEED_MAP_LAYERS) {
    add("map-layer", layer.slug, layer.heroImage);
  }

  return map;
}

/** Local public paths for seeding Storage + hero_image_path. Keys: `character:lucia`, etc. */
export const SEED_ENTITY_IMAGES: Record<string, string> = collectEntityImages();

/** Optional: sync entire curated editions folder (not all rockstar files by default). */
export const SEED_CURATED_EDITION_FILES = [
  "/images/editions/ultimate-edition.jpg",
  "/images/editions/lucia-jason-club.jpg",
  "/images/editions/harbor-sunset.jpg",
  "/images/hero-vice-sunset.jpg",
] as const;