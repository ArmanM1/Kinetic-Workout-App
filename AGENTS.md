# Kinetic Agent Guide

Kinetic is a web app only. Do not propose or build native mobile app flows.

## Product constraints

- Supabase is the backend.
- Vercel is the host.
- Email/password auth only.
- Anonymous auth is forbidden.
- Local-only behavior is not the goal.
- Mobile-first UX is required.
- Fast workout logging and previous-value autofill are the highest-priority product behaviors.

## Implementation rules

- Use MCP and plugin tooling when available, especially GitHub and Vercel.
- Keep the architecture simple and App Router friendly.
- Avoid adding a custom backend unless Supabase truly cannot cover a requirement.
- Treat one active workout at a time as a hard product rule.
- Preserve the dark-first, neon-lime visual direction unless the user requests a new design pass.
