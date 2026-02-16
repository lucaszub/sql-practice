import type { Exercise, TestCase } from "@/lib/exercises/types";
import type { Locale } from "./translations";
import { useLocaleStore } from "./use-locale";

interface LocalizedTestCase extends TestCase {
  localizedDescription: string;
}

interface LocalizedExercise extends Exercise {
  localizedTitle: string;
  localizedDescription: string;
  localizedHint?: string;
  localizedSolutionExplanation: string;
  localizedTestCases: LocalizedTestCase[];
}

function localizeExercise(exercise: Exercise, locale: Locale): LocalizedExercise {
  const isFr = locale === "fr";
  return {
    ...exercise,
    localizedTitle: (isFr && exercise.titleFr) || exercise.title,
    localizedDescription: (isFr && exercise.descriptionFr) || exercise.description,
    localizedHint: (isFr && exercise.hintFr) || exercise.hint,
    localizedSolutionExplanation:
      (isFr && exercise.solutionExplanationFr) || exercise.solutionExplanation,
    localizedTestCases: exercise.testCases.map((tc) => ({
      ...tc,
      localizedDescription: (isFr && tc.descriptionFr) || tc.description,
    })),
  };
}

export function useLocalizedExercise(exercise: Exercise): LocalizedExercise {
  const locale = useLocaleStore((s) => s.locale);
  return localizeExercise(exercise, locale);
}

export type { LocalizedExercise, LocalizedTestCase };
