import assert from "node:assert/strict";
import test from "node:test";

import {
  buildBodyRegionAnalytics,
  buildDashboardStats,
  buildLoggedExerciseOptions,
  calculateCurrentAndLongestStreak,
  calculateExerciseEstimatedOneRepMax,
  estimateOneRepMax,
} from "@/lib/domain/analytics";
import {
  addExerciseToSession,
  calculateEffectiveLoad,
  findPreviousPerformance,
  finishWorkout,
  getSessionVolume,
  moveSessionExercise,
  removeSessionExercise,
  selectActiveSet,
  startBlankWorkout,
  startWorkoutFromSplitDay,
} from "@/lib/domain/workout";
import { builtInExercises, findExerciseByName } from "@/lib/data/catalog";
import {
  createInitialStoreState,
  mockProfile,
  recentHistory,
} from "@/lib/data/mock";

function createHistoricalState() {
  const state = createInitialStoreState();

  return {
    ...state,
    profile: mockProfile,
    history: recentHistory,
  };
}

test("previous-value autofill uses most recent completed set", () => {
  const state = createHistoricalState();
  const session = startBlankWorkout(state.settings);
  const exercise = findExerciseByName("Barbell Bench Press - Medium Grip");

  assert.ok(exercise);

  const nextSession = addExerciseToSession(session, exercise, state.history);
  const firstSet = nextSession.exercises[0].sets[0];
  const previous = findPreviousPerformance(state.history, exercise.slug);

  assert.equal(firstSet.draftWeight, previous.weight);
  assert.equal(firstSet.draftReps, previous.reps);
});

test("active session exercises can be reordered and removed", () => {
  const state = createHistoricalState();
  const session = startBlankWorkout(state.settings);
  const bench = findExerciseByName("Barbell Bench Press - Medium Grip");
  const squat = findExerciseByName("Barbell Squat");

  assert.ok(bench);
  assert.ok(squat);

  const withBench = addExerciseToSession(session, bench, state.history);
  const withBoth = addExerciseToSession(withBench, squat, state.history);
  const reordered = moveSessionExercise(withBoth, 0, 1);

  assert.equal(reordered.exercises[0].exerciseName, squat.name);
  assert.equal(reordered.exercises[0].order, 0);
  assert.equal(reordered.exercises[1].order, 1);

  const removed = removeSessionExercise(reordered, reordered.exercises[0].id);

  assert.equal(removed.exercises.length, 1);
  assert.equal(removed.exercises[0].exerciseName, bench.name);
});


test("active set selection can be cleared", () => {
  const state = createHistoricalState();
  const session = startBlankWorkout(state.settings);
  const exercise = findExerciseByName("Barbell Bench Press - Medium Grip");

  assert.ok(exercise);

  const withExercise = addExerciseToSession(session, exercise, state.history);
  const selected = selectActiveSet(
    withExercise,
    withExercise.exercises[0].id,
    withExercise.exercises[0].sets[0].id,
  );
  const cleared = selectActiveSet(selected, null, null);

  assert.equal(cleared.activeExerciseId, null);
  assert.equal(cleared.activeSetId, null);
});

test("finishing a workout can apply an optional workout name", () => {
  const state = createHistoricalState();
  const session = startBlankWorkout(state.settings);
  const exercise = findExerciseByName("Barbell Bench Press - Medium Grip");

  assert.ok(exercise);

  const withExercise = addExerciseToSession(session, exercise, state.history);
  const completed = finishWorkout(
    {
      ...withExercise,
      exercises: withExercise.exercises.map((entry) => ({
        ...entry,
        sets: entry.sets.map((set, index) =>
          index === 0
            ? {
                ...set,
                completedWeight: 185,
                completedReps: 5,
                completedAt: "2026-05-13T12:00:00.000Z",
              }
            : set,
        ),
      })),
    },
    "Felt strong",
    "Birthday Bench",
  );

  assert.equal(completed.title, "Birthday Bench");
  assert.equal(completed.notes, "Felt strong");
  assert.equal(completed.exercises[0].sets.length, 1);
});

test("assisted load calculation subtracts assist amount from body weight", () => {
  const effective = calculateEffectiveLoad(
    {
      id: "set-1",
      setNumber: 1,
      previousWeight: 0,
      previousReps: 8,
      draftWeight: 0,
      draftReps: 8,
      assistAmount: 35,
      completedWeight: 0,
      completedReps: 8,
      completedAt: "2026-04-01T16:39:00.000Z",
    },
    "assisted",
    188,
  );

  assert.equal(effective, 153);
});

test("estimated 1RM uses the epley formula", () => {
  assert.equal(Math.round(estimateOneRepMax(200, 5)), 233);
});

test("volume calculations include recent history", () => {
  const state = createHistoricalState();
  const volume = getSessionVolume(state.history[0], state.profile);

  assert.ok(volume > 0);
});

test("streak calculations count current and longest runs", () => {
  const state = createHistoricalState();
  const streaks = calculateCurrentAndLongestStreak(state.history);

  assert.ok(streaks.current >= 1);
  assert.ok(streaks.longest >= streaks.current);
});

test("split launch builds exercises from the selected day", () => {
  const state = createInitialStoreState();
  const split = state.splits[0];
  const day = split.days[0];
  const session = startWorkoutFromSplitDay(
    day,
    [...builtInExercises, ...state.customExercises],
    state.history,
    state.settings,
    split.id,
  );

  assert.equal(session.exercises.length, day.exercises.length);
  assert.equal(session.title, day.name);
});

test("one-active-workout behavior is preserved at the store-model level", () => {
  const state = createInitialStoreState();
  const first = startBlankWorkout(state.settings);
  const second = startBlankWorkout(state.settings);

  assert.notEqual(first.id, second.id);
  assert.equal(state.activeSession, null);
});

test("dashboard stats report logged sessions and total volume", () => {
  const state = createHistoricalState();
  const stats = buildDashboardStats(state.history, state.profile);

  assert.equal(stats[0].value, String(state.history.length));
  assert.match(stats[2].value, /\d/);
});

test("exercise estimated 1RM uses the best logged set", () => {
  const state = createHistoricalState();
  const estimated = calculateExerciseEstimatedOneRepMax(
    state.history[0].exercises[0],
    state.profile.bodyWeight,
  );

  assert.equal(estimated, 252);
});

test("body region analytics summarize volume and ranked lifts", () => {
  const state = createHistoricalState();
  const analytics = buildBodyRegionAnalytics(
    state.history,
    state.profile,
    [...builtInExercises, ...state.customExercises],
  );
  const chest = analytics.details.find((detail) => detail.id === "chest");

  assert.ok(chest);
  assert.ok(chest.totalVolume > 0);
  assert.equal(chest.lifts[0]?.name, "Barbell Bench Press - Medium Grip");
});

test("logged exercise options expose all tracked exercises", () => {
  const state = createHistoricalState();
  const options = buildLoggedExerciseOptions(state.history);

  assert.ok(options.length >= 3);
  assert.ok(options.some((option) => option.name === "Barbell Squat"));
});
