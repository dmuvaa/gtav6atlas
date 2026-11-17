import {
  getCharacterBySlug,
  getCharacters,
  getLocationBySlug,
  getLocations,
} from "./index";

export type RelatedLink = {
  href: string;
  title: string;
  kind: string;
};

export function getCharacterRelated(slug: string): RelatedLink[] {
  const links: RelatedLink[] = [];
  const character = getCharacterBySlug(slug);
  if (!character) return links;

  if (slug === "lucia") {
    const jason = getCharacterBySlug("jason");
    if (jason) {
      links.push({
        href: `/characters/${jason.slug}`,
        title: jason.name,
        kind: "Character",
      });
    }
  }
  if (slug === "jason") {
    const lucia = getCharacterBySlug("lucia");
    if (lucia) {
      links.push({
        href: `/characters/${lucia.slug}`,
        title: lucia.name,
        kind: "Character",
      });
    }
  }

  const vice = getLocationBySlug("vice-city");
  const leonida = getLocationBySlug("leonida");
  if (vice) {
    links.push({ href: `/locations/${vice.slug}`, title: vice.name, kind: "Location" });
  }
  if (leonida) {
    links.push({ href: `/locations/${leonida.slug}`, title: leonida.name, kind: "Location" });
  }

  links.push({
    href: "/guides/what-we-know-gta-vi-official",
    title: "What we know (official)",
    kind: "Guide",
  });

  return links;
}

export function getLocationRelated(slug: string): RelatedLink[] {
  const links: RelatedLink[] = [];
  if (slug === "vice-city" || slug === "leonida") {
    for (const c of getCharacters()) {
      links.push({
        href: `/characters/${c.slug}`,
        title: c.name,
        kind: "Character",
      });
    }
  }
  if (slug === "leonida") {
    for (const loc of getLocations().filter((l) => l.slug !== "leonida")) {
      links.push({
        href: `/locations/${loc.slug}`,
        title: loc.name,
        kind: "Location",
      });
    }
  }
  links.push({ href: "/maps", title: "Map status", kind: "Explore" });
  return links.slice(0, 8);
}