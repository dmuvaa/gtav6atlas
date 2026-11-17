# CMS & database create flows

GTA6AtlasHQ stores atlas content in Postgres and files in Supabase Storage. The app uses the **publishable key** + signed-in **editor/administrator** JWT; RLS enforces who can insert.

## Migrations (order)

| File | Purpose |
|------|---------|
| `001_initial_schema.sql` | Core tables |
| `002_auth_profiles.sql` | `profiles`, auth trigger |
| `003_staff_rls.sql` | Staff read profiles, submissions, analytics |
| `004_user_role_enum.sql` | Optional enum dropdown for roles |
| `005_storage_maps_editor_rls.sql` | Maps, `media_assets`, buckets, editor write policies |

If `001` already exists, run **`install-continue.sql`** then **`005_storage_maps_editor_rls.sql`**.

## Storage buckets

| Bucket | Public | Use |
|--------|--------|-----|
| `entity-media` | yes | Character/location/vehicle hero images |
| `map-assets` | yes | Map tiles, GeoJSON overlays |
| `submission-evidence` | no | Contributor uploads (`{userId}/…`) |
| `avatars` | yes | Profile images (`{userId}/…`) |

Path helpers live in `src/lib/storage/paths.ts`.

## Admin CRUD (app)

| Action | Where |
|--------|--------|
| **List** | `/admin/characters`, `locations`, `vehicles`, `businesses`, `discoveries`, `articles` (Supabase rows) |
| **Create** | `/admin/create/{type}` |
| **Edit / delete** | `/admin/edit/{type}/{id}` or **Edit** on list rows |
| **API** | `POST /api/cms/{type}`, `GET/PATCH/DELETE /api/cms/{type}/{id}` |

Run **`007_editor_delete_policies.sql`** once so editors can delete rows.

Forms include hero image upload (sets `hero_image_path`), location dropdown, aliases, and map fields per type.

## Creating records

| Type | Table | Who | App entry |
|------|--------|-----|-----------|
| Character | `characters` | editor+ | `/admin/create/character` |
| Location | `locations` | editor+ | `/admin/create/location` |
| Vehicle | `vehicles` | editor+ | `/admin/create/vehicle` |
| Business | `businesses` | editor+ | `/admin/create/business` |
| Discovery | `discoveries` | editor+ | `/admin/create/discovery` |
| Guide/News | `articles` | editor+ | `/admin/create/article` |
| Map layer | `map_layers` | editor+ | `/admin/create/map-layer` |
| Map marker | `map_markers` | editor+ | `/admin/create/map-marker` |
| Source | `sources` | editor+ | `/admin/create/source` |
| Submission | `submissions` | contributor+ | `/account/submissions` (not CMS) |

API: `POST /api/cms/{entityType}` with JSON body (see `src/lib/cms/schemas.ts`).

Schemas & registry: `src/lib/cms/entity-registry.ts`.

## Publishing

Most entities use `published boolean`. Articles use `status = 'published'` + `published_at`. Discoveries also use `moderation_status`.

Drafts are visible to **moderator+** via RLS; public site still uses seed data until the Next.js data layer reads Supabase (next phase).