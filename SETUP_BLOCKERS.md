# Setup Blockers

## Supabase hosted auth configuration

- Status: one manual auth step remains
- Commands attempted:

```powershell
codex mcp add supabase --url https://mcp.supabase.com/mcp?project_ref=ohiqtpvbhzifhwujohos
codex mcp login supabase
pnpm dlx supabase login
```

- Result: the Codex MCP connection is now working, and the local `supabase/config.toml` already has `enable_confirmations = false`, but the standalone Supabase CLI still cannot authenticate in this non-interactive shell without a token.
- Manual action needed: either set `SUPABASE_ACCESS_TOKEN` on this machine and rerun `pnpm dlx supabase config push --project-ref ohiqtpvbhzifhwujohos`, or turn off email confirmations directly in the Supabase dashboard for project `ohiqtpvbhzifhwujohos`.

## Vercel preview access for non-authenticated reviewers

- Status: optional future manual step
- Result: deployments are healthy, but preview URLs may still sit behind Vercel Authentication depending on the project protection settings.
- Manual action needed: if you want other people to open preview links without a Vercel login, relax deployment protection in the Vercel dashboard or share a protected access link.
