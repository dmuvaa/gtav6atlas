import type {
  Article,
  Business,
  Character,
  Discovery,
  Location,
  Vehicle,
} from "../types";
import {
  buildEditionBusinesses,
  buildEditionDiscoveries,
  buildEditionVehicles,
} from "./edition-seed";
import { ROCKSTAR_TRAILER_SOURCE } from "./seed-core";

const rockstarTrailer = ROCKSTAR_TRAILER_SOURCE;

const coreCharacters: Character[] = [
  {
    id: "char-lucia",
    name: "Lucia",
    slug: "lucia",
    description:
      "One of the two protagonists featured in the first Grand Theft Auto VI trailer. Rockstar’s official marketing presents her as a central playable character in the Leonida setting.",
    aliases: [],
    role: "Protagonist",
    category: "Protagonist",
    verificationStatus: "officially_confirmed",
    lastUpdated: "2025-11-01",
    sources: [rockstarTrailer],
    heroImage: "/images/editions/lucia-jason-club.jpg",
  },
  {
    id: "char-jason",
    name: "Jason",
    slug: "jason",
    description:
      "The second protagonist shown alongside Lucia in Rockstar’s first GTA VI trailer. Official material positions him as a co-lead character in the game’s story.",
    aliases: [],
    role: "Protagonist",
    category: "Protagonist",
    verificationStatus: "officially_confirmed",
    lastUpdated: "2025-11-01",
    sources: [rockstarTrailer],
    heroImage: "/images/editions/jason-spray-paint-rack.jpg",
  },
];

const coreLocations: Location[] = [
  {
    id: "loc-leonida",
    name: "Leonida",
    slug: "leonida",
    description:
      "The fictional U.S. state that serves as the primary setting for Grand Theft Auto VI, as established in Rockstar’s official announcements and trailers.",
    locationType: "State",
    region: "United States (fictional)",
    verificationStatus: "officially_confirmed",
    lastUpdated: "2025-11-01",
    sources: [rockstarTrailer],
    heroImage: "/images/editions/harbor-sunset.jpg",
  },
  {
    id: "loc-vice-city",
    name: "Vice City",
    slug: "vice-city",
    description:
      "A major city in Leonida featured prominently in GTA VI marketing. Trailer footage and official descriptions confirm its return as a central urban hub.",
    locationType: "City",
    region: "Leonida",
    realWorldInspiration:
      "Miami and South Florida (widely reported; not officially named by Rockstar)",
    verificationStatus: "officially_confirmed",
    lastUpdated: "2025-11-01",
    sources: [rockstarTrailer],
    heroImage: "/images/editions/stanier-ocean-drive-night.jpg",
  },
  {
    id: "loc-port-gellhorn",
    name: "Port Gellhorn",
    slug: "port-gellhorn",
    description:
      "A location name appearing in official GTA VI key art and supporting marketing materials as part of the broader Leonida map.",
    locationType: "City",
    region: "Leonida",
    verificationStatus: "officially_confirmed",
    lastUpdated: "2025-11-01",
    sources: [rockstarTrailer],
    heroImage: "/images/editions/stilt-house-yellow-truck.jpg",
  },
  {
    id: "loc-ambrosia",
    name: "Ambrosia",
    slug: "ambrosia",
    description:
      "Referenced in official promotional materials as another settlement within the state of Leonida.",
    locationType: "Town",
    region: "Leonida",
    verificationStatus: "officially_confirmed",
    lastUpdated: "2025-11-01",
    sources: [rockstarTrailer],
    heroImage: "/images/editions/pegassi-residences.jpg",
  },
];

const coreVehicles: Vehicle[] = [
  {
    id: "veh-boor",
    name: "Boor",
    slug: "boor",
    description:
      "A vehicle model visible in official GTA VI trailer footage. Detailed in-game specifications are not yet confirmed in primary sources.",
    manufacturer: "Unconfirmed",
    vehicleCategory: "Cars",
    verificationStatus: "officially_confirmed",
    lastUpdated: "2025-11-01",
    sources: [rockstarTrailer],
    heroImage: "/images/editions/vapid-dominator-mud.jpg",
  },
  {
    id: "veh-jet-ski",
    name: "Jet ski (trailer appearance)",
    slug: "jet-ski-trailer",
    description:
      "Personal watercraft shown in official trailer scenes set in coastal Leonida environments.",
    vehicleCategory: "Boats",
    verificationStatus: "officially_confirmed",
    lastUpdated: "2025-11-01",
    sources: [rockstarTrailer],
    heroImage: "/images/editions/cheetah-sunset.jpg",
  },
];

