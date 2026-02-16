"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SolutionPanelProps {
  solutionQuery: string;
  solutionExplanation: string;
}

export function SolutionPanel({
  solutionQuery,
  solutionExplanation,
}: SolutionPanelProps) {
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setRevealed(true)}
        className="w-full"
      >
        <Eye className="mr-1 h-3 w-3" />
        Reveal Solution
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setRevealed(false)}
      >
        <EyeOff className="mr-1 h-3 w-3" />
        Hide Solution
      </Button>
      <div className="rounded-md border bg-muted/30 p-3">
        <p className="text-xs font-medium text-muted-foreground mb-2">Solution Query</p>
        <pre className="text-xs font-mono whitespace-pre-wrap overflow-auto">{solutionQuery.trim()}</pre>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {solutionExplanation}
        </ReactMarkdown>
      </div>
    </div>
  );
}
