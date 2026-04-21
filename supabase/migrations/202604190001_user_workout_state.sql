create table if not exists public.user_workout_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger user_workout_state_set_updated_at
before update on public.user_workout_state
for each row execute function public.set_updated_at();

alter table public.user_workout_state enable row level security;

create policy "user_workout_state_manage_own" on public.user_workout_state
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
