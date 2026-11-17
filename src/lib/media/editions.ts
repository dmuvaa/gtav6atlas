/** Reference stills from Rockstar’s GTA VI editions page (visual reference only). */
import rockstarManifest from "./editions-manifest.json";

export const ROCKSTAR_VI_EDITIONS_URL =
  "https://www.rockstargames.com/VI/editions";

export type EditionCategory =
  | "All"
  | "Editions"
  | "Vehicles"
  | "Weapons"
  | "Vice City style"
  | "Businesses & shops"
  | "Promo"
  | "Curated";

export type EditionStill = {
  id: string;
  src: string;
  title: string;
  caption: string;
  category: EditionCategory;
  subjects: string[];
  sourceUrl?: string;
};

/** Hand-curated stills (your uploads + captions). */
const CURATED_STILLS: EditionStill[] = [
  {
    id: "ultimate-edition",
    src: "/images/editions/ultimate-edition.jpg",
    title: "Ultimate Edition key art",
    caption: "Collage key art showcasing Leonida, protagonists and vehicles.",
    category: "Editions",
    subjects: ["Leonida", "Lucia", "Jason", "Vice City"],
    sourceUrl: ROCKSTAR_VI_EDITIONS_URL,
  },
  {
    id: "lucia-jason-pistols-pool",
    src: "/images/editions/lucia-jason-pistols-pool.jpg",
    title: "Personalized pistols — poolside",
    caption: "Jason and Lucia’s engraved pistols with Vice City pink accents.",
    category: "Weapons",
    subjects: ["Lucia", "Jason", "Weapons"],
    sourceUrl: ROCKSTAR_VI_EDITIONS_URL,
  },
  {
    id: "lucia-jason-poolside",
    src: "/images/editions/lucia-jason-poolside.jpg",
    title: "Lucia & Jason — poolside",
    caption: "Tropical luxury patio with teal cushions and golden-hour light.",
    category: "Curated",
    subjects: ["Lucia", "Jason", "Vice City"],
    sourceUrl: ROCKSTAR_VI_EDITIONS_URL,
  },
  {
    id: "lucia-tiger-boots",
    src: "/images/editions/lucia-tiger-boots.jpg",
    title: "Lucia — tiger boots",
    caption: "Low-angle Vice City architecture and pink-forward styling.",
    category: "Vice City style",
    subjects: ["Lucia", "Vice City"],
    sourceUrl: ROCKSTAR_VI_EDITIONS_URL,
  },
  {
    id: "jason-tropical-shirt",
    src: "/images/editions/jason-tropical-shirt.jpg",
    title: "Jason — tropical shirt",
    caption: "Hibiscus print and mint architecture — Leonida luxury vibe.",
    category: "Vice City style",
    subjects: ["Jason", "Vice City"],
    sourceUrl: ROCKSTAR_VI_EDITIONS_URL,
  },
  {
    id: "stockyard-art-tour-van",
    src: "/images/editions/stockyard-art-tour-van.jpg",
    title: "Stockyard 305 art tour van",
    caption: "Magenta stickers and street-art backdrop — official pink in the wild.",
    category: "Businesses & shops",
    subjects: ["Vice City", "Lucia", "Jason"],
    sourceUrl: ROCKSTAR_VI_EDITIONS_URL,
  },
  {
    id: "jason-spray-paint-rack",
    src: "/images/editions/jason-spray-paint-rack.jpg",
    title: "Jason — spray paint rack",
    caption: "Neon magenta accents on apparel matching GTA VI marketing pink.",
    category: "Vice City style",
    subjects: ["Jason"],
    sourceUrl: ROCKSTAR_VI_EDITIONS_URL,
  },
  {
    id: "stilt-house-yellow-truck",
    src: "/images/editions/stilt-house-yellow-truck.jpg",
    title: "Stilt house & yellow truck",
    caption: "Coastal Leonida shack with muscle pickup — outside Vice City core.",
    category: "Vehicles",
    subjects: ["Leonida", "Locations", "Vehicles"],
    sourceUrl: ROCKSTAR_VI_EDITIONS_URL,
  },
  {
    id: "dinka-motorcycle",
    src: "/images/editions/dinka-motorcycle.jpg",
    title: "Dinka scrambler",
    caption: "Olive scrambler against teal garage door.",
    category: "Vehicles",
    subjects: ["Vehicles"],
    sourceUrl: ROCKSTAR_VI_EDITIONS_URL,
  },
  {
    id: "vapid-dominator-mud",
    src: "/images/editions/vapid-dominator-mud.jpg",
    title: "’67 Vapid Dominator buggy",
    caption: "Mud racing build from Ultimate Edition content.",
    category: "Vehicles",
    subjects: ["Vehicles", "Leonida"],
    sourceUrl: ROCKSTAR_VI_EDITIONS_URL,
  },
  {
    id: "stanier-ocean-drive-night",
    src: "/images/editions/stanier-ocean-drive-night.jpg",
    title: "Vapid Stanier — Ocean Drive night",
    caption: "Neon Vice City behind Lucia and Jason.",
    category: "Vehicles",
    subjects: ["Vice City", "Vehicles", "Lucia", "Jason"],
    sourceUrl: ROCKSTAR_VI_EDITIONS_URL,
  },
  {
    id: "cheetah-sunset",
    src: "/images/editions/cheetah-sunset.jpg",
    title: "Grotti Cheetah — sunset",
    caption: "Pegassi Residences and pink sky.",
    category: "Vehicles",
    subjects: ["Vehicles", "Vice City"],
    sourceUrl: ROCKSTAR_VI_EDITIONS_URL,
  },
];

function humanizeRockstarFilename(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "");
  let label = base
    .replace(/^GTAVI_FOB_/, "")
    .replace(/^ULTIMATE_EDITION_/, "")
    .replace(/^VINTAGE_VICE_CITY_PACK_/, "Vintage Vice City — ")
    .replace(/_\d+$/g, "")
    .replace(/\./g, " ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return label
    .split(" ")
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join(" ");
}

function mapManifestItem(
  raw: (typeof rockstarManifest)[number],
): EditionStill {
  const file = raw.src.split("/").pop() ?? raw.id;
  return {
    id: raw.id,
    src: raw.src,
    title: humanizeRockstarFilename(file),
    caption: `Official GTA VI editions asset — ${humanizeRockstarFilename(file)}`,
    category: (raw.category as EditionCategory) ?? "Promo",
    subjects: raw.subjects ?? ["Rockstar reference"],
    sourceUrl: raw.sourceUrl ?? ROCKSTAR_VI_EDITIONS_URL,
  };
}

const curatedSrc = new Set(CURATED_STILLS.map((s) => s.src));

const ROCKSTAR_FETCHED: EditionStill[] = (rockstarManifest as (typeof rockstarManifest)[number][])
  .filter((item) => !curatedSrc.has(item.src))
  .map(mapManifestItem);

/** Full gallery: curated uploads + every still pulled from Rockstar’s editions page HTML. */
export function getAllEditionStills(): EditionStill[] {
  return [...CURATED_STILLS, ...ROCKSTAR_FETCHED];
}

export const EDITION_CATEGORIES: EditionCategory[] = [
  "All",
  "Curated",
  "Editions",
  "Vehicles",
  "Weapons",
  "Vice City style",
  "Businesses & shops",
  "Promo",
];

export function getEditionStillsByCategory(
  category: EditionCategory,
): EditionStill[] {
  const all = getAllEditionStills();
  if (category === "All") return all;
  return all.filter((s) => s.category === category);
}

/** @deprecated Use getAllEditionStills() */
export const EDITION_STILLS = getAllEditionStills();