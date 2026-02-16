import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import type { Exercise } from "@/lib/exercises/types";

interface ExerciseCardProps {
  exercise: Exercise;
  solved: boolean;
}

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const categoryLabels: Record<string, string> = {
  "window-functions": "Window Functions",
  ctes: "CTEs",
  "analytics-patterns": "Analytics",
  "advanced-joins": "Joins",
};

export function ExerciseCard({ exercise, solved }: ExerciseCardProps) {
  return (
    <Link href={`/exercise/${exercise.id}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={difficultyColors[exercise.difficulty]}>
                {exercise.difficulty}
              </Badge>
              <Badge variant="secondary">
                {categoryLabels[exercise.category] ?? exercise.category}
              </Badge>
            </div>
            {solved && <CheckCircle2 className="h-5 w-5 text-green-500" />}
          </div>
          <CardTitle className="text-base mt-2">{exercise.title}</CardTitle>
          <CardDescription className="text-xs line-clamp-2">
            {exercise.description.split("\n").find((l) => l.trim() && !l.startsWith("#") && !l.startsWith("|"))?.trim() ?? ""}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
