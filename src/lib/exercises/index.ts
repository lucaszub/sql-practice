import type { Exercise, Category, Difficulty } from "./types";

import { exercise as ex01 } from "@/exercises/01-top-n-per-group/exercise";
import { exercise as ex02 } from "@/exercises/02-running-total/exercise";
import { exercise as ex03 } from "@/exercises/03-yoy-growth/exercise";
import { exercise as ex04 } from "@/exercises/04-gap-and-island/exercise";
import { exercise as ex05 } from "@/exercises/05-employee-hierarchy/exercise";
import { exercise as ex06 } from "@/exercises/06-date-series/exercise";
import { exercise as ex07 } from "@/exercises/07-cohort-retention/exercise";
import { exercise as ex08 } from "@/exercises/08-funnel-analysis/exercise";
import { exercise as ex09 } from "@/exercises/09-consecutive-days/exercise";
import { exercise as ex10 } from "@/exercises/10-anti-join/exercise";

export const exercises: Exercise[] = [
  ex01, ex02, ex03, ex04, ex05,
  ex06, ex07, ex08, ex09, ex10,
];

export function getExercise(id: string): Exercise | undefined {
  return exercises.find((e) => e.id === id);
}

export function getExercisesByCategory(category: Category): Exercise[] {
  return exercises.filter((e) => e.category === category);
}

export function getExercisesByDifficulty(difficulty: Difficulty): Exercise[] {
  return exercises.filter((e) => e.difficulty === difficulty);
}
