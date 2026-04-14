export type WeightUnit = "lb" | "kg";
export type ExerciseSource = "built-in" | "custom";
export type ExerciseTag = "standard" | "superset" | "drop_set" | "assisted";
export type WorkoutEntryPoint = "blank" | "split_day";

export type ExerciseCatalogItem = {
  id: string;
  slug: string;
  name: string;
  source: ExerciseSource;
  force: string | null;
  level: string | null;
  mechanic: string | null;
  equipment: string | null;
  category: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  anatomyLabel: string;
  images: string[];
  archived?: boolean;
};

export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
  gender: string | null;
  weightUnit: WeightUnit;
  bodyWeight: number | null;
  donationUrl: string;
};

export type BodyMetricEntry = {
  id: string;
  measuredAt: string;
  weight: number;
  unit: WeightUnit;
};

export type UserSettings = {
  weightUnit: WeightUnit;
  restTimerEnabled: boolean;
  restTimerSeconds: number;
  donationUrl: string;
  favoriteExerciseSlugs: string[];
  archivedExerciseSlugs: string[];
};

export type PreviousPerformance = {
  weight: number | null;
  reps: number | null;
  completedAt: string | null;
};

export type WorkoutSet = {
  id: string;
  setNumber: number;
  previousWeight: number | null;
  previousReps: number | null;
  draftWeight: number | null;
  draftReps: number | null;
  assistAmount: number | null;
  completedWeight: number | null;
  completedReps: number | null;
  completedAt: string | null;
};

export type SessionExercise = {
  id: string;
  exerciseSlug: string;
  exerciseName: string;
  order: number;
  tag: ExerciseTag;
  notes: string;
  targetWeight: number | null;
  targetReps: number | null;
  sets: WorkoutSet[];
};

export type ActiveWorkoutSession = {
  id: string;
  title: string;
  entryPoint: WorkoutEntryPoint;
  splitId: string | null;
  splitDayId: string | null;
  startedAt: string;
  notes: string;
  exercises: SessionExercise[];
  activeExerciseId: string | null;
  activeSetId: string | null;
  restTimerEndsAt: string | null;
};

export type CompletedWorkoutSession = ActiveWorkoutSession & {
  finishedAt: string;
};

export type SplitExercisePlan = {
  id: string;
  exerciseSlug: string;
  setCount: number;
  notes: string;
  targetWeight: number | null;
  targetReps: number | null;
  tag: ExerciseTag;
};

export type SplitDay = {
  id: string;
  name: string;
  sortOrder: number;
  focus: string;
  exercises: SplitExercisePlan[];
};

export type WorkoutSplit = {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  days: SplitDay[];
};

export type CatalogSearchFilters = {
  favoritesOnly?: boolean;
  source?: ExerciseSource | "all";
  equipment?: string;
  muscle?: string;
  recentSlugs?: string[];
};

export type DashboardStat = {
  label: string;
  value: string;
  hint: string;
};

export type KineticStoreState = {
  profile: UserProfile;
  bodyMetrics: BodyMetricEntry[];
  settings: UserSettings;
  splits: WorkoutSplit[];
  customExercises: ExerciseCatalogItem[];
  history: CompletedWorkoutSession[];
  activeSession: ActiveWorkoutSession | null;
  hasCompletedOnboarding: boolean;
};

export type RawExerciseRecord = {
  id: string;
  name: string;
  force: string | null;
  level: string | null;
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string | null;
  images: string[];
};
