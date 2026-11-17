import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import {
  getBusinesses,
  getCharacters,
  getDiscoveries,
  getGuides,
  getLocations,
  getNews,
  getVehicles,
} from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/characters",
    "/locations",
    "/vehicles",
    "/businesses",
    "/maps",
    "/guides",
    "/news",
    "/discoveries",
    "/editions",
    "/search",
    "/newsletter",
    "/about",
    "/contact",
    "/editorial-policy",
    "/privacy",
    "/terms",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const slugs = [
    ...getCharacters().map((c) => `/characters/${c.slug}`),
    ...getLocations().map((l) => `/locations/${l.slug}`),
    ...getVehicles().map((v) => `/vehicles/${v.slug}`),
    ...getBusinesses().map((b) => `/businesses/${b.slug}`),
    ...getGuides().map((g) => `/guides/${g.slug}`),
    ...getNews().map((n) => `/news/${n.slug}`),
    ...getDiscoveries().map((d) => `/discoveries/${d.slug}`),
  ];

  for (const path of slugs) {
    entries.push({
      url: `${SITE_URL}${path}`,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return entries;
}