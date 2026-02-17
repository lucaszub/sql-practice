/* eslint-disable @typescript-eslint/no-require-imports */
import { describe, it, expect } from "vitest";
import { neonCart } from "@/lib/companies/neon-cart";
import { validateResult } from "@/lib/db/validator";
import type { QueryResult } from "@/lib/exercises/types";
import type { CompanyProfile } from "@/lib/companies/types";

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

function testCompany(company: CompanyProfile) {
  describe(`Company: ${company.name}`, () => {
    for (const question of company.questions) {
      it(`${question.id}: ${question.title} — solution returns correct results`, async () => {
        await withDb(async (db) => {
          // Load schema
          await exec(db, company.schema);

          // Execute solution query
          const rows = await query(db, question.solutionQuery);
          const columns =
            rows.length > 0
              ? Object.keys(rows[0])
              : question.expectedColumns;
          const normalizedRows = rows.map(normalizeRow);

          const result: QueryResult = {
            columns,
            rows: normalizedRows,
            rowCount: rows.length,
            executionTimeMs: 0,
          };

          // Validate using same validator the UI uses
          const testCase = {
            name: question.id,
            description: question.title,
            expectedColumns: question.expectedColumns,
            expectedRows: question.expectedRows,
            orderMatters: question.orderMatters,
          };
          const validation = validateResult(testCase, result);
          expect(
            validation.passed,
            `${question.id} failed: ${validation.message}` +
              (validation.columnMismatch
                ? `\n  Expected columns: ${validation.columnMismatch.expected.join(", ")}` +
                  `\n  Got columns: ${validation.columnMismatch.actual.join(", ")}`
                : "") +
              (validation.missingRows
                ? `\n  Missing row: ${JSON.stringify(validation.missingRows[0])}`
                : "") +
              (validation.extraRows
                ? `\n  Got instead: ${JSON.stringify(validation.extraRows[0])}`
                : "")
          ).toBe(true);
        });
      });

      it(`${question.id}: ${question.title} — solution query column names match expectedColumns`, async () => {
        await withDb(async (db) => {
          await exec(db, company.schema);
          const rows = await query(db, question.solutionQuery);
          const actualCols =
            rows.length > 0
              ? Object.keys(rows[0]).map((c) => c.toLowerCase())
              : [];
          const expectedCols = question.expectedColumns.map((c) =>
            c.toLowerCase()
          );
          expect(actualCols).toEqual(expectedCols);
        });
      });

      it(`${question.id}: ${question.title} — row count matches`, async () => {
        await withDb(async (db) => {
          await exec(db, company.schema);
          const rows = await query(db, question.solutionQuery);
          expect(rows.length).toBe(question.expectedRows.length);
        });
      });
    }
  });
}

// Test all companies
testCompany(neonCart);
