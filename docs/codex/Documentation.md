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
- Tightened the home and workout screens again by stripping helper copy, turning add-exercise into a mobile drawer with quick-add shortcuts, and making the entire active set read as one highlighted tile
- Added inline blank-workout renaming, per-exercise muscle tags plus live estimated 1RM chips, a route-aware clean background for the exercises library, and a floating cross-app return bar for active workouts
- Added a shared custom-exercise dialog, favorite/recent collection entry points in the library and workout drawer, and a more native mobile shell with soft page/card animations
- Rebuilt analytics into mobile-friendly Overview and Body tabs with a selectable E1RM chart, clickable body-part drilldowns, balance scoring, per-region progress, and ranked lift lists
- Made the workout screen more phone-safe by lifting floating controls above the mobile keyboard, scrolling focused sets into view, and folding Quick Add into the drawer's main section tabs
- Hardened destructive workout actions with warning dialogs and added fullscreen/mobile-web-app shell hints so browser chrome gets out of the way more often
- Switched workout logging to numeric mobile keyboards and a docked active-set editor that keeps other sets visible while `Log Set` advances focus through unfinished work
- Connected Codex to the Supabase MCP server and verified that the remaining hosted auth blocker is the standalone Supabase CLI token step
- Updated signup to surface a clear message when hosted Supabase still requires email confirmation
- Removed the old seeded demo-mode fallback so fresh sessions now start from a clean signed-in state instead of sample profile/history data
- Added a skippable first-run onboarding flow that captures body weight and walks new users through Home, Exercises, Analytics, and the iPhone home-screen install path
- Verified the onboarding flow in a fresh mobile browser session, including persisted body weight in Settings and no remaining demo banner/setup checklist in the app shell
- Verified `pnpm lint`, `pnpm test`, `pnpm test:e2e`, and `pnpm build`
- Published a ready preview deployment at `https://project-afpcu-hndbixlv0-armans-projects.vercel.app`
- Verified the healthy production deployment at `https://project-afpcu.vercel.app`
