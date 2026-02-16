"use client";

import type { AsyncDuckDB } from "@duckdb/duckdb-wasm";
import type { QueryResult } from "@/lib/exercises/types";

export async function executeQuery(
  db: AsyncDuckDB,
  sql: string
): Promise<QueryResult> {
  const conn = await db.connect();
  const start = performance.now();

  try {
    const result = await conn.query(sql);
    const executionTimeMs = performance.now() - start;

    const columns = result.schema.fields.map((f) => f.name);
    const rows: Record<string, unknown>[] = [];

    for (let i = 0; i < result.numRows; i++) {
      const row: Record<string, unknown> = {};
      for (const col of columns) {
        const vec = result.getChild(col);
        const val = vec?.get(i);
        if (typeof val === "bigint") {
          row[col] = Number(val);
        } else {
          row[col] = val ?? null;
        }
      }
      rows.push(row);
    }

    return { columns, rows, rowCount: result.numRows, executionTimeMs };
  } finally {
    await conn.close();
  }
}

export async function loadSchema(
  db: AsyncDuckDB,
  schemaSql: string
): Promise<void> {
  const conn = await db.connect();
  try {
    const statements = schemaSql
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const stmt of statements) {
      await conn.query(stmt);
    }
  } finally {
    await conn.close();
  }
}