const coreBusinesses: Business[] = [
  {
    id: "biz-vice-beach-hotel",
    name: "Ocean Drive hospitality (trailer)",
    slug: "vice-beach-hospitality",
    description:
      "Beachfront hotels and nightlife venues visible in official Vice City trailer sequences. Individual branded businesses will be catalogued as they are verified.",
    businessCategory: "Hotels",
    locationSlug: "vice-city",
    verificationStatus: "reported",
    lastUpdated: "2025-11-01",
    sources: [rockstarTrailer],
    heroImage: "/images/editions/stockyard-art-tour-van.jpg",
  },
];

const coreArticles: Article[] = [
  {
    id: "art-gta6-overview",
    title: "What We Know About GTA VI (Official Sources)",
    slug: "what-we-know-gta-vi-official",
    excerpt:
      "A structured overview of Grand Theft Auto VI based on Rockstar announcements, trailers and primary documentation — without speculation presented as fact.",
    content: `
## Scope of this guide

This guide summarizes **public, verifiable information** about Grand Theft Auto VI. Each major claim should be read alongside its verification label and listed sources on entity pages across GTA6AtlasHQ.

## Setting: Leonida

Rockstar has established that GTA VI takes place in the fictional state of **Leonida**, which includes the return of **Vice City** as a major urban center.

## Protagonists

The first official trailer introduces **Lucia** and **Jason** as the story’s leads. Rockstar has not published exhaustive biographical detail beyond marketing materials at this stage.

## How we update this guide

When new official material is released, editors update related entity records, change verification classifications where needed, and append sources. Speculation and fan theories are not mixed into confirmed sections.

## Explore next

- Browse the [character directory](/characters)
- Browse [locations](/locations) including Vice City and Port Gellhorn
- Read [news](/news) for platform updates
    `.trim(),
    category: "guide",
    guideCategory: "Beginner guides",
    author: "GTA6AtlasHQ Editorial",
    publishedAt: "2025-10-15",
    updatedAt: "2025-11-01",
    verificationStatus: "officially_confirmed",
    tags: ["overview", "leonida", "official"],
    heroImage: "/images/editions/ultimate-edition.jpg",
  },
  {
    id: "art-platform-launch",
    title: "GTA6AtlasHQ Platform Launch",
    slug: "platform-launch",
    excerpt:
      "Introducing GTA6AtlasHQ — a structured GTA VI reference with databases, verification labels and search across characters, locations, vehicles and more.",
    content: `
## Why this platform exists

GTA VI information is scattered across news sites, videos and social posts. GTA6AtlasHQ organizes **entities**, **sources** and **verification status** in one place.

## What’s in the MVP

- Character, location, vehicle and business databases
- Guides and news with SEO-friendly structure
- Global search across indexed content
- Newsletter signup for Leonida Intel

## Independent project

GTA6AtlasHQ is not affiliated with Rockstar Games or Take-Two Interactive. We use original writing and source-linked facts.

## Contribute later

Community discovery submissions and moderation tools are on the roadmap after the core databases are stable.
    `.trim(),
    category: "news",
    author: "GTA6AtlasHQ",
    publishedAt: "2025-11-17",
    updatedAt: "2025-11-17",
    verificationStatus: "officially_confirmed",
    tags: ["platform", "announcement"],
    heroImage: "/images/hero-vice-sunset.jpg",
  },
];

const coreDiscoveries: Discovery[] = [
  {
    id: "disc-map-labels",
    name: "Leonida map locality labels in key art",
    slug: "leonida-map-labels-key-art",
    description:
      "Official key art and promotional stills name multiple Leonida localities (for example Port Gellhorn and Ambrosia). Useful for building the location directory before interactive map coordinates are confirmed.",
    discoveryCategory: "Environmental details",
    verificationStatus: "officially_confirmed",
    lastUpdated: "2025-11-01",
    sources: [rockstarTrailer],
    contributor: "Editorial",
    heroImage: "/images/editions/ultimate-edition.jpg",
  },
];

export const characters = coreCharacters;

export const locations = coreLocations;

export const vehicles = [
  ...coreVehicles,
  ...buildEditionVehicles(new Set(coreVehicles.map((v) => v.slug))),
];

export const businesses = [
  ...coreBusinesses,
  ...buildEditionBusinesses(new Set(coreBusinesses.map((b) => b.slug))),
];

export const articles = coreArticles;

export const discoveries = [
  ...coreDiscoveries,
  ...buildEditionDiscoveries(new Set(coreDiscoveries.map((d) => d.slug))),
];