export type Difficulty = "easy" | "medium" | "hard";

export type Category =
  | "select-fundamentals"
  | "aggregation"
  | "basic-joins"
  | "null-handling"
  | "ddl-dml"
  | "data-types-constraints"
  | "multi-table-joins"
  | "subqueries-ctes"
  | "window-functions"
  | "analytics-patterns"
  | "anti-joins-set-ops"
  | "date-string-functions"
  | "conditional-aggregation"
  | "schema-design"
  | "ctes"
  | "advanced-joins"
  | "running-totals"
  | "gaps-islands"
  | "cohort-retention"
  | "funnel-analysis"
  | "revenue-metrics"
  | "pivot-unpivot"
  | "duckdb-modern-sql"
  | "recursive-ctes"
  | "merge-upsert"
  | "incremental-loads"
  | "query-optimization"
  | "data-quality"
  | "nested-data"
  | "star-schema"
  | "scd";

export interface TestCase {
  name: string;
  description: string;
  descriptionFr?: string;
  setupSql?: string;
  expectedColumns: string[];
  expectedRows: Record<string, unknown>[];
  orderMatters: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  titleFr?: string;
  difficulty: Difficulty;
  category: Category;
  description: string;
  descriptionFr?: string;
  hint?: string;
  hintFr?: string;
  schema: string;
  solutionQuery: string;
  solutionExplanation: string;
  solutionExplanationFr?: string;
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
