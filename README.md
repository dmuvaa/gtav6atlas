# GTA6AtlasHQ

Independent Grand Theft Auto VI information, discovery and companion platform — MVP scaffold aligned with the product PRD.

## Stack

- Next.js App Router (TypeScript)
- Tailwind CSS 4
- Supabase (PostgreSQL, Auth, Storage) — schema in `supabase/migrations/`
- Zod validation for API routes

## Development

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO |
| `NEXT_PUBLIC_SUPABASE_*` | Supabase client (optional until wired) |
| `ADMIN_SECRET` | Protects `/admin` routes |

Until Supabase is connected, public pages use seed data in `src/lib/data/seed.ts`.

### Edition artwork (Rockstar reference)

```bash
npm run fetch:editions
```

Downloads every `.jpg`/`.png` referenced on [Rockstar’s GTA VI editions page](https://www.rockstargames.com/VI/editions) into `public/images/editions/rockstar/` and regenerates `src/lib/media/editions-manifest.json`.

### Supabase

1. Copy `.env.example` → `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
2. In **Supabase → SQL Editor**:
   - **Fresh project:** `supabase/install.sql`
   - **Already ran 001** (error `verification_status already exists`): use **`supabase/roles-minimal.sql`** for roles, or **`supabase/install-continue.sql`** for roles + staff RLS (neither file creates enums).
   Regenerate: `node scripts/build-supabase-install.mjs`.  
   Then run **`supabase/migrations/005_storage_maps_editor_rls.sql`** (or paste its contents) for CMS create + storage buckets.
3. In **Authentication → URL configuration**, add redirect URL:  
   `http://localhost:3000/auth/callback` (and your production URL later).
4. Verify: `node scripts/verify-supabase.mjs`

Client helpers live in `src/utils/supabase/` (`server`, `client`, `middleware`). Middleware refreshes auth sessions on each request.

The **publishable key** is all this app needs: the browser and server use it with the user’s JWT; Postgres **RLS** enforces permissions. You do not need a service role key for the staff admin console.

**CMS create flows:** see [`supabase/CMS.md`](supabase/CMS.md) and `/admin/create` (editor+). Submissions are contributor-created at `/account/submissions`.

**Seed hardcoded data → DB:** [`supabase/SEEDING.md`](supabase/SEEDING.md) — `npm run seed:supabase` then `NEXT_PUBLIC_USE_SUPABASE_CMS=true`.

**Auth routes:** `/auth/login`, `/auth/signup`, `/account` (overview, progress, submissions, settings), `/auth/callback`.

**Roles:** `registered_user` → `contributor` → `moderator` → `editor` → `administrator` (see `/admin/roles`).

#### Assign roles manually in Supabase

Every sign-up creates a row in `public.profiles` with `role = registered_user`. The app does **not** let users pick their own role — you change it in the dashboard (or SQL).

**Table Editor**

1. Supabase → **Table Editor** → `profiles`.
2. Find the user (match `email` or `id` from **Authentication → Users**).
3. No dropdown on `role`? Run **`supabase/patch-role-enum.sql`** once (converts column to `user_role` enum).
4. Edit `role` — you should get a dropdown of the five values.
5. Save.

**SQL Editor** (handy for your own account)

Use `supabase/set-role.example.sql` or:

```sql
update public.profiles
set role = 'contributor', updated_at = now()
where email = 'you@example.com';
```

`/admin/users` is read-only for roles; Supabase is always where you change them.

### Admin (staff console)

1. Set your `profiles.role` to `administrator` (or `moderator` / `editor`) in Supabase.
2. Visit **`/admin/login`** → **Sign in** with your normal site account → **`/admin/dashboard`**.
3. Optional legacy bypass: `ADMIN_SECRET` + old secret form (not required for staff roles).

## MVP scope (Phase 1)

- Homepage, navigation, entity databases (listing + detail)
- Guides and news
- Global search (in-memory; Postgres FTS when data moves to Supabase)
- Verification badges and sources
- Newsletter API
- SEO: metadata, sitemap, robots, JSON-LD
- Admin dashboard shell

## Deploy

Optimized for [Vercel](https://vercel.com). Set environment variables in the project dashboard.

## Disclaimer

Fan project — not affiliated with Rockstar Games or Take-Two Interactive.