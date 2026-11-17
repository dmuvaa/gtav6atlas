export const SITE_NAME = "GTA6AtlasHQ";
export const COPYRIGHT_YEAR = 2026;
export const SITE_DOMAIN = "gta6atlashq.com";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? `https://${SITE_DOMAIN}`;

export const SITE_DESCRIPTION =
  "Independent Grand Theft Auto VI information hub — structured databases, guides, news and exploration tools for players, enthusiasts and creators.";

export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/maps", label: "Maps" },
  { href: "/characters", label: "Characters" },
  { href: "/locations", label: "Locations" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/guides", label: "Guides" },
  { href: "/discoveries", label: "Discoveries" },
  { href: "/news", label: "News" },
  { href: "/editions", label: "Editions" },
  { href: "/search", label: "Search" },
] as const;

export const DATABASE_CATEGORIES = [
  {
    href: "/characters",
    title: "Characters",
    description: "Profiles, roles and verified relationships across Leonida.",
    accent: "pink" as const,
  },
  {
    href: "/locations",
    title: "Locations",
    description: "Cities, landmarks and points of interest with source tracking.",
    accent: "teal" as const,
  },
  {
    href: "/vehicles",
    title: "Vehicles",
    description: "Cars, bikes, boats and more from official and reported sources.",
    accent: "coral" as const,
  },
  {
    href: "/businesses",
    title: "Businesses",
    description: "Establishments tied to locations and characters where documented.",
    accent: "gold" as const,
  },
  {
    href: "/locations?type=landmark",
    title: "Landmarks",
    description: "Notable structures and destinations worth tracking.",
    accent: "lavender" as const,
  },
  {
    href: "/guides",
    title: "Gameplay",
    description: "Guides and explainers for confirmed and reported features.",
    accent: "violet" as const,
  },
] as const;

export const VERIFICATION_LABELS: Record<
  import("./types").VerificationStatus,
  string
> = {
  officially_confirmed: "Officially confirmed",
  reported: "Reported",
  community_discovery: "Community discovery",
  speculation: "Speculation",
  unverified: "Unverified",
};

export const POPULAR_SEARCHES = [
  "Lucia",
  "Jason",
  "Leonida",
  "Vice City",
  "Trailer",
  "Release date",
];