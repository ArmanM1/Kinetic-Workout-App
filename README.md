# Kinetic

Kinetic is a premium-feeling, mobile-first workout tracker for lifters who want structured data without friction. The core experience prioritizes fast logging, previous-value autofill, one active workout at a time, flexible split launches, and analytics that remain useful for advanced training.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Supabase Auth + Postgres + SSR utilities
- TanStack Query
- Playwright
- Vercel hosting

## Environment

Required app env vars:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL` for callback-safe absolute URLs in local development

Optional server-only env vars:

- `SUPABASE_SERVICE_ROLE_KEY`

Current setup status:

- Local `.env.local` is populated for Supabase browser auth
- Vercel development and production envs have the Supabase public keys
- Preview env automation still depends on connecting the Vercel project to the GitHub repo

## Commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm test:e2e
pnpm catalog:sync
pnpm catalog:seed
```

## Repository notes

- GitHub remote: `https://github.com/ArmanM1/Kinetic-Workout-App.git`
- Vercel project link: `project-afpcu`
- Latest verified preview deployment: `https://project-afpcu-hndbixlv0-armans-projects.vercel.app`
- Supabase local config lives under `supabase/`
- `SETUP_BLOCKERS.md` records any external setup step that still needs a manual action
