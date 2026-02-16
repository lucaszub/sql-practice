"use client";

import type { AsyncDuckDB } from "@duckdb/duckdb-wasm";
import type { QueryResult } from "@/lib/exercises/types";

// Arrow typeId constants (avoids importing apache-arrow)
const DATE_TYPE_IDS = new Set([8, -13, -14]); // Date, DateDay, DateMillisecond
const TS_TYPE_IDS = new Set([10, -15, -16, -17, -18]); // Timestamp variants
const DECIMAL_TYPE_ID = 7;

function formatDateMs(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

function formatTimestampMs(ms: number): string {
  return new Date(ms).toISOString().slice(0, 19).replace("T", " ");
}

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

    // Build per-column converters based on Arrow schema types
    const converters = new Map<string, (val: number) => string>();
    // Decimal columns: Arrow returns BN<Uint32Array>, need scale to convert
    const decimalScales = new Map<string, number>();

    for (const field of result.schema.fields) {
      const typeId = field.type.typeId;
      if (DATE_TYPE_IDS.has(typeId)) {
        // Arrow JS DateDay/DateMillisecond .get() returns epoch milliseconds
        converters.set(field.name, formatDateMs);
      } else if (TS_TYPE_IDS.has(typeId)) {
        // DuckDB TIMESTAMP is microseconds; Arrow JS may return ms or us
        // Heuristic: values > 1e14 are microseconds, otherwise milliseconds
        converters.set(field.name, (val) => {
          const ms = Math.abs(val) > 1e14 ? val / 1000 : val;
          return formatTimestampMs(ms);
        });
      } else if (typeId === DECIMAL_TYPE_ID) {
        // Arrow Decimal returns BN<Uint32Array> objects (unscaled integers)
        // field.type.scale tells us how many decimal places to restore
        const ft = field.type as unknown as { scale: number };
        decimalScales.set(field.name, ft.scale ?? 0);
      }
    }

    const rows: Record<string, unknown>[] = [];

    for (let i = 0; i < result.numRows; i++) {
      const row: Record<string, unknown> = {};
      for (const col of columns) {
        const vec = result.getChild(col);
        let val = vec?.get(i);
        if (val === null || val === undefined) {
          row[col] = null;
        } else {
          if (typeof val === "bigint") val = Number(val);
          // Decimal: Arrow returns BN<Uint32Array> objects, convert to number
          const scale = decimalScales.get(col);
          if (scale !== undefined && typeof val === "object") {
            // Number() calls BN[Symbol.toPrimitive] → unscaled integer
            const raw = Number(val);
            row[col] = scale > 0 ? raw / Math.pow(10, scale) : raw;
          } else {
            const converter = converters.get(col);
            if (converter && typeof val === "number") {
              row[col] = converter(val);
            } else {
              row[col] = val;
            }
          }
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

/** Drop all tables/views in main schema, then reload schema from scratch */
export async function resetSchema(
  db: AsyncDuckDB,
  schemaSql: string
): Promise<void> {
  const conn = await db.connect();
  try {
    // DuckDB's default 'main' schema cannot be dropped, so drop objects individually
    const tables = await conn.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'main'"
    );
    const nameCol = tables.getChild("table_name");
    if (nameCol) {
      for (let i = 0; i < tables.numRows; i++) {
        const name = nameCol.get(i);
        if (name) {
          await conn.query(`DROP TABLE IF EXISTS "${name}" CASCADE`);
        }
      }
    }
  } finally {
    await conn.close();
  }
  await loadSchema(db, schemaSql);
}
