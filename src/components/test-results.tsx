"use client";

import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { ValidationResult, TestCase } from "@/lib/exercises/types";
import { useLocale } from "@/lib/i18n";

interface TestResultsProps {
  results: ValidationResult[];
  testCases?: TestCase[];
}

export function TestResults({ results, testCases }: TestResultsProps) {
  const { t } = useLocale();

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
        <AlertCircle className="h-5 w-5" />
        <p className="text-sm">{t("test.submitToSee")}</p>
      </div>
    );
  }

  const passedCount = results.filter((r) => r.passed).length;
  const allPassed = passedCount === results.length;

  return (
    <div className="space-y-3">
      {/* Summary banner */}
      <div
        className={`rounded-lg px-4 py-3 flex items-center gap-3 ${
          allPassed
            ? "bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-900"
            : "bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-900"
        }`}
      >
        {allPassed ? (
          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500 shrink-0" />
        )}
        <div>
          <p className="text-sm font-semibold">
            {allPassed
              ? t("test.allPassed")
              : `${passedCount}/${results.length} ${t("test.testsPassed")}`}
          </p>
          {allPassed && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("test.greatJob")}
            </p>
          )}
        </div>
      </div>

      {/* Individual test cases */}
      <div className="space-y-2">
        {results.map((r, idx) => {
          const tc = testCases?.[idx];
          return (
            <div
              key={r.testCase}
              className={`rounded-lg border px-4 py-3 ${
                r.passed
                  ? "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/50"
                  : "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/50"
              }`}
            >
              <div className="flex items-start gap-2">
                {r.passed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{tc?.description ?? r.testCase}</p>
                  {!r.passed && (
                    <div className="mt-2 space-y-2">
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                        {r.message}
                      </p>
                      {r.columnMismatch && (
                        <div className="text-xs space-y-1 bg-background/80 rounded p-2 font-mono">
                          <p>
                            <span className="text-muted-foreground">{t("test.expectedColumns")} </span>
                            {r.columnMismatch.expected.join(", ")}
                          </p>
                          <p>
                            <span className="text-muted-foreground">{t("test.gotColumns")} </span>
                            {r.columnMismatch.actual.join(", ")}
                          </p>
                        </div>
                      )}
                      {r.missingRows && r.missingRows.length > 0 && (
                        <div className="text-xs bg-background/80 rounded p-2">
                          <p className="text-muted-foreground mb-1">{t("test.expectedRow")}</p>
                          <pre className="font-mono text-[11px] whitespace-pre-wrap overflow-auto">
                            {JSON.stringify(r.missingRows[0], null, 2)}
                          </pre>
                        </div>
                      )}
                      {r.extraRows && r.extraRows.length > 0 && (
                        <div className="text-xs bg-background/80 rounded p-2">
                          <p className="text-muted-foreground mb-1">{t("test.gotInstead")}</p>
                          <pre className="font-mono text-[11px] whitespace-pre-wrap overflow-auto">
                            {JSON.stringify(r.extraRows[0], null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
