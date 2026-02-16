import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ExerciseProgress {
  solved: boolean;
  lastAttempt?: string;
  attempts: number;
  solvedAt?: string;
}

interface ProgressState {
  progress: Record<string, ExerciseProgress>;
  markSolved: (exerciseId: string, sql: string) => void;
  recordAttempt: (exerciseId: string, sql: string) => void;
  resetProgress: () => void;
  getSolvedCount: () => number;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},

      markSolved: (exerciseId, sql) =>
        set((state) => ({
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
        })),

      recordAttempt: (exerciseId, sql) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [exerciseId]: {
              ...state.progress[exerciseId],
              solved: state.progress[exerciseId]?.solved ?? false,
              lastAttempt: sql,
              attempts: (state.progress[exerciseId]?.attempts ?? 0) + 1,
            },
          },
        })),

      resetProgress: () => set({ progress: {} }),

      getSolvedCount: () =>
        Object.values(get().progress).filter((p) => p.solved).length,
    }),
    { name: "sql-practice-progress" }
  )
);
