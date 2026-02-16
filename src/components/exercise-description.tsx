"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SchemaPanel } from "./schema-panel";
import { SolutionPanel } from "./solution-panel";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { useState } from "react";
import type { Exercise } from "@/lib/exercises/types";

interface ExerciseDescriptionProps {
  exercise: Exercise;
}

export function ExerciseDescription({ exercise }: ExerciseDescriptionProps) {
  const [showHint, setShowHint] = useState(false);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {exercise.description}
          </ReactMarkdown>
        </div>

        <SchemaPanel schemaSql={exercise.schema} />

        {exercise.hint && (
          <div>
            {!showHint ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(true)}
              >
                <Lightbulb className="mr-1 h-3 w-3" />
                Show Hint
              </Button>
            ) : (
              <div className="rounded-md border border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950 p-3 text-sm">
                {exercise.hint}
              </div>
            )}
          </div>
        )}

        <SolutionPanel
          solutionQuery={exercise.solutionQuery}
          solutionExplanation={exercise.solutionExplanation}
        />
      </div>
    </ScrollArea>
  );
}
