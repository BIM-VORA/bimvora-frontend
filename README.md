# BIM Lab

Professional Revit family marketplace (Phase 1: storefront, catalog, cart, auth).

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Supabase (Postgres, Auth, Storage)

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Create a Supabase project and paste:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server only)
   - `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
3. In the Supabase SQL editor run:
   - `supabase/migrations/0001_init.sql`
   - `supabase/seed.sql`
4. Authentication → URL configuration: add `http://localhost:3000/auth/callback`.
5. `npm install` then `npm run dev`.

The catalog still renders from bundled seed data if Supabase keys are empty, so you can review the storefront immediately.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server
