"use client";

import type { Exercise } from "@/lib/exercises/types";

interface ExampleOutputProps {
  exercise: Exercise;
}

const MAX_PREVIEW_ROWS = 3;

export function ExampleOutput({ exercise }: ExampleOutputProps) {
  const testCase = exercise.testCases[0];
  if (!testCase || testCase.expectedRows.length === 0) return null;

  const columns = testCase.expectedColumns;
  const allRows = testCase.expectedRows;
  const previewRows = allRows.slice(0, MAX_PREVIEW_ROWS);
  const totalRows = allRows.length;

  return (
    <div className="space-y-1.5">
      <h3 className="text-sm font-semibold">Expected output</h3>
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-3 py-2 text-left font-medium text-muted-foreground border-b text-xs font-mono"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, i) => (
              <tr key={i} className="border-b last:border-b-0">
                {columns.map((col) => (
                  <td key={col} className="px-3 py-1.5 font-mono text-xs">
                    {row[col] === null ? (
                      <span className="text-muted-foreground italic">NULL</span>
                    ) : (
                      String(row[col])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalRows > MAX_PREVIEW_ROWS && (
        <p className="text-xs text-muted-foreground">
          ({totalRows} rows total)
        </p>
      )}
    </div>
  );
}
