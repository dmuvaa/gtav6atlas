/**
 * Push src/lib/data/seed.ts into Supabase (tables + Storage).
 *
 * Auth (pick one):
 *   A) SEED_EDITOR_EMAIL + SEED_EDITOR_PASSWORD (publishable key + editor JWT) — recommended
 *   B) SUPABASE_SERVICE_ROLE_KEY (one-time local seed only; never used by the Next app)
 *
 * Usage:
 *   npx tsx scripts/seed-to-supabase.ts
 *   npx tsx scripts/seed-to-supabase.ts --skip-upload
 *   npx tsx scripts/seed-to-supabase.ts --with-editions
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  articles,
  businesses,
  characters,
  discoveries,
  locations,
  vehicles,
} from "../src/lib/data/seed";
import { SEED_MAP_LAYERS } from "../src/lib/data/edition-seed";
import {
  SEED_CURATED_EDITION_FILES,
  SEED_ENTITY_IMAGES,
} from "../src/lib/data/seed-media";
import { entityMediaPath } from "../src/lib/storage/paths";
import { STORAGE_BUCKETS } from "../src/lib/storage/buckets";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.join(root, ".env.local");

function loadEnv() {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const args = new Set(process.argv.slice(2));
const skipUpload = args.has("--skip-upload");
const withEditions = args.has("--with-editions");

const rockstarTrailer = {
  title: "Grand Theft Auto VI Trailer 1",
  url: "https://www.rockstargames.com/VI",
  publisher: "Rockstar Games",
  source_type: "official",
  publication_date: "2023-12-04",
};

async function createSupabase(): Promise<SupabaseClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = process.env.SEED_EDITOR_EMAIL;
  const password = process.env.SEED_EDITOR_PASSWORD;

  if (!url || !publishable) {
    throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }

  if (service) {
    console.log("Using service role (seed script only).");
    return createClient(url, service, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  const supabase = createClient(url, publishable);
  if (!email || !password) {
    throw new Error(
      "Set SEED_EDITOR_EMAIL + SEED_EDITOR_PASSWORD (editor account), or SUPABASE_SERVICE_ROLE_KEY for one-time seed.",
    );
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`Sign-in failed: ${error.message}`);
  console.log("Signed in as seed editor (publishable key + RLS).");
  return supabase;
}

async function upsertSource(client: SupabaseClient) {
  const { data, error } = await client
    .from("sources")
    .upsert(rockstarTrailer, { onConflict: "url" })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

async function linkSource(
  client: SupabaseClient,
  entityType: string,
  entityId: string,
  sourceId: string,
) {
  const { data: existing } = await client
    .from("entity_sources")
    .select("id")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .eq("source_id", sourceId)
    .maybeSingle();
  if (existing) return;
  await client.from("entity_sources").insert({
    entity_type: entityType,
    entity_id: entityId,
    source_id: sourceId,
  });
}

function publicFilePath(webPath: string) {
  return path.join(root, "public", webPath.replace(/^\//, ""));
}

async function uploadHeroImage(
  client: SupabaseClient,
  entityType: string,
  entitySlug: string,
  webPath: string,
  entityId: string,
) {
  const local = publicFilePath(webPath);
  if (!existsSync(local)) {
    console.warn(`  skip missing file ${local}`);
    return webPath;
  }
  const fileName = path.basename(local);
  const objectPath = entityMediaPath(entityType, entitySlug, fileName);
  const body = readFileSync(local);
  const mime = fileName.endsWith(".png")
    ? "image/png"
    : fileName.endsWith(".webp")
      ? "image/webp"
      : "image/jpeg";

  const { error: upErr } = await client.storage
    .from(STORAGE_BUCKETS.entityMedia)
    .upload(objectPath, body, { upsert: true, contentType: mime });
  if (upErr) {
    console.warn(`  storage upload failed: ${upErr.message}`);
    return webPath;
  }

  await client.from("media_assets").upsert(
    {
      bucket: STORAGE_BUCKETS.entityMedia,
      object_path: objectPath,
      entity_type: entityType,
      entity_id: entityId,
      alt_text: `${entitySlug} reference`,
      mime_type: mime,
      byte_size: body.length,
    },
    { onConflict: "bucket,object_path" },
  );

  return objectPath;
}

async function main() {
  loadEnv();
  const client = await createSupabase();
  const sourceId = await upsertSource(client);
  console.log("Source id:", sourceId);

  const locationIds: Record<string, string> = {};

  for (const loc of locations) {
    const { data, error } = await client
      .from("locations")
      .upsert(
        {
          name: loc.name,
          slug: loc.slug,
          description: loc.description,
          location_type: loc.locationType,
          region: loc.region ?? null,
          real_world_inspiration: loc.realWorldInspiration ?? null,
          verification_status: loc.verificationStatus,
          published: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (error) throw error;
    locationIds[loc.slug] = data.id;
    await linkSource(client, "location", data.id, sourceId);
    const img = SEED_ENTITY_IMAGES[`location:${loc.slug}`];
    if (img && !skipUpload) {
      const storagePath = await uploadHeroImage(
        client,
        "location",
        loc.slug,
        img,
        data.id,
      );
      await client
        .from("locations")
        .update({ hero_image_path: storagePath })
        .eq("id", data.id);
    } else if (img) {
      await client
        .from("locations")
        .update({ hero_image_path: img })
        .eq("id", data.id);
    }
    console.log("location", loc.slug);
  }

  for (const c of characters) {
    const { data, error } = await client
      .from("characters")
      .upsert(
        {
          name: c.name,
          slug: c.slug,
          description: c.description,
          role: c.role ?? null,
          category: c.category ?? null,
          aliases: c.aliases ?? [],
          verification_status: c.verificationStatus,
          published: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (error) throw error;
    await linkSource(client, "character", data.id, sourceId);
    const img = SEED_ENTITY_IMAGES[`character:${c.slug}`];
    if (img && !skipUpload) {
      const storagePath = await uploadHeroImage(
        client,
        "character",
        c.slug,
        img,
        data.id,
      );
      await client
        .from("characters")
        .update({ hero_image_path: storagePath })
        .eq("id", data.id);
    } else if (img) {
      await client
        .from("characters")
        .update({ hero_image_path: img })
        .eq("id", data.id);
    }
    console.log("character", c.slug);
  }

  for (const v of vehicles) {
    const { data, error } = await client
      .from("vehicles")
      .upsert(
        {
          name: v.name,
          slug: v.slug,
          description: v.description,
          manufacturer: v.manufacturer ?? null,
          vehicle_category: v.vehicleCategory,
          verification_status: v.verificationStatus,
          published: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (error) throw error;
    await linkSource(client, "vehicle", data.id, sourceId);
    const img = SEED_ENTITY_IMAGES[`vehicle:${v.slug}`];
    if (img && !skipUpload) {
      const storagePath = await uploadHeroImage(client, "vehicle", v.slug, img, data.id);
      await client.from("vehicles").update({ hero_image_path: storagePath }).eq("id", data.id);
    }
    console.log("vehicle", v.slug);
  }

  for (const b of businesses) {
    const { data, error } = await client
      .from("businesses")
      .upsert(
        {
          name: b.name,
          slug: b.slug,
          description: b.description,
          business_category: b.businessCategory,
          location_id: b.locationSlug ? locationIds[b.locationSlug] ?? null : null,
          verification_status: b.verificationStatus,
          published: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (error) throw error;
    await linkSource(client, "business", data.id, sourceId);
    const bizImg = SEED_ENTITY_IMAGES[`business:${b.slug}`];
    if (bizImg && !skipUpload) {
      const storagePath = await uploadHeroImage(
        client,
        "business",
        b.slug,
        bizImg,
        data.id,
      );
      await client.from("businesses").update({ hero_image_path: storagePath }).eq("id", data.id);
    } else if (bizImg) {
      await client.from("businesses").update({ hero_image_path: bizImg }).eq("id", data.id);
    }
    console.log("business", b.slug);
  }

  for (const a of articles) {
    const { data, error } = await client
      .from("articles")
      .upsert(
        {
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt,
          content: a.content,
          article_kind: a.category,
          status: "published",
          published_at: a.publishedAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (error) throw error;
    const img = SEED_ENTITY_IMAGES[`article:${a.slug}`];
    if (img && !skipUpload) {
      const storagePath = await uploadHeroImage(
        client,
        "article",
        a.slug,
        img,
        data.id,
      );
      await client.from("articles").update({ hero_image_path: storagePath }).eq("id", data.id);
    } else if (img) {
      await client.from("articles").update({ hero_image_path: img }).eq("id", data.id);
    }
    console.log("article", a.slug);
  }

  for (const d of discoveries) {
    const { data, error } = await client
      .from("discoveries")
      .upsert(
        {
          title: d.name,
          slug: d.slug,
          description: d.description,
          category: d.discoveryCategory,
          verification_status: d.verificationStatus,
          moderation_status: "approved",
          published: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (error) throw error;
    await linkSource(client, "discovery", data.id, sourceId);
    const discImg = SEED_ENTITY_IMAGES[`discovery:${d.slug}`];
    if (discImg && !skipUpload) {
      const storagePath = await uploadHeroImage(
        client,
        "discovery",
        d.slug,
        discImg,
        data.id,
      );
      await client.from("discoveries").update({ hero_image_path: storagePath }).eq("id", data.id);
    } else if (discImg) {
      await client.from("discoveries").update({ hero_image_path: discImg }).eq("id", data.id);
    }
    console.log("discovery", d.slug);
  }

  for (const layer of SEED_MAP_LAYERS) {
    const img = SEED_ENTITY_IMAGES[`map-layer:${layer.slug}`] ?? layer.heroImage;
    let storagePath = img;
    if (img && !skipUpload) {
      storagePath = await uploadHeroImage(
        client,
        "map-layer",
        layer.slug,
        img,
        layer.slug,
      );
    }
    const { error } = await client.from("map_layers").upsert(
      {
        name: layer.name,
        slug: layer.slug,
        description: layer.description,
        layer_type: layer.layer_type,
        sort_order: layer.sort_order,
        storage_path: storagePath,
        published: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    );
    if (error) throw error;
    console.log("map-layer", layer.slug);
  }

  if (withEditions && !skipUpload) {
    console.log("Uploading curated edition assets…");
    for (const webPath of SEED_CURATED_EDITION_FILES) {
      const local = publicFilePath(webPath);
      if (!existsSync(local)) continue;
      const fileName = path.basename(local);
      const objectPath = `editions/${fileName}`;
      const body = readFileSync(local);
      await client.storage
        .from(STORAGE_BUCKETS.entityMedia)
        .upload(objectPath, body, { upsert: true, contentType: "image/jpeg" });
      await client.from("media_assets").upsert(
        {
          bucket: STORAGE_BUCKETS.entityMedia,
          object_path: objectPath,
          entity_type: "edition",
          alt_text: fileName,
          mime_type: "image/jpeg",
          byte_size: body.length,
        },
        { onConflict: "bucket,object_path" },
      );
    }
  }

  console.log("\nDone. Set NEXT_PUBLIC_USE_SUPABASE_CMS=true in .env.local to read from DB.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});