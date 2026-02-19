import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Difficulty, ValidationResult } from "@/lib/exercises/types";

export interface QuizConfig {
  count: number;
  difficulty: Difficulty | "all";
  timeLimitMs: number; // 0 = no timer
}

export interface QuizAnswer {
  exerciseId: string;
  submitted: boolean;
  passed: boolean;
  skipped: boolean;
  sql: string;
  solutionViewed: boolean;
  validationResults: ValidationResult[];
}

export type QuizStatus = "idle" | "active" | "completed";

interface QuizSessionState {
  status: QuizStatus;
  config: QuizConfig;
  exerciseIds: string[];
  currentIndex: number;
  answers: Record<string, QuizAnswer>;
  startedAt: number;
  completedAt?: number;
  startQuiz: (config: QuizConfig, exerciseIds: string[]) => void;
  submitAnswer: (
    exerciseId: string,
    sql: string,
    passed: boolean,
    validationResults: ValidationResult[]
  ) => void;
  skipQuestion: (exerciseId: string) => void;
  viewSolution: (exerciseId: string) => void;
  nextQuestion: () => void;
  timeExpired: () => void;
  resetQuiz: () => void;
}

export const useQuizSession = create<QuizSessionState>()(
  persist(
    (set) => ({
      status: "idle",
      config: { count: 5, difficulty: "all", timeLimitMs: 0 },
      exerciseIds: [],
      currentIndex: 0,
      answers: {},
      startedAt: 0,

      startQuiz: (config, exerciseIds) =>
        set({
          status: "active",
          config,
          exerciseIds,
          currentIndex: 0,
          answers: {},
          startedAt: Date.now(),
          completedAt: undefined,
        }),

      submitAnswer: (exerciseId, sql, passed, validationResults) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [exerciseId]: {
              exerciseId,
              submitted: true,
              passed,
              skipped: false,
              sql,
              solutionViewed: state.answers[exerciseId]?.solutionViewed ?? false,
              validationResults,
            },
          },
        })),

      skipQuestion: (exerciseId) =>
        set((state) => {
          const nextIndex = state.currentIndex + 1;
          const isLast = nextIndex >= state.exerciseIds.length;
          return {
            answers: {
              ...state.answers,
              [exerciseId]: {
                exerciseId,
                submitted: true,
                passed: false,
                skipped: true,
                sql: "",
                solutionViewed: false,
                validationResults: [],
              },
            },
            currentIndex: isLast ? state.currentIndex : nextIndex,
            status: isLast ? "completed" : "active",
            completedAt: isLast ? Date.now() : undefined,
          };
        }),

      viewSolution: (exerciseId) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [exerciseId]: {
              ...state.answers[exerciseId],
              solutionViewed: true,
            },
          },
        })),

      nextQuestion: () =>
        set((state) => {
          const nextIndex = state.currentIndex + 1;
          const isLast = nextIndex >= state.exerciseIds.length;
          return {
            currentIndex: isLast ? state.currentIndex : nextIndex,
            status: isLast ? "completed" : "active",
            completedAt: isLast ? Date.now() : undefined,
          };
        }),

      timeExpired: () =>
        set({ status: "completed", completedAt: Date.now() }),

      resetQuiz: () =>
        set({
          status: "idle",
          exerciseIds: [],
          currentIndex: 0,
          answers: {},
          startedAt: 0,
          completedAt: undefined,
        }),
    }),
    { name: "sql-practice-quiz" }
  )
);
