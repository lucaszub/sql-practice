"use client";

import type { Components } from "react-markdown";

export const markdownComponents: Components = {
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-md border my-3">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-muted">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-medium text-muted-foreground border-b text-xs">
      {children}
    </th>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border-b hover:bg-muted/30">{children}</tr>
  ),
  td: ({ children }) => (
    <td className="px-3 py-1.5 font-mono text-xs">{children}</td>
  ),
  h2: ({ children }) => (
    <h2 className="text-base font-semibold mt-4 mb-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold mt-3 mb-1">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-sm text-muted-foreground mb-2">{children}</p>
  ),
  code: ({ children }) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
      {children}
    </code>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  ul: ({ children }) => (
    <ul className="text-sm text-muted-foreground mb-2 ml-4 list-disc space-y-1">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="text-sm text-muted-foreground mb-2 ml-4 list-decimal space-y-1">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="text-sm">{children}</li>,
};
