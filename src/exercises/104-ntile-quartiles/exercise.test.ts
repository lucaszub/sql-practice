import { describe, it, expect } from "vitest";
import { exercise } from "./exercise";
import { validateResult } from "@/lib/db/validator";
import type { QueryResult } from "@/lib/exercises/types";

describe(exercise.title, () => {
  it("has valid structure", () => {
    expect(exercise.id).toBe("104-ntile-quartiles");
    expect(exercise.testCases.length).toBeGreaterThanOrEqual(2);
    expect(exercise.solutionQuery).toBeTruthy();
    expect(exercise.schema).toContain("CREATE TABLE");
  });

  it("solution matches expected output for default test case", () => {
    const tc = exercise.testCases[0];
    const mockResult: QueryResult = {
      columns: tc.expectedColumns,
      rows: tc.expectedRows,
      rowCount: tc.expectedRows.length,
      executionTimeMs: 0,
    };
    const result = validateResult(tc, mockResult);
    expect(result.passed).toBe(true);
  });

  it("rejects wrong number of columns", () => {
    const tc = exercise.testCases[0];
    const wrongResult: QueryResult = {
      columns: ["customer_name", "total_spent"],
      rows: [{ customer_name: "Noah Patel", total_spent: 22000.00 }],
      rowCount: 1,
      executionTimeMs: 0,
    };
    const result = validateResult(tc, wrongResult);
    expect(result.passed).toBe(false);
  });

  it("rejects wrong row count", () => {
    const tc = exercise.testCases[0];
    const wrongResult: QueryResult = {
      columns: tc.expectedColumns,
      rows: tc.expectedRows.slice(0, 3),
      rowCount: 3,
      executionTimeMs: 0,
    };
    const result = validateResult(tc, wrongResult);
    expect(result.passed).toBe(false);
  });
});
