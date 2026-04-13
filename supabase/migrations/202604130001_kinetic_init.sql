create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  gender text,
  weight_unit text not null default 'lb',
  body_weight numeric,
  donation_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.body_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  measured_at timestamptz not null default timezone('utc', now()),
  weight numeric not null,
  unit text not null default 'lb',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  weight_unit text not null default 'lb',
  rest_timer_enabled boolean not null default true,
  rest_timer_seconds integer not null default 90,
  donation_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  source text not null check (source in ('built-in', 'custom')),
  name text not null,
  force text,
  level text,
  mechanic text,
  equipment text,
  category text,
  instructions jsonb not null default '[]'::jsonb,
  anatomy_label text,
  archived boolean not null default false,
  created_by uuid references auth.users (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.exercise_aliases (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises (id) on delete cascade,
  alias text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (exercise_id, alias)
);

create table if not exists public.exercise_muscles (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.exercises (id) on delete cascade,
  muscle text not null,
  is_primary boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  unique (exercise_id, muscle, is_primary)
);

create table if not exists public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, exercise_id)
);

create table if not exists public.workout_splits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text,
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists workout_splits_one_default_per_user
  on public.workout_splits (user_id)
  where is_default;

create table if not exists public.split_days (
  id uuid primary key default gen_random_uuid(),
  split_id uuid not null references public.workout_splits (id) on delete cascade,
  name text not null,
  focus text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.split_day_exercises (
  id uuid primary key default gen_random_uuid(),
  split_day_id uuid not null references public.split_days (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id) on delete restrict,
  sort_order integer not null default 0,
  set_count integer not null default 3,
  notes text,
  target_weight numeric,
  target_reps integer,
  tag text not null default 'standard' check (tag in ('standard', 'superset', 'drop_set', 'assisted')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  entry_point text not null check (entry_point in ('blank', 'split_day')),
  split_id uuid references public.workout_splits (id) on delete set null,
  split_day_id uuid references public.split_days (id) on delete set null,
  status text not null default 'active' check (status in ('active', 'completed')),
  started_at timestamptz not null default timezone('utc', now()),
  finished_at timestamptz,
  notes text,
  rest_timer_ends_at timestamptz,
  active_exercise_id uuid,
  active_set_id uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists workout_sessions_one_active_per_user
  on public.workout_sessions (user_id)
  where status = 'active';

create table if not exists public.session_exercises (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id) on delete restrict,
  sort_order integer not null default 0,
  tag text not null default 'standard' check (tag in ('standard', 'superset', 'drop_set', 'assisted')),
  notes text,
  target_weight numeric,
  target_reps integer,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.set_logs (
  id uuid primary key default gen_random_uuid(),
  session_exercise_id uuid not null references public.session_exercises (id) on delete cascade,
  set_number integer not null,
  previous_weight numeric,
  previous_reps integer,
  draft_weight numeric,
  draft_reps integer,
  assist_amount numeric,
  completed_weight numeric,
  completed_reps integer,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (session_exercise_id, set_number)
);

create table if not exists public.workout_notes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.workout_sessions (id) on delete cascade,
  note text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists body_metrics_user_measured_idx on public.body_metrics (user_id, measured_at desc);
create index if not exists exercises_source_name_idx on public.exercises (source, name);
create index if not exists exercises_created_by_idx on public.exercises (created_by);
create index if not exists exercise_aliases_alias_idx on public.exercise_aliases (alias);
create index if not exists exercise_muscles_muscle_idx on public.exercise_muscles (muscle);
create index if not exists workout_splits_user_idx on public.workout_splits (user_id);
create index if not exists split_days_split_idx on public.split_days (split_id, sort_order);
create index if not exists split_day_exercises_day_idx on public.split_day_exercises (split_day_id, sort_order);
create index if not exists workout_sessions_user_status_idx on public.workout_sessions (user_id, status, started_at desc);
create index if not exists session_exercises_session_idx on public.session_exercises (session_id, sort_order);
create index if not exists set_logs_session_exercise_idx on public.set_logs (session_exercise_id, set_number);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger user_settings_set_updated_at
before update on public.user_settings
for each row execute function public.set_updated_at();

create trigger exercises_set_updated_at
before update on public.exercises
for each row execute function public.set_updated_at();

create trigger workout_splits_set_updated_at
before update on public.workout_splits
for each row execute function public.set_updated_at();

create trigger split_days_set_updated_at
before update on public.split_days
for each row execute function public.set_updated_at();

create trigger split_day_exercises_set_updated_at
before update on public.split_day_exercises
for each row execute function public.set_updated_at();

create trigger workout_sessions_set_updated_at
before update on public.workout_sessions
for each row execute function public.set_updated_at();

create trigger session_exercises_set_updated_at
before update on public.session_exercises
for each row execute function public.set_updated_at();

create trigger set_logs_set_updated_at
before update on public.set_logs
for each row execute function public.set_updated_at();

create trigger workout_notes_set_updated_at
before update on public.workout_notes
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.body_metrics enable row level security;
alter table public.user_settings enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_aliases enable row level security;
alter table public.exercise_muscles enable row level security;
alter table public.favorites enable row level security;
alter table public.workout_splits enable row level security;
alter table public.split_days enable row level security;
alter table public.split_day_exercises enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.session_exercises enable row level security;
alter table public.set_logs enable row level security;
alter table public.workout_notes enable row level security;

create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "body_metrics_manage_own" on public.body_metrics
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "user_settings_manage_own" on public.user_settings
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "exercises_select_shared_or_owned" on public.exercises
for select using (source = 'built-in' or created_by = auth.uid());
create policy "exercises_insert_custom_own" on public.exercises
for insert with check (source = 'custom' and created_by = auth.uid());
create policy "exercises_update_custom_own" on public.exercises
for update using (source = 'custom' and created_by = auth.uid())
with check (source = 'custom' and created_by = auth.uid());
create policy "exercises_delete_custom_own" on public.exercises
for delete using (source = 'custom' and created_by = auth.uid());

create policy "exercise_aliases_select_visible_exercises" on public.exercise_aliases
for select using (
  exists (
    select 1
    from public.exercises
    where exercises.id = exercise_aliases.exercise_id
      and (exercises.source = 'built-in' or exercises.created_by = auth.uid())
  )
);

create policy "exercise_muscles_select_visible_exercises" on public.exercise_muscles
for select using (
  exists (
    select 1
    from public.exercises
    where exercises.id = exercise_muscles.exercise_id
      and (exercises.source = 'built-in' or exercises.created_by = auth.uid())
  )
);

create policy "favorites_manage_own" on public.favorites
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "workout_splits_manage_own" on public.workout_splits
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "split_days_manage_visible_splits" on public.split_days
for all using (
  exists (
    select 1 from public.workout_splits
    where workout_splits.id = split_days.split_id
      and workout_splits.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.workout_splits
    where workout_splits.id = split_days.split_id
      and workout_splits.user_id = auth.uid()
  )
);

create policy "split_day_exercises_manage_visible_days" on public.split_day_exercises
for all using (
  exists (
    select 1
    from public.split_days
    join public.workout_splits on workout_splits.id = split_days.split_id
    where split_days.id = split_day_exercises.split_day_id
      and workout_splits.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.split_days
    join public.workout_splits on workout_splits.id = split_days.split_id
    where split_days.id = split_day_exercises.split_day_id
      and workout_splits.user_id = auth.uid()
  )
);

create policy "workout_sessions_manage_own" on public.workout_sessions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "session_exercises_manage_visible_sessions" on public.session_exercises
for all using (
  exists (
    select 1 from public.workout_sessions
    where workout_sessions.id = session_exercises.session_id
      and workout_sessions.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.workout_sessions
    where workout_sessions.id = session_exercises.session_id
      and workout_sessions.user_id = auth.uid()
  )
);

create policy "set_logs_manage_visible_session_exercises" on public.set_logs
for all using (
  exists (
    select 1
    from public.session_exercises
    join public.workout_sessions on workout_sessions.id = session_exercises.session_id
    where session_exercises.id = set_logs.session_exercise_id
      and workout_sessions.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.session_exercises
    join public.workout_sessions on workout_sessions.id = session_exercises.session_id
    where session_exercises.id = set_logs.session_exercise_id
      and workout_sessions.user_id = auth.uid()
  )
);

create policy "workout_notes_manage_visible_sessions" on public.workout_notes
for all using (
  exists (
    select 1 from public.workout_sessions
    where workout_sessions.id = workout_notes.session_id
      and workout_sessions.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.workout_sessions
    where workout_sessions.id = workout_notes.session_id
      and workout_sessions.user_id = auth.uid()
  )
);
