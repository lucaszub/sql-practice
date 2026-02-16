/* eslint-disable @typescript-eslint/no-require-imports */
import { describe, it, expect } from "vitest";
import { exercises } from "@/lib/exercises";
import { validateResult } from "@/lib/db/validator";
import type { QueryResult } from "@/lib/exercises/types";

// Native DuckDB for Node.js integration tests
const duckdb = require("duckdb");

function withDb(
  fn: (db: InstanceType<typeof duckdb.Database>) => Promise<void>
): Promise<void> {
  return new Promise((resolve, reject) => {
    const db = new duckdb.Database(":memory:", (err: Error | null) => {
      if (err) return reject(err);
      fn(db)
        .then(() => db.close(() => resolve()))
        .catch((e: Error) => db.close(() => reject(e)));
    });
  });
}

function exec(
  db: InstanceType<typeof duckdb.Database>,
  sql: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err: Error | null) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function query(
  db: InstanceType<typeof duckdb.Database>,
  sql: string
): Promise<Record<string, unknown>[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, (err: Error | null, rows: Record<string, unknown>[]) => {
      if (err) reject(err);
      else resolve(rows ?? []);
    });
  });
}

/** Normalize DuckDB Node output to match the format our validator expects */
function normalizeRow(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    if (v instanceof Date) {
      // DATE → "2024-01-15", TIMESTAMP → "2024-01-15 10:30:00"
      const iso = v.toISOString();
      const isDate =
        iso.endsWith("T00:00:00.000Z") || iso.endsWith("T00:00:00Z");
      out[k] = isDate ? iso.slice(0, 10) : iso.slice(0, 19).replace("T", " ");
    } else if (typeof v === "bigint") {
      out[k] = Number(v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

describe("Exercise integration tests", () => {
  for (const exercise of exercises) {
    const tc = exercise.testCases[0];
    if (!tc) continue;

    it(`${exercise.id}: solutionQuery passes default test case`, async () => {
      await withDb(async (db) => {
        // Load schema
        await exec(db, exercise.schema);

        // Run setup SQL if the test case has one
        if (tc.setupSql) {
          await exec(db, tc.setupSql);
        }

        // Execute solution query
        const rows = await query(db, exercise.solutionQuery);

        // Build QueryResult
        const columns =
          rows.length > 0 ? Object.keys(rows[0]) : tc.expectedColumns;
        const normalizedRows = rows.map(normalizeRow);

        const result: QueryResult = {
          columns,
          rows: normalizedRows,
          rowCount: rows.length,
          executionTimeMs: 0,
        };

        // Validate
        const validation = validateResult(tc, result);
        expect(validation.passed, validation.message).toBe(true);
      });
    });
  }
});
