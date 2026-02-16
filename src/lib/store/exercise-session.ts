import { create } from "zustand";
import type { QueryResult, ValidationResult } from "@/lib/exercises/types";

interface ExerciseSessionState {
  currentSql: string;
  queryResult: QueryResult | null;
  validationResults: ValidationResult[];
  isRunning: boolean;
  showSolution: boolean;
  showHint: boolean;
  error: string | null;

  setSql: (sql: string) => void;
  setQueryResult: (result: QueryResult | null) => void;
  setValidationResults: (results: ValidationResult[]) => void;
  setIsRunning: (running: boolean) => void;
  toggleSolution: () => void;
  toggleHint: () => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useExerciseSession = create<ExerciseSessionState>((set) => ({
  currentSql: "",
  queryResult: null,
  validationResults: [],
  isRunning: false,
  showSolution: false,
  showHint: false,
  error: null,

  setSql: (sql) => set({ currentSql: sql }),
  setQueryResult: (result) => set({ queryResult: result }),
  setValidationResults: (results) => set({ validationResults: results }),
  setIsRunning: (running) => set({ isRunning: running }),
  toggleSolution: () => set((s) => ({ showSolution: !s.showSolution })),
  toggleHint: () => set((s) => ({ showHint: !s.showHint })),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      currentSql: "",
      queryResult: null,
      validationResults: [],
      isRunning: false,
      showSolution: false,
      showHint: false,
      error: null,
    }),
}));
