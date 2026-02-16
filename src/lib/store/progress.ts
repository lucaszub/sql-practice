import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ExerciseProgress {
  solved: boolean;
  lastAttempt?: string;
  attempts: number;
  solvedAt?: string;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

interface ProgressState {
  progress: Record<string, ExerciseProgress>;
  /** Set of "YYYY-MM-DD" strings representing days with activity */
  activityDays: string[];
  markSolved: (exerciseId: string, sql: string) => void;
  recordAttempt: (exerciseId: string, sql: string) => void;
  resetProgress: () => void;
  getSolvedCount: () => number;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      activityDays: [],

      markSolved: (exerciseId, sql) =>
        set((state) => {
          const today = todayKey();
          const days = state.activityDays.includes(today)
            ? state.activityDays
            : [...state.activityDays, today];
          return {
            activityDays: days,
            progress: {
              ...state.progress,
              [exerciseId]: {
                ...state.progress[exerciseId],
                solved: true,
                lastAttempt: sql,
                attempts: (state.progress[exerciseId]?.attempts ?? 0) + 1,
                solvedAt: new Date().toISOString(),
              },
            },
          };
        }),

      recordAttempt: (exerciseId, sql) =>
        set((state) => {
          const today = todayKey();
          const days = state.activityDays.includes(today)
            ? state.activityDays
            : [...state.activityDays, today];
          return {
            activityDays: days,
            progress: {
              ...state.progress,
              [exerciseId]: {
                ...state.progress[exerciseId],
                solved: state.progress[exerciseId]?.solved ?? false,
                lastAttempt: sql,
                attempts: (state.progress[exerciseId]?.attempts ?? 0) + 1,
              },
            },
          };
        }),

      resetProgress: () => set({ progress: {}, activityDays: [] }),

      getSolvedCount: () =>
        Object.values(get().progress).filter((p) => p.solved).length,
    }),
    { name: "sql-practice-progress" }
  )
);
