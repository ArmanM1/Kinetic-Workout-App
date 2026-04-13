# Build Log

## 2026-04-13

- Scaffolded the Next.js App Router app with `pnpm`
- Linked the workspace to the existing Vercel project `project-afpcu`
- Initialized git, connected the existing GitHub repo, and pushed `main`
- Added the Kinetic visual system, marketing page, auth pages, app shell, splits, analytics, settings, and active workout flow
- Downloaded the open exercise catalog source into `src/lib/data/exercise-catalog.raw.json`
- Initialized local Supabase config and documented the remaining blockers in `SETUP_BLOCKERS.md`
- Fixed dependency manifest gaps surfaced by remote Vercel builds and aligned the auth pages with semantic heading markup
- Verified `pnpm lint`, `pnpm test`, `pnpm test:e2e`, and `pnpm build`
- Published a ready preview deployment at `https://project-afpcu-hndbixlv0-armans-projects.vercel.app`
