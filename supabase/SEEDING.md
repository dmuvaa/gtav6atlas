# Push hardcoded seed data → Supabase

MVP content lives in `src/lib/data/seed.ts`. Images live under `public/images/`.

## Prerequisites

1. Migrations **001–005** and **006_entity_extras.sql** applied.
2. An **editor** or **administrator** user in `profiles` (for publishable-key seed).
3. `.env.local` with Supabase URL + publishable key.

## Recommended: Node seed script

```bash
# Sign in as editor (uses publishable key + RLS — same as the app)
SEED_EDITOR_EMAIL=you@example.com
SEED_EDITOR_PASSWORD=your-password

npx tsx scripts/seed-to-supabase.ts
```

Flags:

| Flag | Effect |
|------|--------|
| `--skip-upload` | Rows only; `hero_image_path` stays as `/images/...` site paths |
| `--with-editions` | Also uploads curated files from `SEED_CURATED_EDITION_FILES` to Storage |

**Optional one-time local only** (not used by Next.js): `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` — the seed script can use it instead of email/password. Never expose this key to the browser.

## What gets written

| Seed export | Postgres table | Extras |
|-------------|----------------|--------|
| characters | `characters` | `entity_sources`, optional Storage + `media_assets` |
| locations | `locations` | `real_world_inspiration`, hero image |
| vehicles, businesses | same pattern | |
| articles | `articles` | `status = published` |
| discoveries | `discoveries` | `moderation_status = approved`, `published = true` |
| sources | `sources` | Rockstar trailer URL upserted |

Image map: auto-built in `src/lib/data/seed-media.ts` from every entity’s `heroImage` (core seed + edition stills).

Expanded counts (local seed file): ~14 vehicles, ~85 edition discovery references, shop/business entries from verified Ultimate Edition packs, plus 2 map reference layers.

## Serve from DB on the site

After seeding:

```env
NEXT_PUBLIC_USE_SUPABASE_CMS=true
```

Restart `npm run dev`. Public routes use published Supabase rows with fallback to `seed.ts` if a slug is missing.

## SQL-only (no Node)

If you cannot run the script, use the admin UI at `/admin/create` to enter records manually, or ask for `scripts/generate-seed-sql.ts` output (`npm run seed:sql`) and run the generated file in the SQL Editor (bypasses RLS as project owner).