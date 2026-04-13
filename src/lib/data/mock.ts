import { findExerciseByName } from "@/lib/data/catalog";
import type {
  BodyMetricEntry,
  CompletedWorkoutSession,
  ExerciseCatalogItem,
  KineticStoreState,
  SplitDay,
  UserProfile,
  UserSettings,
  WorkoutSet,
  WorkoutSplit,
} from "@/types/kinetic";

function mustFindExercise(name: string) {
  return (
    findExerciseByName(name) ??
    findExerciseByName(name.replace(/-/g, " ")) ??
    null
  );
}

function createCompletedSet(
  setNumber: number,
  weight: number,
  reps: number,
  completedAt: string,
  assistAmount: number | null = null,
): WorkoutSet {
  return {
    id: `set-${setNumber}-${completedAt}`,
    setNumber,
    previousWeight: weight,
    previousReps: reps,
    draftWeight: weight,
    draftReps: reps,
    assistAmount,
    completedWeight: weight,
    completedReps: reps,
    completedAt,
  };
}

export const mockProfile: UserProfile = {
  id: "profile-demo",
  email: "demo@kinetic.app",
  displayName: "Arman",
  gender: "male",
  weightUnit: "lb",
  bodyWeight: 188,
  donationUrl: "https://buymeacoffee.com/kinetic",
};

export const mockBodyMetrics: BodyMetricEntry[] = [
  { id: "metric-1", measuredAt: "2026-03-08T07:00:00.000Z", weight: 191, unit: "lb" },
  { id: "metric-2", measuredAt: "2026-03-20T07:00:00.000Z", weight: 189, unit: "lb" },
  { id: "metric-3", measuredAt: "2026-04-10T07:00:00.000Z", weight: 188, unit: "lb" },
];

export const defaultSettings: UserSettings = {
  weightUnit: "lb",
  restTimerEnabled: true,
  restTimerSeconds: 105,
  donationUrl: "https://buymeacoffee.com/kinetic",
  favoriteExerciseSlugs: [],
  archivedExerciseSlugs: [],
};

const benchPress = mustFindExercise("Barbell Bench Press - Medium Grip");
const inclineDumbbell = mustFindExercise("Incline Dumbbell Press");
const cableFly = mustFindExercise("Cable Crossover");
const latPulldown = mustFindExercise("Wide-Grip Lat Pulldown");
const seatedRow = mustFindExercise("Seated Cable Rows");
const assistedPullUp = mustFindExercise("Pullups");
const squat = mustFindExercise("Barbell Squat");
const romanianDeadlift = mustFindExercise("Romanian Deadlift");
const splitSquat = mustFindExercise("Bulgarian Split Squat");
const shoulderPress = mustFindExercise("Seated Barbell Military Press");
const tricepPressdown = mustFindExercise("Triceps Pushdown");
const preacherCurl = mustFindExercise("Preacher Curl");

const catalogFallback = [
  benchPress,
  inclineDumbbell,
  cableFly,
  latPulldown,
  seatedRow,
  assistedPullUp,
  squat,
  romanianDeadlift,
  splitSquat,
  shoulderPress,
  tricepPressdown,
  preacherCurl,
].filter(Boolean) as ExerciseCatalogItem[];

export const customExercises: ExerciseCatalogItem[] = [
  {
    id: "kinetic-hatfield-squat",
    slug: "hatfield-squat",
    name: "Hatfield Squat",
    source: "custom",
    force: "push",
    level: "advanced",
    mechanic: "compound",
    equipment: "safety squat bar",
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["abdominals", "hamstrings"],
    instructions: [
      "Set the safety squat bar and use the rack handles for balance.",
      "Sit straight down with a controlled torso and drive up aggressively.",
    ],
    anatomyLabel: "Quadriceps",
    images: [],
  },
];

