"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { markdownComponents } from "./markdown-components";
import { useLocale } from "@/lib/i18n";

interface SolutionPanelProps {
  solutionQuery: string;
  solutionExplanation: string;
}

export function SolutionPanel({
  solutionQuery,
  solutionExplanation,
}: SolutionPanelProps) {
  const { t } = useLocale();
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
        {t("exercise.revealSolution")}
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
        {t("exercise.hideSolution")}
      </Button>
      <div className="rounded-md border bg-muted/30 p-3">
        <p className="text-xs font-medium text-muted-foreground mb-2">{t("exercise.solutionQuery")}</p>
        <pre className="text-xs font-mono whitespace-pre-wrap overflow-auto">{solutionQuery.trim()}</pre>
      </div>
      <div className="max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {solutionExplanation}
        </ReactMarkdown>
      </div>
    </div>
  );
}
