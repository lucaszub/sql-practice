import type {
  TestCase,
  QueryResult,
  ValidationResult,
} from "@/lib/exercises/types";
import { useLocaleStore } from "@/lib/i18n";
import { translations, type TranslationKey } from "@/lib/i18n/translations";

function getT() {
  const locale = useLocaleStore.getState().locale;
  return (key: TranslationKey, params?: Record<string, string | number>) => {
    let text: string = translations[key][locale];
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, String(v));
      }
    }
    return text;
  };
}

function normalizeValue(v: unknown): unknown {
  if (v === null || v === undefined) return null;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "number") return Math.round(v * 10000) / 10000;
  const s = String(v);
  // Normalize midnight timestamps to date strings
  // e.g. "2024-01-01 00:00:00.000" or "2024-01-01 00:00:00" → "2024-01-01"
  // Handles DATE_TRUNC returning TIMESTAMP instead of DATE
  const midnightMatch = s.match(
    /^(\d{4}-\d{2}-\d{2})[T ](00:00:00(?:\.0+)?)$/
  );
  if (midnightMatch) return midnightMatch[1];
  return s;
}

function normalizeRow(row: Record<string, unknown>): Record<string, unknown> {
  const normalized: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    normalized[k.toLowerCase()] = normalizeValue(v);
  }
  return normalized;
}

function rowsEqual(
  a: Record<string, unknown>,
  b: Record<string, unknown>
): boolean {
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((k) => {
    const va = a[k];
    const vb = b[k];
    if (va === null && vb === null) return true;
    if (typeof va === "number" && typeof vb === "number") {
      return Math.abs(va - vb) < 0.0001;
    }
    return String(va) === String(vb);
  });
}

export function validateResult(
  testCase: TestCase,
  actual: QueryResult
): ValidationResult {
  const t = getT();
  const base = { testCase: testCase.name };

  const expectedCols = testCase.expectedColumns.map((c) => c.toLowerCase());
  const actualCols = actual.columns.map((c) => c.toLowerCase());

  if (
    expectedCols.length !== actualCols.length ||
    !expectedCols.every((c) => actualCols.includes(c))
  ) {
    return {
      ...base,
      passed: false,
      message: t("validator.incorrectColumns"),
      columnMismatch: {
        expected: testCase.expectedColumns,
        actual: actual.columns,
      },
    };
  }

  if (testCase.expectedRows.length !== actual.rows.length) {
    return {
      ...base,
      passed: false,
      message: t("validator.incorrectRowCount", {
        expected: testCase.expectedRows.length,
        actual: actual.rows.length,
      }),
    };
  }

  const normalizedExpected = testCase.expectedRows.map(normalizeRow);
  const normalizedActual = actual.rows.map(normalizeRow);

  if (testCase.orderMatters) {
    for (let i = 0; i < normalizedExpected.length; i++) {
      if (!rowsEqual(normalizedExpected[i], normalizedActual[i])) {
        return {
          ...base,
          passed: false,
          message: t("validator.incorrectRow", { row: i + 1 }),
          missingRows: [testCase.expectedRows[i]],
          extraRows: [actual.rows[i]],
        };
      }
    }
  } else {
    const missing = normalizedExpected.filter(
      (exp) => !normalizedActual.some((act) => rowsEqual(exp, act))
    );
    const extra = normalizedActual.filter(
      (act) => !normalizedExpected.some((exp) => rowsEqual(exp, act))
    );

    if (missing.length > 0 || extra.length > 0) {
      return {
        ...base,
        passed: false,
        message: t("validator.incorrectContent", {
          missing: missing.length,
          extra: extra.length,
        }),
        missingRows: missing.length > 0 ? missing : undefined,
        extraRows: extra.length > 0 ? extra : undefined,
      };
    }
  }

  return { ...base, passed: true, message: "OK" };
}
