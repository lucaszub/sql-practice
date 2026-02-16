import { describe, it, expect } from "vitest";
import { validateResult } from "./validator";
import type { TestCase, QueryResult } from "@/lib/exercises/types";

const makeResult = (
  columns: string[],
  rows: Record<string, unknown>[]
): QueryResult => ({
  columns,
  rows,
  rowCount: rows.length,
  executionTimeMs: 0,
});

describe("validateResult", () => {
  const testCase: TestCase = {
    name: "basic",
    description: "Basic test",
    expectedColumns: ["name", "value"],
    expectedRows: [
      { name: "Alice", value: 100 },
      { name: "Bob", value: 200 },
    ],
    orderMatters: false,
  };

  it("passes when results match (unordered)", () => {
    const result = makeResult(
      ["name", "value"],
      [
        { name: "Bob", value: 200 },
        { name: "Alice", value: 100 },
      ]
    );
    expect(validateResult(testCase, result).passed).toBe(true);
  });

  it("fails on column mismatch", () => {
    const result = makeResult(
      ["name", "amount"],
      [
        { name: "Alice", amount: 100 },
        { name: "Bob", amount: 200 },
      ]
    );
    const v = validateResult(testCase, result);
    expect(v.passed).toBe(false);
    expect(v.columnMismatch).toBeDefined();
  });

  it("fails on row count mismatch", () => {
    const result = makeResult(
      ["name", "value"],
      [{ name: "Alice", value: 100 }]
    );
    const v = validateResult(testCase, result);
    expect(v.passed).toBe(false);
    expect(v.message).toContain("1");
  });

  it("fails on wrong row content", () => {
    const result = makeResult(
      ["name", "value"],
      [
        { name: "Alice", value: 100 },
        { name: "Charlie", value: 300 },
      ]
    );
    const v = validateResult(testCase, result);
    expect(v.passed).toBe(false);
    expect(v.missingRows).toBeDefined();
    expect(v.extraRows).toBeDefined();
  });

  it("handles float tolerance", () => {
    const tc: TestCase = {
      name: "float",
      description: "Float test",
      expectedColumns: ["rate"],
      expectedRows: [{ rate: 0.3333 }],
      orderMatters: false,
    };
    const result = makeResult(["rate"], [{ rate: 0.33334 }]);
    expect(validateResult(tc, result).passed).toBe(true);
  });

  it("handles NULL values", () => {
    const tc: TestCase = {
      name: "null",
      description: "Null test",
      expectedColumns: ["name"],
      expectedRows: [{ name: null }],
      orderMatters: false,
    };
    const result = makeResult(["name"], [{ name: null }]);
    expect(validateResult(tc, result).passed).toBe(true);
  });

  it("enforces order when orderMatters is true", () => {
    const ordered: TestCase = { ...testCase, orderMatters: true };
    const result = makeResult(
      ["name", "value"],
      [
        { name: "Bob", value: 200 },
        { name: "Alice", value: 100 },
      ]
    );
    expect(validateResult(ordered, result).passed).toBe(false);
  });

  it("case-insensitive column names", () => {
    const result = makeResult(
      ["NAME", "VALUE"],
      [
        { NAME: "Alice", VALUE: 100 },
        { NAME: "Bob", VALUE: 200 },
      ]
    );
    expect(validateResult(testCase, result).passed).toBe(true);
  });
});