const pushDay: SplitDay = {
  id: "split-day-push",
  name: "Push Alpha",
  sortOrder: 1,
  focus: "Chest, anterior delts, triceps",
  exercises: [
    {
      id: "plan-bench",
      exerciseSlug: benchPress?.slug ?? catalogFallback[0].slug,
      setCount: 3,
      notes: "Pause the first rep and keep the last rep shy of failure.",
      targetWeight: 215,
      targetReps: 6,
      tag: "standard",
    },
    {
      id: "plan-incline",
      exerciseSlug: inclineDumbbell?.slug ?? catalogFallback[1].slug,
      setCount: 3,
      notes: "Use the previous top set if it felt smooth.",
      targetWeight: 80,
      targetReps: 8,
      tag: "standard",
    },
    {
      id: "plan-cable",
      exerciseSlug: cableFly?.slug ?? catalogFallback[2].slug,
      setCount: 3,
      notes: "Stretch hard and finish with a soft lockout.",
      targetWeight: 35,
      targetReps: 12,
      tag: "drop_set",
    },
  ],
};

const pullDay: SplitDay = {
  id: "split-day-pull",
  name: "Pull Engine",
  sortOrder: 2,
  focus: "Lats, upper back, biceps",
  exercises: [
    {
      id: "plan-lat",
      exerciseSlug: latPulldown?.slug ?? catalogFallback[3].slug,
      setCount: 3,
      notes: "Drive elbows to hips and hold the bottom for a beat.",
      targetWeight: 170,
      targetReps: 10,
      tag: "standard",
    },
    {
      id: "plan-row",
      exerciseSlug: seatedRow?.slug ?? catalogFallback[4].slug,
      setCount: 3,
      notes: "Chest tall, straps allowed.",
      targetWeight: 165,
      targetReps: 10,
      tag: "superset",
    },
    {
      id: "plan-pullup",
      exerciseSlug: assistedPullUp?.slug ?? catalogFallback[5].slug,
      setCount: 3,
      notes: "Track assist load so analytics stay honest.",
      targetWeight: null,
      targetReps: 8,
      tag: "assisted",
    },
  ],
};

const legDay: SplitDay = {
  id: "split-day-legs",
  name: "Lower Pressure",
  sortOrder: 3,
  focus: "Quads, glutes, hamstrings",
  exercises: [
    {
      id: "plan-squat",
      exerciseSlug: squat?.slug ?? catalogFallback[6].slug,
      setCount: 3,
      notes: "Top set then back-offs.",
      targetWeight: 295,
      targetReps: 5,
      tag: "standard",
    },
    {
      id: "plan-rdl",
      exerciseSlug: romanianDeadlift?.slug ?? catalogFallback[7].slug,
      setCount: 3,
      notes: "Full hinge, 3-second negative.",
      targetWeight: 225,
      targetReps: 8,
      tag: "standard",
    },
    {
      id: "plan-split-squat",
      exerciseSlug: splitSquat?.slug ?? catalogFallback[8].slug,
      setCount: 3,
      notes: "Use straps if grip is the limiter.",
      targetWeight: 55,
      targetReps: 10,
      tag: "standard",
    },
  ],
};

export const workoutSplits: WorkoutSplit[] = [
  {
    id: "split-kinetic-ppl",
    name: "Push Pull Legs",
    description:
      "The default split keeps the home screen biased toward fast logging and repeatable progression.",
    isDefault: true,
    days: [pushDay, pullDay, legDay],
  },
  {
    id: "split-upper-focus",
    name: "Upper Strength Pulse",
    description:
      "An upper-body-only option for weeks when recovery is tight and bench work matters most.",
    isDefault: false,
    days: [
      {
        id: "split-day-upper",
        name: "Upper Anchor",
        sortOrder: 1,
        focus: "Heavy press, vertical pull, arms",
        exercises: [
          {
            id: "plan-shoulder-press",
            exerciseSlug: shoulderPress?.slug ?? catalogFallback[9].slug,
            setCount: 3,
            notes: "Last set can become a top AMRAP.",
            targetWeight: 135,
            targetReps: 6,
            tag: "standard",
          },
          {
            id: "plan-triceps",
            exerciseSlug: tricepPressdown?.slug ?? catalogFallback[10].slug,
            setCount: 3,
            notes: "Run these as a clean pump superset.",
            targetWeight: 70,
            targetReps: 12,
            tag: "superset",
          },
          {
            id: "plan-curl",
            exerciseSlug: preacherCurl?.slug ?? catalogFallback[11].slug,
            setCount: 3,
            notes: "Control the eccentric every rep.",
            targetWeight: 75,
            targetReps: 10,
            tag: "superset",
          },
        ],
      },
    ],
  },
];

