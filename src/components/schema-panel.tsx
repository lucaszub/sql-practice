"use client";

import { useMemo } from "react";
import { Table, Columns3 } from "lucide-react";

interface TableInfo {
  name: string;
  columns: { name: string; type: string }[];
}

interface SchemaPanelProps {
  schemaSql: string;
}

function parseSchema(sql: string): TableInfo[] {
  const tables: TableInfo[] = [];
  const tableRegex = /CREATE\s+TABLE\s+(\w+)\s*\(([\s\S]*?)\);/gi;
  let match;

  while ((match = tableRegex.exec(sql)) !== null) {
    const tableName = match[1];
    const columnsStr = match[2];
    const columns: { name: string; type: string }[] = [];

    const lines = columnsStr.split(",").map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
      const parts = line.split(/\s+/);
      if (parts.length >= 2 && !parts[0].toUpperCase().startsWith("PRIMARY") && !parts[0].toUpperCase().startsWith("FOREIGN")) {
        columns.push({ name: parts[0], type: parts.slice(1).join(" ") });
      }
    }

    tables.push({ name: tableName, columns });
  }

  return tables;
}

export function SchemaPanel({ schemaSql }: SchemaPanelProps) {
  const tables = useMemo(() => parseSchema(schemaSql), [schemaSql]);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium flex items-center gap-1.5">
        <Columns3 className="h-4 w-4" />
        Schema
      </h3>
      {tables.map((table) => (
        <div key={table.name} className="rounded-md border">
          <div className="px-3 py-1.5 bg-muted/50 border-b flex items-center gap-1.5">
            <Table className="h-3 w-3" />
            <span className="text-sm font-mono font-medium">{table.name}</span>
          </div>
          <div className="px-3 py-1">
            {table.columns.map((col) => (
              <div key={col.name} className="flex justify-between py-0.5 text-xs">
                <span className="font-mono">{col.name}</span>
                <span className="text-muted-foreground">{col.type}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
