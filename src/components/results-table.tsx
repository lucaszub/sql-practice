"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { useMemo } from "react";
import type { QueryResult } from "@/lib/exercises/types";

interface ResultsTableProps {
  result: QueryResult | null;
  error: string | null;
}

export function ResultsTable({ result, error }: ResultsTableProps) {
  const columns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
    if (!result) return [];
    return result.columns.map((col) => ({
      accessorKey: col,
      header: col,
      cell: (info) => {
        const val = info.getValue();
        if (val === null) return <span className="text-muted-foreground italic">NULL</span>;
        return String(val);
      },
    }));
  }, [result]);

  const table = useReactTable({
    data: result?.rows ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) {
    return (
      <div className="p-4">
        <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
          <p className="text-sm font-medium text-destructive">Error</p>
          <pre className="mt-1 text-xs text-destructive/80 whitespace-pre-wrap">{error}</pre>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Run a query to see results
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b bg-muted/50 flex items-center justify-between">
        <span className="text-sm font-medium">Results</span>
        <span className="text-xs text-muted-foreground">
          {result.rowCount} rows · {result.executionTimeMs.toFixed(1)}ms
        </span>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-2 text-left font-medium text-muted-foreground border-b"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-muted/30">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-1.5 font-mono text-xs">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