export const recentHistory: CompletedWorkoutSession[] = [
  {
    id: "history-push-1",
    title: "Push Alpha",
    entryPoint: "split_day",
    splitId: "split-kinetic-ppl",
    splitDayId: "split-day-push",
    startedAt: "2026-03-29T17:42:00.000Z",
    finishedAt: "2026-03-29T18:34:00.000Z",
    notes: "Bench moved fast. Left one rep in reserve.",
    activeExerciseId: null,
    activeSetId: null,
    restTimerEndsAt: null,
    exercises: [
      {
        id: "history-bench",
        exerciseSlug: benchPress?.slug ?? catalogFallback[0].slug,
        exerciseName: benchPress?.name ?? catalogFallback[0].name,
        order: 0,
        tag: "standard",
        notes: "First rep paused.",
        targetWeight: 215,
        targetReps: 6,
        sets: [
          createCompletedSet(1, 205, 6, "2026-03-29T17:51:00.000Z"),
          createCompletedSet(2, 210, 6, "2026-03-29T17:56:00.000Z"),
          createCompletedSet(3, 215, 5, "2026-03-29T18:01:00.000Z"),
        ],
      },
      {
        id: "history-incline",
        exerciseSlug: inclineDumbbell?.slug ?? catalogFallback[1].slug,
        exerciseName: inclineDumbbell?.name ?? catalogFallback[1].name,
        order: 1,
        tag: "standard",
        notes: "",
        targetWeight: 80,
        targetReps: 8,
        sets: [
          createCompletedSet(1, 75, 9, "2026-03-29T18:09:00.000Z"),
          createCompletedSet(2, 80, 8, "2026-03-29T18:14:00.000Z"),
          createCompletedSet(3, 80, 7, "2026-03-29T18:19:00.000Z"),
        ],
      },
      {
        id: "history-cable",
        exerciseSlug: cableFly?.slug ?? catalogFallback[2].slug,
        exerciseName: cableFly?.name ?? catalogFallback[2].name,
        order: 2,
        tag: "drop_set",
        notes: "Dropped 10 lb after the last set.",
        targetWeight: 35,
        targetReps: 12,
        sets: [
          createCompletedSet(1, 35, 14, "2026-03-29T18:26:00.000Z"),
          createCompletedSet(2, 35, 12, "2026-03-29T18:29:00.000Z"),
          createCompletedSet(3, 25, 15, "2026-03-29T18:32:00.000Z"),
        ],
      },
    ],
  },
  {
    id: "history-pull-1",
    title: "Pull Engine",
    entryPoint: "split_day",
    splitId: "split-kinetic-ppl",
    splitDayId: "split-day-pull",
    startedAt: "2026-04-01T16:02:00.000Z",
    finishedAt: "2026-04-01T16:49:00.000Z",
    notes: "Grip was tired but the back work still climbed.",
    activeExerciseId: null,
    activeSetId: null,
    restTimerEndsAt: null,
    exercises: [
      {
        id: "history-lat",
        exerciseSlug: latPulldown?.slug ?? catalogFallback[3].slug,
        exerciseName: latPulldown?.name ?? catalogFallback[3].name,
        order: 0,
        tag: "standard",
        notes: "",
        targetWeight: 170,
        targetReps: 10,
        sets: [
          createCompletedSet(1, 160, 11, "2026-04-01T16:08:00.000Z"),
          createCompletedSet(2, 170, 10, "2026-04-01T16:12:00.000Z"),
          createCompletedSet(3, 170, 9, "2026-04-01T16:17:00.000Z"),
        ],
      },
      {
        id: "history-row",
        exerciseSlug: seatedRow?.slug ?? catalogFallback[4].slug,
        exerciseName: seatedRow?.name ?? catalogFallback[4].name,
        order: 1,
        tag: "superset",
        notes: "",
        targetWeight: 165,
        targetReps: 10,
        sets: [
          createCompletedSet(1, 155, 12, "2026-04-01T16:24:00.000Z"),
          createCompletedSet(2, 165, 10, "2026-04-01T16:28:00.000Z"),
          createCompletedSet(3, 165, 9, "2026-04-01T16:33:00.000Z"),
        ],
      },
      {
        id: "history-pullups",
        exerciseSlug: assistedPullUp?.slug ?? catalogFallback[5].slug,
        exerciseName: assistedPullUp?.name ?? catalogFallback[5].name,
        order: 2,
        tag: "assisted",
        notes: "Assist amount tracked for analytics.",
        targetWeight: null,
        targetReps: 8,
        sets: [
          createCompletedSet(1, 0, 10, "2026-04-01T16:39:00.000Z", 35),
          createCompletedSet(2, 0, 8, "2026-04-01T16:42:00.000Z", 30),
          createCompletedSet(3, 0, 8, "2026-04-01T16:45:00.000Z", 25),
        ],
      },
    ],
  },
  {
    id: "history-legs-1",
    title: "Lower Pressure",
    entryPoint: "split_day",
    splitId: "split-kinetic-ppl",
    splitDayId: "split-day-legs",
    startedAt: "2026-04-04T18:12:00.000Z",
    finishedAt: "2026-04-04T19:04:00.000Z",
    notes: "Deep squats. Slight adductor fatigue on split squats.",
    activeExerciseId: null,
    activeSetId: null,
    restTimerEndsAt: null,
    exercises: [
      {
        id: "history-squat",
        exerciseSlug: squat?.slug ?? catalogFallback[6].slug,
        exerciseName: squat?.name ?? catalogFallback[6].name,
        order: 0,
        tag: "standard",
        notes: "",
        targetWeight: 295,
        targetReps: 5,
        sets: [
          createCompletedSet(1, 275, 5, "2026-04-04T18:20:00.000Z"),
          createCompletedSet(2, 285, 5, "2026-04-04T18:27:00.000Z"),
          createCompletedSet(3, 295, 4, "2026-04-04T18:34:00.000Z"),
        ],
      },
      {
        id: "history-rdl",
        exerciseSlug: romanianDeadlift?.slug ?? catalogFallback[7].slug,
        exerciseName: romanianDeadlift?.name ?? catalogFallback[7].name,
        order: 1,
        tag: "standard",
        notes: "",
        targetWeight: 225,
        targetReps: 8,
        sets: [
          createCompletedSet(1, 205, 10, "2026-04-04T18:44:00.000Z"),
          createCompletedSet(2, 225, 8, "2026-04-04T18:49:00.000Z"),
          createCompletedSet(3, 225, 8, "2026-04-04T18:54:00.000Z"),
        ],
      },
      {
        id: "history-split-squat",
        exerciseSlug: splitSquat?.slug ?? catalogFallback[8].slug,
        exerciseName: splitSquat?.name ?? catalogFallback[8].name,
        order: 2,
        tag: "standard",
        notes: "",
        targetWeight: 55,
        targetReps: 10,
        sets: [
          createCompletedSet(1, 50, 12, "2026-04-04T18:58:00.000Z"),
          createCompletedSet(2, 55, 10, "2026-04-04T19:01:00.000Z"),
          createCompletedSet(3, 55, 10, "2026-04-04T19:03:00.000Z"),
        ],
      },
    ],
  },
];

export function createInitialStoreState(): KineticStoreState {
  return {
    profile: mockProfile,
    bodyMetrics: mockBodyMetrics,
    settings: {
      ...defaultSettings,
      favoriteExerciseSlugs: [
        benchPress?.slug ?? catalogFallback[0].slug,
        latPulldown?.slug ?? catalogFallback[3].slug,
        squat?.slug ?? catalogFallback[6].slug,
      ],
    },
    splits: workoutSplits,
    customExercises,
    history: recentHistory,
    activeSession: null,
  };
}
