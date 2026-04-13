# Data Model Snapshot

Core user-owned concepts:

- `profiles`
- `body_metrics`
- `user_settings`
- `favorites`
- `workout_splits`
- `split_days`
- `split_day_exercises`
- `workout_sessions`
- `session_exercises`
- `set_logs`
- `workout_notes`

Global/shared concepts:

- `exercises`
- `exercise_aliases`
- `exercise_muscles`

Important behaviors:

- one active workout per user
- previous-performance lookup by exercise slug
- assisted effective load = bodyweight - assist amount
- completed workouts ignore unfinished sets on finish
