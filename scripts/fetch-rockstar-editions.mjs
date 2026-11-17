#!/usr/bin/env node
/**
 * Downloads GTA VI edition stills referenced on rockstargames.com/VI/editions.
 * Run: node scripts/fetch-rockstar-editions.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public/images/editions/rockstar");
const MANIFEST_PATH = path.join(ROOT, "src/lib/media/editions-manifest.json");

const PAGE_URL = "https://www.rockstargames.com/VI/editions";
const BASE = "https://www.rockstargames.com/VI/";

function titleFromFilename(file) {
  return file
    .replace(/\.[a-z]+$/i, "")
    .replace(/^\d+_/, "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function categoryFromFilename(file) {
  if (file.includes("CHEETAH") || file.includes("STANIER") || file.includes("BUGGY") || file.includes("SQUALO") || file.includes("GANADO") || file.includes("SAFEHOUSE") || file.includes("WYMAN") || file.includes("CAR_COLLECTION")) return "Vehicles";
  if (file.includes("WEAPON") || file.includes("REVOLVER") || file.includes("HAWK")) return "Weapons";
  if (file.includes("VICE_CITY_STYLE") || file.includes("STOCK_305") || file.includes("SARAS") || file.includes("EXCLUSIVE_LOOKS")) return "Vice City style";
  if (file.includes("RIDEOUT") || file.includes("ONE_EYED") || file.includes("ELECTRIC_FANG") || file.includes("PTT") || file.includes("GOODTIME")) return "Businesses & shops";
  if (file.includes("FOB_") || file.includes("VINTAGE_VICE") || file.includes("GTA_PLUS")) return "Editions";
  return "Promo";
}

async function main() {
  const html = await fetch(PAGE_URL).then((r) => r.text());
  const re = /_next\/static\/media\/[^"?\s]+\.(jpg|png|webp)/gi;
  const matches = [...html.matchAll(re)].map((m) => m[0]);
  const unique = [...new Set(matches)].filter(
    (p) =>
      !/_fr_|_ja_|_jp_|_ko_|_kr_|_zh_|StandardEdition_Mobile/i.test(p),
  );

  await mkdir(OUT_DIR, { recursive: true });

  const manifest = [];
  let ok = 0;
  let fail = 0;

  for (const rel of unique) {
    const file = path.basename(rel);
    const id = file.replace(/\.[^.]+$/, "").toLowerCase();
    const outPath = path.join(OUT_DIR, file);
    const publicSrc = `/images/editions/rockstar/${file}`;
    const url = `${BASE}${rel}?akim=1&imdensity=1&imwidth=1920`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        fail++;
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 500) {
        fail++;
        continue;
      }
      await writeFile(outPath, buf);
      ok++;
      manifest.push({
        id,
        src: publicSrc,
        title: titleFromFilename(file),
        caption: `Rockstar GTA VI editions — ${titleFromFilename(file)}`,
        category: categoryFromFilename(file),
        subjects: ["Rockstar reference"],
        sourceUrl: PAGE_URL,
      });
    } catch {
      fail++;
    }
  }

  manifest.sort((a, b) => a.title.localeCompare(b.title));
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log(`Downloaded ${ok} assets (${fail} failed) → ${OUT_DIR}`);
  console.log(`Manifest: ${manifest.length} entries → ${MANIFEST_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});