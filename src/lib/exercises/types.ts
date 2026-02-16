export type Difficulty = "easy" | "medium" | "hard";

export type Category =
  | "window-functions"
  | "ctes"
  | "analytics-patterns"
  | "advanced-joins";

export interface TestCase {
  name: string;
  description: string;
  setupSql?: string;
  expectedColumns: string[];
  expectedRows: Record<string, unknown>[];
  orderMatters: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: Category;
  description: string;
  hint?: string;
  schema: string;
  solutionQuery: string;
  solutionExplanation: string;
  testCases: TestCase[];
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  executionTimeMs: number;
}

export interface ValidationResult {
  passed: boolean;
  testCase: string;
  message: string;
  missingRows?: Record<string, unknown>[];
  extraRows?: Record<string, unknown>[];
  columnMismatch?: {
    expected: string[];
    actual: string[];
  };
}
