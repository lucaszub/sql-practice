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
import { exercise as ex11 } from "@/exercises/11-select-where-basics/exercise";
import { exercise as ex12 } from "@/exercises/12-in-between-filtering/exercise";
import { exercise as ex13 } from "@/exercises/13-pattern-matching/exercise";
import { exercise as ex14 } from "@/exercises/14-sorting-results/exercise";
import { exercise as ex15 } from "@/exercises/15-limit-offset/exercise";
import { exercise as ex16 } from "@/exercises/16-multiple-conditions/exercise";
import { exercise as ex17 } from "@/exercises/17-filtered-catalog/exercise";
import { exercise as ex18 } from "@/exercises/18-count-basics/exercise";
import { exercise as ex19 } from "@/exercises/19-sum-avg-revenue/exercise";
import { exercise as ex20 } from "@/exercises/20-min-max-prices/exercise";
import { exercise as ex21 } from "@/exercises/21-group-by-category/exercise";
import { exercise as ex22 } from "@/exercises/22-group-by-multiple/exercise";
import { exercise as ex23 } from "@/exercises/23-having-filter/exercise";
import { exercise as ex24 } from "@/exercises/24-where-vs-having/exercise";
import { exercise as ex25 } from "@/exercises/25-inner-join-basics/exercise";
import { exercise as ex26 } from "@/exercises/26-join-with-aggregation/exercise";
import { exercise as ex27 } from "@/exercises/27-left-join-basics/exercise";
import { exercise as ex28 } from "@/exercises/28-left-join-missing/exercise";
import { exercise as ex29 } from "@/exercises/29-join-with-where/exercise";
import { exercise as ex30 } from "@/exercises/30-join-with-groupby/exercise";
import { exercise as ex31 } from "@/exercises/31-customer-summary/exercise";
import { exercise as ex32 } from "@/exercises/32-is-null-check/exercise";
import { exercise as ex33 } from "@/exercises/33-coalesce-defaults/exercise";
import { exercise as ex34 } from "@/exercises/34-case-when-basics/exercise";
import { exercise as ex35 } from "@/exercises/35-case-with-aggregation/exercise";
import { exercise as ex36 } from "@/exercises/36-null-case-combined/exercise";

export const exercises: Exercise[] = [
  ex01, ex02, ex03, ex04, ex05,
  ex06, ex07, ex08, ex09, ex10,
  ex11, ex12, ex13, ex14, ex15,
  ex16, ex17, ex18, ex19, ex20,
  ex21, ex22, ex23, ex24, ex25,
  ex26, ex27, ex28, ex29, ex30,
  ex31, ex32, ex33, ex34, ex35,
  ex36,
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
