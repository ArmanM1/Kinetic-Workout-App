# Setup Blockers

## Codex CLI MCP setup

- Status: blocked
- Command:

```powershell
& "C:\Program Files\WindowsApps\OpenAI.Codex_26.409.1734.0_x64__2p2nqsd0c76g0\app\resources\codex.exe" --version
```

- Result: `Access is denied`
- Manual action needed: make the local Codex CLI executable callable from PowerShell, then rerun the planned `codex mcp add supabase ...` and `codex mcp login supabase` steps.

## Vercel Git integration for auto deploys

- Status: future manual step
- Command:

```powershell
pnpm dlx vercel@latest env add NEXT_PUBLIC_SUPABASE_URL preview
```

- Result: preview-scoped env management is blocked because Vercel reports that `project-afpcu` is not connected to a Git repository yet.
- Manual action needed: connect the Vercel project to `ArmanM1/Kinetic-Workout-App` in the Vercel dashboard if you want Git-based preview and production auto deploys on push.

## Vercel preview access for non-authenticated reviewers

- Status: optional future manual step
- Result: the latest preview deployment is healthy, but the current Vercel project keeps preview URLs behind Vercel Authentication.
- Manual action needed: if you want other people to open preview URLs without a Vercel login, disable or adjust deployment protection in the Vercel dashboard, or generate/share a protected access link.
