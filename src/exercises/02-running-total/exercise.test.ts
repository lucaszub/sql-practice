import { describe, it, expect } from "vitest";
import { exercise } from "./exercise";
import { validateResult } from "@/lib/db/validator";
import type { QueryResult } from "@/lib/exercises/types";

describe(exercise.title, () => {
  it("has valid structure", () => {
    expect(exercise.id).toBe("02-running-total");
    expect(exercise.testCases.length).toBeGreaterThanOrEqual(2);
    expect(exercise.solutionQuery).toBeTruthy();
  });

  it("solution matches expected output for default test case", () => {
    const tc = exercise.testCases[0];
    const mockResult: QueryResult = {
      columns: tc.expectedColumns,
      rows: tc.expectedRows,
      rowCount: tc.expectedRows.length,
      executionTimeMs: 0,
    };
    expect(validateResult(tc, mockResult).passed).toBe(true);
  });

  it("rejects query without window functions", () => {
    const tc = exercise.testCases[0];
    const wrongResult: QueryResult = {
      columns: ["sale_date", "amount"],
      rows: [{ sale_date: "2024-01-01", amount: 100 }],
      rowCount: 1,
      executionTimeMs: 0,
    };
    expect(validateResult(tc, wrongResult).passed).toBe(false);
  });
});
