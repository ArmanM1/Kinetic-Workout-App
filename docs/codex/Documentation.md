# Build Log

## 2026-04-13

- Scaffolded the Next.js App Router app with `pnpm`
- Linked the workspace to the existing Vercel project `project-afpcu`
- Initialized git, connected the existing GitHub repo, and pushed `main`
- Added the Kinetic visual system, marketing page, auth pages, app shell, splits, analytics, settings, and active workout flow
- Downloaded the open exercise catalog source into `src/lib/data/exercise-catalog.raw.json`
- Initialized local Supabase config and documented the remaining blockers in `SETUP_BLOCKERS.md`
- Fixed dependency manifest gaps surfaced by remote Vercel builds and aligned the auth pages with semantic heading markup
- Fixed the Vercel framework configuration so production serves the Next.js app correctly
- Redesigned the authenticated app shell and home screen into a tighter mobile-first flow with fewer explanatory panels
- Added the dedicated exercises browser route with search, muscle chips, sort modes, favorites, and custom exercise creation
- Refined split launching so routine cards open into per-split day launch pages and replacing a live workout now requires an explicit discard-or-end confirmation
- Rebuilt the active workout screen into a denser activity-style layout with a floating dismissible rest timer and a fixed bottom `Log Set` action
- Connected Codex to the Supabase MCP server and verified that the remaining hosted auth blocker is the standalone Supabase CLI token step
- Updated signup to surface a clear message when hosted Supabase still requires email confirmation
- Verified `pnpm lint`, `pnpm test`, `pnpm test:e2e`, and `pnpm build`
- Published a ready preview deployment at `https://project-afpcu-hndbixlv0-armans-projects.vercel.app`
- Verified the healthy production deployment at `https://project-afpcu.vercel.app`
