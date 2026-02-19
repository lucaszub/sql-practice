"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { markdownComponents } from "./markdown-components";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SchemaPanel } from "./schema-panel";
import { SolutionPanel } from "./solution-panel";
import { ExampleOutput } from "./example-output";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { useState } from "react";
import type { Exercise } from "@/lib/exercises/types";
import { useLocalizedExercise, useLocale } from "@/lib/i18n";

interface ExerciseDescriptionProps {
  exercise: Exercise;
  allowSolution?: boolean;
}

export function ExerciseDescription({ exercise, allowSolution = true }: ExerciseDescriptionProps) {
  const [showHint, setShowHint] = useState(false);
  const localized = useLocalizedExercise(exercise);
  const { t } = useLocale();

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <div className="max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {localized.localizedDescription}
          </ReactMarkdown>
        </div>

        <ExampleOutput exercise={exercise} />

        <SchemaPanel schemaSql={exercise.schema} />

        {localized.localizedHint && (
          <div>
            {!showHint ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(true)}
              >
                <Lightbulb className="mr-1 h-3 w-3" />
                {t("exercise.showHint")}
              </Button>
            ) : (
              <div className="rounded-md border border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950 p-3 text-sm">
                {localized.localizedHint}
              </div>
            )}
          </div>
        )}

        {allowSolution && (
          <SolutionPanel
            solutionQuery={exercise.solutionQuery}
            solutionExplanation={localized.localizedSolutionExplanation}
          />
        )}
      </div>
    </ScrollArea>
  );
}
