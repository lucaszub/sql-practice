"use client";

import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { ValidationResult } from "@/lib/exercises/types";

interface TestResultsProps {
  results: ValidationResult[];
}

export function TestResults({ results }: TestResultsProps) {
  if (results.length === 0) return null;

  const allPassed = results.every((r) => r.passed);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {allPassed ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500" />
        )}
        <span className="text-sm font-medium">
          {allPassed
            ? "All tests passed!"
            : `${results.filter((r) => r.passed).length}/${results.length} tests passed`}
        </span>
      </div>
      <div className="space-y-1.5">
        {results.map((r) => (
          <div
            key={r.testCase}
            className={`rounded-md border px-3 py-2 text-xs ${
              r.passed
                ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
                : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
            }`}
          >
            <div className="flex items-center gap-1.5">
              {r.passed ? (
                <CheckCircle2 className="h-3 w-3 text-green-500" />
              ) : (
                <XCircle className="h-3 w-3 text-red-500" />
              )}
              <span className="font-medium">{r.testCase}</span>
            </div>
            {!r.passed && (
              <div className="mt-1 text-muted-foreground">
                <p>{r.message}</p>
                {r.columnMismatch && (
                  <div className="mt-1">
                    <p>Expected: {r.columnMismatch.expected.join(", ")}</p>
                    <p>Got: {r.columnMismatch.actual.join(", ")}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
